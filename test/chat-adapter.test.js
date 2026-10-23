import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { passageSnapshotKey } from '../src/store.js'
import { listTargets, registerChatAdapter } from '../src/chat-adapter.js'

function thought(key) {
  return `<div data-chat-flow-kind="assistant-step" data-chat-node-key="${key}" data-chat-turn="1"><div data-variant="think"><div data-disclosure-row role="button" aria-expanded="false"><span><svg></svg></span><span>Native title</span></div></div></div>`
}

test('native header adaptation is scoped, reversible, and never consumes on DOM updates', async () => {
  const dom = new JSDOM(`<body><div data-conversation-session="session-a">${thought('14:assistant-step1:1')}${thought('14:assistant-step1:2')}</div></body>`)
  const originals = Object.fromEntries(['document','Element','MutationObserver'].map(key => [key, globalThis[key]]))
  for (const key of Object.keys(originals)) globalThis[key] = dom.window[key]
  let settings = { enabled:true, currentBookId:'book', targets:[{sessionId:'session-a',nodeKey:'14:assistant-step1:1'}], icon:'◎', mainTitle:'思考', extraTitle:'Checking project structure' }
  let ui = { picking:false }
  const claims=[]; const targets=[]; const effects=[]; const actions={}
  const add=dom.window.document.addEventListener.bind(dom.window.document)
  dom.window.document.addEventListener=(type,handler,...args)=>{actions[type]=handler;return add(type,handler,...args)}
  let settingsChanged
  const store={
    settingsSource:{},passageSource:{}, getSettingsSnapshot:()=>settings,getUiSnapshot:()=>ui,
    subscribeSettings:fn=>{settingsChanged=fn;return ()=>{}},subscribeUi:()=>()=>{},
    claimPassage:key=>{claims.push(key);return Promise.resolve()},addTarget:id=>{targets.push(id);return Promise.resolve()},setNotice:()=>{},
  }
  const ctx={locale:{bind:()=>key=>key},slots:{inject:(_key,fn)=>fn(),register:()=>()=>{}},effect:fn=>{effects.push(fn())}}
  try{
    registerChatAdapter(ctx,store,React,'novel')
    const roots=dom.window.document.querySelectorAll('[data-variant="think"]')
    assert.equal(roots[0].querySelector('[data-novel-label]').textContent,'思考 · Checking project structure')
    assert.equal(roots[0].querySelector('[data-novel-icon]').textContent,'◎')
    assert.equal(roots[1].querySelector('[data-novel-label]'),null)
    const header=roots[0].querySelector('[data-disclosure-row]')
    header.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}))
    assert.equal(claims.length,0,'untrusted/synthetic clicks must not advance')
    actions.click({isTrusted:true,type:'click',target:header})
    assert.deepEqual(claims,['["session-a","14:assistant-step1:1"]'])
    header.setAttribute('aria-expanded','true')
    actions.click({isTrusted:true,type:'click',target:header})
    assert.equal(claims.length,1,'closing does not claim')
    header.append(dom.window.document.createTextNode('streaming update'))
    await new Promise(resolve=>setImmediate(resolve))
    assert.equal(claims.length,1,'streaming observer must not claim')
    const available = listTargets(dom.window.document)
    assert.equal(available.length, 2)
    assert.deepEqual(available[1], { sessionId:'session-a', nodeKey:'14:assistant-step1:2', turn:1, step:2 })
    assert.equal(claims.length,1,'listing dropdown options never consumes')
    actions.click({isTrusted:true,type:'click',target:roots[1].querySelector('[data-disclosure-row]')})
    assert.equal(claims.length,1,'non-target steps are untouched')
    settings={...settings,enabled:false};settingsChanged()
    assert.equal(dom.window.document.querySelector('[data-novel-label]'),null)
    assert.equal(header.querySelector('svg')!==null,true,'native icon retained')
    assert.equal(header.querySelector('span:nth-child(2)').textContent,'Native title')
  } finally {
    effects.reverse().forEach(dispose=>dispose?.())
    dom.window.close()
    for(const [key,value] of Object.entries(originals)) {
      if(value===undefined)delete globalThis[key];else globalThis[key]=value
    }
  }
})

test('body remount, stream updates and completion only read the page cache', async () => {
  const dom=new JSDOM(`<div data-conversation-session="session-a">${thought('14:assistant-step1:1')}</div>`)
  const marker=dom.window.document.createElement('div')
  dom.window.document.querySelector('[data-variant="think"]').append(marker)
  let Body
  const ctx={locale:{bind:()=>key=>key},slots:{inject:(_key,fn)=>fn(),register:(_options,component)=>{Body=component;return ()=>{}}},effect:()=>{}}
  registerChatAdapter(ctx,{},React,'novel')
  const settings={enabled:true,currentBookId:'book',targets:[{sessionId:'session-a',nodeKey:'14:assistant-step1:1'}]}
  const stepKey='["session-a","14:assistant-step1:1"]'
  let status={kind:'ready',index:0,passage:{text:'A cached passage'}}
  let claims=0
  const props={text:'ORIGINAL MODEL THOUGHT',running:true,sessionId:'session-a',
    useNovelSettings:selector=>selector(settings),
    useNovelPassages:selector=>selector({[passageSnapshotKey('book',stepKey)]:status}),
    renderFactorySlot:(_name,input)=>input.text,t:key=>key,
    onClaimPassage:()=>{claims+=1},
  }
  let renderer
  try{
    await act(async()=>{renderer=TestRenderer.create(React.createElement(Body,props),{createNodeMock:()=>marker})})
    assert.match(JSON.stringify(renderer.toJSON()),/A cached passage/u)
    assert.doesNotMatch(JSON.stringify(renderer.toJSON()),/ORIGINAL MODEL THOUGHT/u)
    await act(async()=>renderer.update(React.createElement(Body,{...props,text:'stream update',running:false})))
    assert.equal(claims,0)
    await act(async()=>renderer.unmount())
    await act(async()=>{renderer=TestRenderer.create(React.createElement(Body,props),{createNodeMock:()=>marker})})
    assert.match(JSON.stringify(renderer.toJSON()),/A cached passage/u)
    status=undefined
    await act(async()=>renderer.update(React.createElement(Body,{...props,running:false})))
    assert.equal(claims,0,'empty cache on restored expansion must not implicitly load a passage')
  }finally{await act(async()=>renderer?.unmount());dom.window.close()}
})
