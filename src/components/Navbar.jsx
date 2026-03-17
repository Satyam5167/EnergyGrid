import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [clock, setClock] = useState('--:--:--');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const activePage = location.pathname.includes('marketplace') ? 'marketplace' : 'dashboard';

  useEffect(() => {
    const updateClock = () => {
      setClock(new Date().toTimeString().slice(0, 8));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: '58px',
        background: 'rgba(10,16,22,0.95)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', cursor: 'pointer', fontFamily: 'var(--display)' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--green), var(--green3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', boxShadow: '0 0 16px rgba(0,255,135,0.3)',
          }}>⚡</div>
          <span>EnergyGrid</span>
          <span style={{ color: 'var(--text3)', fontWeight: 500, fontSize: '12px', marginLeft: '4px', fontFamily: 'var(--body)' }}>v2.0</span>
        </div>

        {/* Tabs — hidden on mobile via CSS */}
        <div className="navbar-tabs" style={{ display: 'flex', gap: '2px' }}>
          {['Dashboard', 'Marketplace'].map(tab => (
            <button
              key={tab}
              onClick={() => handleNav('/' + tab.toLowerCase())}
              style={{
                padding: '6px 16px', borderRadius: '6px', cursor: 'pointer',
                color: activePage === tab.toLowerCase() ? 'var(--text)' : 'var(--text2)',
                fontSize: '13px', fontWeight: 500, border: 'none',
                background: activePage === tab.toLowerCase() ? 'var(--bg3)' : 'none',
                transition: 'all .2s', fontFamily: 'var(--font)',
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Right — hidden on mobile */}
        <div className="navbar-right-full" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '20px',
            background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)',
            fontSize: '11px', fontWeight: 600, color: 'var(--green)',
            fontFamily: 'var(--mono)', letterSpacing: '0.5px',
          }}>
            <div className="live-dot" />
            LIVE
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{clock}</div>

          {/* Profile Info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px 4px 4px',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '20px', cursor: 'default',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: user?.picture ? `url(${user.picture}) center/cover` : 'linear-gradient(135deg, #1565c0, #42a5f5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: 'white',
              boxShadow: '0 2px 8px rgba(21,101,192,0.3)',
              overflow: 'hidden',
            }}>
              {!user?.picture && (user?.name?.slice(0, 2).toUpperCase() || '??')}
              {user?.picture && <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <span className="navbar-profile-name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'Guest'}</span>
          </div>

          {/* Separator */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

          {/* Logout Button */}
          <button 
            onClick={logout}
            title="Logout"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px',
              background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)',
              borderRadius: '10px', cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'var(--red)',
              fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,59,48,0.15)';
              e.currentTarget.style.borderColor = 'rgba(255,59,48,0.4)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,59,48,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,59,48,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,59,48,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>Sign Out</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Mobile: profile avatar + hamburger */}
        <div className="navbar-mobile-menu" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          {/* mobile avatar */}
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: user?.picture ? `url(${user.picture}) center/cover` : 'linear-gradient(135deg, #1565c0, #42a5f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: 'white',
            boxShadow: '0 2px 8px rgba(21,101,192,0.3)', overflow: 'hidden', flexShrink: 0,
          }}>
            {!user?.picture && (user?.name?.slice(0, 2).toUpperCase() || '??')}
            {user?.picture && <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          {/* hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px',
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: mobileOpen ? 'var(--green)' : 'var(--text2)', borderRadius: '2px', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : '', transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: mobileOpen ? 'transparent' : 'var(--text2)', borderRadius: '2px', transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: mobileOpen ? 'var(--green)' : 'var(--text2)', borderRadius: '2px', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : '', transition: 'all 0.2s' }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '58px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(10,16,22,0.98)', borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(16px)', padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {/* User info */}
          <div style={{ padding: '10px 12px', background: 'var(--card)', borderRadius: '10px', marginBottom: '4px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>{user?.name || 'Guest'}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{user?.email || ''}</div>
          </div>

          {['Dashboard', 'Marketplace'].map(tab => (
            <button
              key={tab}
              onClick={() => handleNav('/' + tab.toLowerCase())}
              style={{
                padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                color: activePage === tab.toLowerCase() ? 'var(--green)' : 'var(--text2)',
                fontSize: '14px', fontWeight: 500, border: 'none',
                background: activePage === tab.toLowerCase() ? 'rgba(0,255,135,0.06)' : 'var(--card)',
                fontFamily: 'var(--font)', width: '100%',
              }}
            >{tab}</button>
          ))}

          {/* Live badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 14px', borderRadius: '8px',
            background: 'rgba(0,255,135,0.05)',
            fontSize: '11px', fontWeight: 600, color: 'var(--green)',
            fontFamily: 'var(--mono)',
          }}>
            <div className="live-dot" />
            LIVE · {clock}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
              color: 'var(--red)', fontSize: '14px', fontWeight: 600,
              border: '1px solid rgba(255,59,48,0.2)',
              background: 'rgba(255,59,48,0.06)',
              fontFamily: 'var(--font)', width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}
