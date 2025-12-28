import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6'

const Navbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) setIsLoggedIn(true)
    }, [])

    const location = useLocation()
    const isHome = location?.pathname === '/'

        useEffect(() => {
            function handleResize() {
                setIsMobile(window.innerWidth < 768)
            }
            handleResize()
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        }, [])

    function handleAuth() {
        if (isLoggedIn) {
            localStorage.removeItem('token')
            setIsLoggedIn(false)
            navigate('/')
        } else navigate('/login')
    }

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#08204a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 60,
        transition: 'background 200ms ease, color 200ms ease',
    }
    const innerStyle = { maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 28px' }
    const brandStyle = { display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: '#fff' }
    const logoWrap = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 9999, background: isHome ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)' }
    const logoSvg = { width: 28, height: 28, color: '#fff' }
    const titleStyle = { fontSize: 20, fontWeight: 800, color: '#fff' }
    const navListStyle = { display: 'flex', gap: 22, alignItems: 'center', marginLeft: 20 }
    const linkStyle = { color: '#fff', textDecoration: 'none', fontWeight: 700 }
    const btnStyle = { padding: '8px 14px', borderRadius: 9999, border: 'none', background: '#0fb6ad', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(15,23,42,0.04)' }

    return (
        <>
        <header style={headerStyle}>
            <div style={innerStyle}>
                <Link to='/' style={brandStyle} aria-label='Home'>
                    <div style={logoWrap}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={logoSvg}>
                            <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 12C4 13.1046 3.10457 14 2 14C0.89543 14 0 13.1046 0 12C0 10.8954 0.89543 10 2 10C3.10457 10 4 10.8954 4 12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 7L17 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span style={titleStyle}>Hospital Resource Optimization</span>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {!isMobile && (
                            <div style={navListStyle}>
                                <Link to='/' style={linkStyle}>Home</Link>
                                <Link to='/bed-dashboard' style={linkStyle}>Bed Forecast</Link>
                                <Link to='/login' style={linkStyle}>Login</Link>
                            </div>
                        )}

                        {!isMobile && (
                            <button onClick={handleAuth} style={btnStyle}>{isLoggedIn ? 'Logout' : 'Login'}</button>
                        )}

                        <button onClick={() => setMenuOpen(!isMenuOpen)} style={{ marginLeft: 8, background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label='menu'>
                            {isMenuOpen ? <FaXmark size={18} /> : <FaBarsStaggered size={18} />}
                        </button>
                </nav>
            </div>
  
            {isMenuOpen && (
                <div style={{ background: '#08204a', color: '#fff', padding: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1200, margin: '0 auto' }}>
                            <Link to='/' style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
                            <Link to='/bed-dashboard' style={{ color: '#fff', textDecoration: 'none' }}>Bed Forecast</Link>
                            {isMobile && <Link to='/login' style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>}
                            {isMobile && <button onClick={handleAuth} style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, border: 'none', background: '#06b6d4', color: '#fff' }}>{isLoggedIn ? 'Logout' : 'Login'}</button>}
                        </div>
                </div>
            )}
        </header>
        </>
    )
}

export default Navbar
