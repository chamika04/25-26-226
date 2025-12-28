import React from 'react';

export default function Sidebar() {
  // leave room for header (64px) and footer (56px)
  return (
    <aside style={{width:280, position:'fixed', left:0, top:64, bottom:56, background:'#fff', borderRight:'1px solid #e5e7eb', padding:20, zIndex:50}}>
      <div>Sidebar</div>
    </aside>
  );
}
