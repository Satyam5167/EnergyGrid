import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [clock, setClock] = useState('--:--:--');
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

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: '58px',
      background: 'rgba(10,16,22,0.95)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo — clickable back to landing */}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {['Dashboard', 'Marketplace'].map(tab => (
          <button
            key={tab}
            onClick={() => navigate('/' + tab.toLowerCase())}
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

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '4px 12px 4px 4px',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '20px', cursor: 'pointer',
        }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, color: 'white',
          }}>AK</div>
          <span style={{ fontSize: '12px', fontWeight: 500 }}>Arjun K.</span>
        </div>
      </div>
    </nav>
  );
}
