import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import './Login.css';

const TRADES = [
  { from: 'Priya S.', to: 'Ravi M.', amt: '2.4 kWh', hash: '0x3f4a...2b9c', price: '₹6.40' },
  { from: 'Arjun K.', to: 'Neha T.', amt: '1.8 kWh', hash: '0xa1e2...7f03', price: '₹6.20' },
  { from: 'Dev P.', to: 'Meera J.', amt: '3.1 kWh', hash: '0x8c91...4d55', price: '₹6.60' },
  { from: 'Anita R.', to: 'Kiran L.', amt: '0.9 kWh', hash: '0x2d3e...8a11', price: '₹6.35' },
  { from: 'Sanjay B.', to: 'Rahul V.', amt: '2.2 kWh', hash: '0xf7b4...9e32', price: '₹6.55' },
];

export default function Login() {
  const { showToast } = useToast();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // State
  const [feed, setFeed] = useState([]);
  const [priceVal, setPriceVal] = useState(6.50);
  const [priceDelta, setPriceDelta] = useState(0);
  const [solarVal, setSolarVal] = useState(8.4);
  
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdVisible, setPwdVisible] = useState(false);
  const [remembered, setRemembered] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    // ── BG canvas ──
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    let W, H;
    
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 12 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
      r: Math.random() * 1.5 + 0.5
    }));

    let animationId;
    function drawBg() {
      c.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        pts.slice(i + 1).forEach(q => {
          const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y);
            c.strokeStyle = `rgba(0,255,135,${0.05 * (1 - d / 200)})`; c.lineWidth = 0.5; c.stroke();
          }
        });
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0,255,135,0.4)'; c.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      // Left panel glow
      const gr = c.createRadialGradient(W * 0.25, H * 0.5, 0, W * 0.25, H * 0.5, 350);
      gr.addColorStop(0, 'rgba(0,255,135,0.04)'); gr.addColorStop(1, 'transparent');
      c.fillStyle = gr; c.fillRect(0, 0, W, H);
      animationId = requestAnimationFrame(drawBg);
    }
    drawBg();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    // ── Live feed ──
    let feedIdx = 0;
    
    function addFeedItem() {
      const t = TRADES[feedIdx % TRADES.length];
      feedIdx++;
      setFeed(prev => {
        const newFeed = [t, ...prev];
        return newFeed.slice(0, 3);
      });
    }

    addFeedItem(); addFeedItem(); addFeedItem();
    const feedInterval = setInterval(addFeedItem, 3500);

    // ── Live metrics ──
    const metricsInterval = setInterval(() => {
      setPriceDelta(prev => {
        const delta = (Math.random() - .5) * .2;
        setPriceVal(curr => Math.max(4, Math.min(9, curr + delta)));
        return delta;
      });
      setSolarVal(curr => +(8.4 + Math.random() * .3 - .1).toFixed(1));
    }, 4000);

    return () => {
      clearInterval(feedInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const showSuccess = () => {
    setShowSuccessOverlay(true);
    showToast('⚡', 'Welcome back to the Grid!');
    setTimeout(() => { navigate('/dashboard'); }, 1800);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) { showError('Please enter your email address.'); return; }
    if (!pwd) { showError('Please enter your password.'); return; }
    if (!email.includes('@')) { showError('Please enter a valid email address.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess();
    }, 1600);
  };

  const demoLogin = () => {
    setEmail('demo@energygrid.app');
    setPwd('demo1234');
    setTimeout(() => {
      handleLogin();
    }, 600);
  };

  const walletConnect = (name) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); showSuccess(); }, 1200);
  };

  return (
    <div className="login-page-container">
      <canvas id="bgCanvas" ref={canvasRef}></canvas>

      <div className="login-wrap">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>

          {/* Logo */}
          <Link to="/" className="left-logo" style={{ animation: 'l-fade-up .5s ease both' }}>
            <div className="logo-mark">⚡</div>
            EnergyGrid
          </Link>

          {/* Main text */}
          <div className="left-main">
            <div className="left-tagline">Decentralized Solar Trading</div>
            <h1 className="left-title">
              Trade energy.<br/>
              <span className="accent">Save the planet.</span><br/>
              Earn real money.
            </h1>
            <p className="left-desc">
              Join 284 households already trading surplus solar power with their neighbors — powered by AI forecasting and blockchain settlement.
            </p>

            <div className="metrics-strip">
              <div className="metric-row">
                <div className="metric-left">
                  <div className="metric-icon" style={{ background: 'rgba(0,255,135,0.08)' }}>☀️</div>
                  <div>
                    <div className="metric-label">Live solar production</div>
                    <div className="metric-val" style={{ color: 'var(--green)' }}>{solarVal} kWh</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--green)', fontFamily: 'var(--mono)' }}>▲ 12%</div>
              </div>
              <div className="metric-row">
                <div className="metric-left">
                  <div className="metric-icon" style={{ background: 'rgba(0,229,204,0.08)' }}>🌱</div>
                  <div>
                    <div className="metric-label">CO₂ saved today</div>
                    <div className="metric-val" style={{ color: 'var(--teal)' }}>142 kg</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--teal)', fontFamily: 'var(--mono)' }}>▲ 7%</div>
              </div>
              <div className="metric-row">
                <div className="metric-left">
                  <div className="metric-icon" style={{ background: 'rgba(245,158,11,0.08)' }}>💰</div>
                  <div>
                    <div className="metric-label">Market price now</div>
                    <div className="metric-val" style={{ color: 'var(--amber)' }}>₹ {priceVal.toFixed(2)} / kWh</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: priceDelta > 0 ? 'var(--green)' : '#ff6b6b', fontFamily: 'var(--mono)' }}>{priceDelta > 0 ? '▲ up' : (priceDelta < 0 ? '▼ dn' : '↔')}</div>
              </div>
            </div>
          </div>

          {/* Live feed */}
          <div className="live-feed" style={{ animation: 'l-fade-up .7s .35s ease both' }}>
            <div className="feed-label">
              <div className="feed-dot"></div>
              Live Trades
            </div>
            <div>
              {feed.map((f, i) => (
                <div key={i} className="feed-item" style={{ animationDelay: '0s' }}>
                  <span>{f.from} → {f.to} &nbsp;<span className="feed-amount">{f.amt}</span></span>
                  <span className="feed-hash">{f.price} · {f.hash}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          
          {/* Success overlay */}
          <div className={`success-overlay ${showSuccessOverlay ? 'show' : ''}`}>
            <div className="success-check">✓</div>
            <div className="success-title">Welcome back!</div>
            <div className="success-sub">Redirecting to your dashboard…</div>
          </div>

          <div className="login-card">
            <div className="login-greeting">
              <div className="login-welcome">Sign in to continue</div>
              <div className="login-card-title">Welcome<br/>back</div>
              <div className="login-sub">Enter your credentials to access the trading platform.</div>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              
              {/* Email */}
              <div className="input-group">
                <label className="input-label">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`form-input ${errorMsg ? 'error' : ''}`} style={{ borderColor: email === 'demo@energygrid.app' ? 'var(--green)' : undefined }} placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input type={pwdVisible ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} className={`form-input ${errorMsg ? 'error' : ''}`} style={{ borderColor: pwd === 'demo1234' ? 'var(--green)' : undefined }} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setPwdVisible(!pwdVisible)} className="pwd-toggle" tabIndex="-1">{pwdVisible ? '🙈' : '👁'}</button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="form-row">
                <div className="remember-wrap" onClick={() => setRemembered(!remembered)}>
                  <div className={`custom-checkbox ${remembered ? 'checked' : ''}`}></div>
                  <span className="remember-label">Remember me</span>
                </div>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              {/* Error message */}
              <div className={`error-msg ${errorMsg ? 'show' : ''}`}>
                <span>⚠</span>
                <span>{errorMsg || 'Invalid credentials. Please try again.'}</span>
              </div>

              {/* Submit */}
              <button disabled={loading} type="submit" className={`submit-btn ${loading ? 'loading' : ''}`}>
                <span className="btn-text">Sign In</span>
                <div className="btn-spinner">
                  <div className="spinner"></div>
                </div>
              </button>

              {/* Divider */}
              <div className="divider">
                <div className="div-line"></div>
                <span className="div-text">or continue with</span>
                <div className="div-line"></div>
              </div>

              {/* Demo mode */}
              <button type="button" onClick={demoLogin} className="demo-btn">
                ⚡ Demo Mode — Auto-fill & Sign In
              </button>

              {/* Wallet connect */}
              <div className="wallet-row">
                <button type="button" onClick={() => walletConnect('MetaMask')} className="wallet-btn">
                  🦊 MetaMask
                </button>
                <button type="button" onClick={() => walletConnect('WalletConnect')} className="wallet-btn">
                  🔗 WalletConnect
                </button>
              </div>

              {/* Sign up */}
              <div className="signup-prompt">
                New to EnergyGrid? <a href="#" className="signup-link">Create an account →</a>
              </div>
            </form>
          </div>
        </div>

      </div>{/* login-wrap */}
    </div>
  );
}
