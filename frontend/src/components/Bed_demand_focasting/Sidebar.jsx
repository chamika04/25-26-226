import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  Zap, 
  ClipboardList, 
  Bed, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  User
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/bed-dashboard", count: null },
    { icon: <TrendingUp size={20} />, text: "Forecasts", path: "/Forecast", count: 3 },
    { icon: <Activity size={20} />, text: "Trends", path: "/Trends", count: null },
    { icon: <Zap size={20} />, text: "Optimization", path: "/Optimization", count: "New" },
    { icon: <ClipboardList size={20} />, text: "Daily Input", path: "/DailyInput", count: null },
    { icon: <Bed size={20} />, text: "Bed Inventory", path: "/Inventory", count: 12 },
    { icon: <Settings size={20} />, text: "Settings", path: "/settings", count: null },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState('/dashboard');
  const location = useLocation();

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync active path with router
  useEffect(() => {
    if (location?.pathname) {
      setActivePath(location.pathname);
    }
  }, [location]);

  const handleNavClick = (path) => {
    setActivePath(path);
    if (isMobile) setMobileOpen(false);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const renderLogoSection = () => (
    <div style={{ 
      padding: collapsed ? '24px 16px' : '24px 20px', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: collapsed ? 'center' : 'space-between',
      position: 'relative'
    }}>
      {!collapsed ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>H</span>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700, lineHeight: '1.2' }}>Hospital RO</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '2px' }}>v2.1.4</div>
          </div>
        </div>
      ) : (
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>H</span>
        </div>
      )}
      
      {/* Toggle Button */}
      {!isMobile && (
        <button 
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ 
            position: 'absolute',
            top: '24px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)', 
            border: 'none', 
            color: '#fff', 
            cursor: 'pointer', 
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            width: '32px',
            height: '32px',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      )}
    </div>
  );

  const renderMenuItems = () => (
    <div style={{ padding: collapsed ? '20px 12px' : '20px 16px', flex: 1 }}>
      {!collapsed && (
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '12px', 
          fontWeight: 600, 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '16px',
          paddingLeft: '4px'
        }}>
          Main Menu
        </div>
      )}
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item, index) => {
          const isActive = activePath === item.path;
          return (
            <li key={index} style={{ marginBottom: '4px' }}>
              <NavLink
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? '0' : '12px',
                  padding: collapsed ? '14px' : '14px 16px',
                  borderRadius: '10px',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.85)',
                  background: isActive ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  }
                }}
              >
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minWidth: '24px',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.9)' 
                }}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span style={{ fontWeight: 500, fontSize: '14px', flex: 1 }}>{item.text}</span>
                    {item.count && (
                      <span style={{ 
                        background: item.count === 'New' 
                          ? 'linear-gradient(135deg, #f093fb, #f5576c)' 
                          : 'rgba(255, 255, 255, 0.15)', 
                        color: '#fff', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '3px 8px', 
                        borderRadius: '12px',
                        minWidth: '24px',
                        textAlign: 'center'
                      }}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
                
                {/* Active indicator for collapsed state */}
                {collapsed && isActive && (
                  <div style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '16px',
                    background: '#fff',
                    borderRadius: '2px'
                  }} />
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
      
      
    </div>
  );

  const renderFooter = () => (
    <div style={{ 
      padding: collapsed ? '20px 12px' : '20px', 
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(0, 0, 0, 0.1)'
    }}>
      {!collapsed ? (
        <>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
              © {new Date().getFullYear()} Hospital RO
            </div>
            
            <button
              aria-label="Logout"
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            aria-label="Notifications"
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Bell size={18} />
          </button>
          
          <button
            aria-label="Logout"
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <>
      {renderLogoSection()}
      {renderMenuItems()}
      {renderFooter()}
    </>
  );

  // Mobile View
  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 9999,
            width: '280px',
            height: '100vh',
            background: 'linear-gradient(180deg, #3b3ec8 0%, #5b2bd6 100%)',
            boxShadow: '8px 0 30px rgba(0, 0, 0, 0.4)',
            overflowY: 'auto',
            color: '#fff',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer', 
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={20} />
            </button>
          </div>
          {sidebarContent}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 50,
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
          }}
        >
          <Menu size={24} />
        </button>
      </>
    );
  }

  // Desktop View
  return (
    <aside
      aria-label="Sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        width: collapsed ? '80px' : '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #08204a 0%, #5b2bd6 100%)',
        boxSizing: 'border-box',
        boxShadow: '4px 0 20px rgba(11, 14, 20, 0.25)',
        overflowY: 'auto',
        overflowX: 'hidden',
        color: '#fff',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;