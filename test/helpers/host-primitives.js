import React from 'react'

// Contract doubles only. Appearance, focus, portals and keyboard behavior are
// verified against the actual host; these doubles must not claim to test them.
export function HostSwitch({ checked, disabled, label, onChange }) {
  return React.createElement('button', { role: 'switch', 'aria-checked': checked, 'aria-label': label, disabled, onClick: () => onChange(!checked) })
}
export const HostButton = React.forwardRef(function HostButton({ variant, size, children, ...props }, ref) {
  return React.createElement('button', { type: 'button', ...props, ref, 'data-host-variant': variant }, children)
})
export const HostInput = React.forwardRef(function HostInput(props, ref) {
  return React.createElement('input', { ...props, ref })
})
export function HostMenu({ anchor, open, items, footer = [], selectedId, selectedIds = [], onSelect }) {
  return React.createElement('div', null, anchor, open ? React.createElement('div', { role: 'menu' },
    [...items, ...footer].map(item => React.createElement('button', {
      key: item.id, role: 'menuitem', disabled: item.disabled,
      'data-selected': selectedId === item.id || selectedIds.includes(item.id),
      onClick: () => onSelect(item.id),
    }, item.label)),
  ) : null)
}
export function HostModal({ open, title, description, children, footer }) {
  return open ? React.createElement('div', { role: 'dialog', 'aria-label': title }, description, children, footer) : null
}
function Chevron() { return React.createElement('svg', { 'aria-hidden': true }) }

export const hostPrimitives = { Switch: HostSwitch, Button: HostButton, Input: HostInput, Menu: HostMenu, Modal: HostModal, IconChevronDownOutlineRegular: Chevron }
