import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const SIDEBAR_EXPANDED = 280; // must match Sidebar expanded width
  const HEADER_HEIGHT = 64; // px

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mainStyle = {
    marginLeft: isMobile ? 0 : SIDEBAR_EXPANDED,
    marginTop: HEADER_HEIGHT,
    padding: '18px 36px 96px',
    backgroundColor: '#f7fbff',
    boxSizing: 'border-box',
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`
  };

  return (
    <div style={{ minHeight: '100vh', display: 'block' }}>
      <Sidebar />

      <main style={mainStyle}>
        {children}
      </main>
    </div>
  );
};

export default Layout;