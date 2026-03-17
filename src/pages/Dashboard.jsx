import { useRef, useEffect, useState } from 'react';
import ForecastChart from '../components/ForecastChart';
import Ticker from '../components/Ticker';
import { generateTrades, leaders } from '../data';
import { useToast } from '../contexts/ToastContext';

const trades = generateTrades();

export default function Dashboard() {
  const { showToast } = useToast();
  const chartRef = useRef(null);
  const [stats, setStats] = useState({ prod: 8.4, cons: 5.1, surplus: 3.3, co2: 284 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const prod = +(prev.prod + (Math.random() * 0.1 - 0.04)).toFixed(2);
        const cons = +(prev.cons + (Math.random() * 0.08 - 0.03)).toFixed(2);
        const surplus = Math.max(0, +(prod - cons).toFixed(2));
        const co2 = +(prev.co2 + Math.random() * 0.3).toFixed(1);
        return { prod, cons, surplus, co2 };
      });

      if (chartRef.current) {
        const last = chartRef.current.data.datasets[2].data;
        last[47] = +(Math.max(0, last[47] + (Math.random() * 0.3 - 0.1)).toFixed(2));
        chartRef.current.update('none');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Solar Production', icon: '☀️', value: stats.prod, unit: 'kWh today', color: 'green', trend: '▲ 12.3%', trendUp: true, sub: 'vs yesterday' },
    { label: 'Energy Consumed', icon: '🔌', value: stats.cons, unit: 'kWh today', color: 'blue', trend: '▼ 3.1%', trendUp: false, sub: 'vs yesterday' },
    { label: 'Surplus Available', icon: '⚡', value: stats.surplus, unit: 'kWh tradeable', color: 'amber', trend: '▲ 8.7%', trendUp: true, sub: 'vs avg' },
    { label: 'CO₂ Saved', icon: '🌱', value: Math.floor(stats.co2), unit: 'kg this month', color: 'teal', trend: '▲ 21.4%', trendUp: true, sub: 'vs last month' },
  ];

  const colorMap = {
    green: { border: 'var(--green)', icon: 'rgba(0,255,135,0.08)', value: 'var(--green)' },
    blue: { border: 'var(--blue)', icon: 'rgba(14,165,233,0.08)', value: 'var(--blue)' },
    amber: { border: 'var(--amber)', icon: 'rgba(245,158,11,0.08)', value: 'var(--amber)' },
    teal: { border: 'var(--teal)', icon: 'rgba(0,229,204,0.08)', value: 'var(--teal)' },
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {statCards.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <div key={i} className="stat-card" style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '18px 20px',
              position: 'relative', overflow: 'hidden',
              transition: 'transform .2s, border-color .2s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', borderRadius: '14px 0 0 14px', background: c.border }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: 500, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{s.label}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', background: c.icon }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1, marginBottom: '6px', color: c.value }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '4px' }}>{s.unit}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--mono)' }}>
                <span style={{ color: s.trendUp ? 'var(--green)' : 'var(--red)' }}>{s.trend}</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: '4px' }}>{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '20px' }}>
        <ForecastChart chartRef={chartRef} />

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Pool Gauge */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 600 }}>Community Pool</span>
              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontFamily: 'var(--mono)', fontWeight: 500, background: 'rgba(14,165,233,0.1)', color: 'var(--blue)', border: '1px solid rgba(14,165,233,0.2)' }}>42/50 kWh</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '140px', height: '80px' }}>
                <svg width="140" height="80" viewBox="0 0 140 80">
                  <path d="M 15 75 A 55 55 0 0 1 125 75" fill="none" stroke="var(--border2)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 15 75 A 55 55 0 0 1 125 75" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="173" strokeDashoffset="35" />
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--green2)" />
                      <stop offset="100%" stopColor="var(--teal)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)', lineHeight: 1, fontFamily: 'var(--mono)' }}>84%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)' }}>capacity</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', width: '100%' }}>
                {[
                  { label: 'Stored', value: '42 kWh', color: 'var(--green)' },
                  { label: 'Capacity', value: '50 kWh', color: 'var(--text)' },
                  { label: 'Surplus In', value: '+2.1', color: 'var(--blue)' },
                  { label: 'Drawn Out', value: '-0.8', color: 'var(--amber)' },
                ].map(p => (
                  <div key={p.label} style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{p.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--mono)', color: p.color }}>{p.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carbon Impact */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 600 }}>Carbon Impact</span>
              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontFamily: 'var(--mono)', fontWeight: 500, background: 'rgba(0,229,204,0.1)', color: 'var(--teal)', border: '1px solid rgba(0,229,204,0.2)' }}>THIS MONTH</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', margin: '8px 0' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '-1px', fontFamily: 'var(--mono)' }}>284</span>
              <span style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '6px' }}>kg CO₂</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '12px' }}>≈ <span style={{ color: 'var(--teal)', fontWeight: 600 }}>13 trees</span> planted equivalent</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily savings</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '36px' }}>
              {[{ h: '50%', d: 'M' }, { h: '65%', d: 'T' }, { h: '45%', d: 'W' }, { h: '80%', d: 'T' }, { h: '70%', d: 'F' }, { h: '55%', d: 'S' }, { h: '90%', d: 'S' }].map((b, idx) => (
                <div key={idx} style={{
                  flex: 1, borderRadius: '3px 3px 0 0',
                  height: b.h,
                  background: idx === 6 ? 'rgba(0,229,204,0.7)' : 'rgba(0,229,204,0.25)',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', bottom: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{b.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
        {/* Trade History */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 600 }}>Recent Trades</span>
            <span style={{
              fontSize: '10px', padding: '3px 8px', borderRadius: '20px',
              fontFamily: 'var(--mono)', fontWeight: 500,
              background: 'rgba(0,255,135,0.08)', color: 'var(--green)', border: '1px solid rgba(0,255,135,0.2)',
            }}>10 TRADES</span>
          </div>
          <table className="trade-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Time', 'Seller', 'Buyer', 'Units', 'Price', 'CO₂', 'TX Hash', 'Status'].map(h => (
                  <th key={h} style={{
                    fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.6px', fontWeight: 500, padding: '10px 14px',
                    borderBottom: '1px solid var(--border)', textAlign: 'left',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr key={i} style={{
                  animationDelay: `${i * 0.06}s`,
                  borderBottom: i === trades.length - 1 ? 'none' : '1px solid rgba(30,45,61,0.4)',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text3)' }}>{t.time}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: 'white', background: t.sellerColor, flexShrink: 0 }}>{t.seller[0]}</div>
                      <span>{t.seller}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: 'white', background: t.buyerColor, flexShrink: 0 }}>{t.buyer[0]}</div>
                      <span>{t.buyer}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--amber)' }}>{t.units}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--green)' }}>₹{t.price}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--green3)' }}>{t.co2} kg</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--blue)', cursor: 'pointer' }}
                    onClick={() => { navigator.clipboard?.writeText(t.hash).catch(() => { }); showToast('✓', 'TX hash copied to clipboard'); }}
                    title="Click to copy"
                  >{t.hash}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: '10px', padding: '3px 8px', borderRadius: '20px',
                      fontFamily: 'var(--mono)', fontWeight: 500, display: 'inline-block',
                      ...(t.status === 'Settled'
                        ? { background: 'rgba(0,255,135,0.08)', color: 'var(--green)', border: '1px solid rgba(0,255,135,0.2)' }
                        : { background: 'rgba(245,158,11,0.08)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }),
                    }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leaderboard */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 600 }}>Top Traders</span>
            <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontFamily: 'var(--mono)', fontWeight: 500, background: 'rgba(245,158,11,0.08)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }}>REPUTATION</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 16px 16px' }}>
            {leaders.map((l, i) => (
              <div key={l.name} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '8px',
                background: 'var(--bg3)', border: '1px solid transparent',
                transition: 'border-color .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: i === 0 ? 'var(--amber)' : 'var(--text3)', width: '16px', fontFamily: 'var(--mono)' }}>{i === 0 ? '👑' : i + 1}</span>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: 'white', background: l.color }}>{l.name[0]}</div>
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>{l.name}</span>
                <div style={{ width: '50px', height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'linear-gradient(90deg, var(--green2), var(--green3))', width: `${l.score}%` }} />
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>{l.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Ticker />
    </div>
  );
}
