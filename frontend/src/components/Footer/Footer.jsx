import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const resources = [
    { name: 'Blog', path: '/blog' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Support', path: '/support' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ];

  const footerStyles = `
    .site-footer { 
      margin-left: 280px; 
      transition: margin-left 0.25s ease; 
    }
    @media (max-width: 900px) {
      .site-footer { margin-left: 0; }
    }
  `;

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="site-footer" style={{
        background: 'linear-gradient(180deg, #08204a 0%, #5b2bd6 100%)',
        color: '#e2e8f0',
        width: '100%',
        boxSizing: 'border-box',
        borderTop: '3px solid #0ea5a4',
        overflow: 'visible',
        padding: '40px 0'
      }}>
      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '18px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '0',
        }}>
          {/* Brand Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #0ea5a4 0%, #3b82f6 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(14, 165, 164, 0.3)',
              }}>
                <span style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  fontFamily: 'Arial, sans-serif',
                }}>H</span>
              </div>
              
            </div>
            <p style={{
              color: '#94a3b8',
              maxWidth: '500px',
              lineHeight: '1.6',
              fontSize: '16px',
              margin: '8px 0 0',
            }}>
              Advanced predictive analytics for hospital resource management, 
              bed allocation optimization, and demand forecasting.
            </p>
          </div>

          {/* Resources Section */}
          <div>
            <h3 style={{
              color: '#f1f5f9',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '24px',
              paddingBottom: '12px',
              position: 'relative',
            }}>
              Resources
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '50px',
                height: '3px',
                background: 'linear-gradient(90deg, #0ea5a4, #3b82f6)',
                borderRadius: '2px',
              }}></div>
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link 
                    to={resource.path} 
                    style={{
                      color: '#cbd5e0',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      padding: '4px 0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#0ea5a4';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#cbd5e0';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#0ea5a4',
                      borderRadius: '50%',
                      marginRight: '12px',
                      opacity: 0.7,
                    }}></span>
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 style={{
              color: '#f1f5f9',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '24px',
              paddingBottom: '12px',
              position: 'relative',
            }}>
              Contact Us
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '50px',
                height: '3px',
                background: 'linear-gradient(90deg, #0ea5a4, #3b82f6)',
                borderRadius: '2px',
              }}></div>
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: '#0ea5a4',
                    minWidth: '70px',
                  }}>Email:</span>
                  <span style={{ color: '#e2e8f0' }}>support@hospitalro.com</span>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: '#0ea5a4',
                    minWidth: '70px',
                  }}>Phone:</span>
                  <span style={{ color: '#e2e8f0' }}>+1 (555) 123-4567</span>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: '#0ea5a4',
                    minWidth: '70px',
                  }}>Hours:</span>
                  <span style={{ color: '#e2e8f0' }}>Mon-Fri 9AM-6PM EST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ color: '#94a3b8', fontSize: 14 }}>© {currentYear} Hospital Resource Optimization System</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/privacy" style={{ color: '#0ea5a4', textDecoration: 'none' }}>Privacy</Link>
            <span style={{ color: '#94a3b8' }}>|</span>
            <Link to="/terms" style={{ color: '#0ea5a4', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;