import React from 'react';

export default function Navbar() {
  return (
    <header>
      <nav>
        <div className="branding" style={{maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:48, height:48, background:'#ff7a2d', borderRadius:8}} />
            <strong style={{color:'#fff'}}>App Name</strong>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <a href="/login" className="login-btn">Login</a>
          </div>
        </div>
      </nav>
    </header>
  );
}
