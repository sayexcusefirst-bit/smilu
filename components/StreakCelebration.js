'use client';
import { useEffect, useState } from 'react';

export default function StreakCelebration({ streak, onComplete }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(5, 5, 5, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden'
      }}
    >
      <div className="animate-flame" style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 0 30px #f97316)' }}>🔥</div>
          {/* Flame particles background effect simulated with text shadows or absolute divs if needed */}
        </div>
        
        <h1 style={{ fontSize: '4rem', fontWeight: '900', color: 'white', marginTop: '20px' }}>
          {streak} DAY STREAK!
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--brand-accent)', fontWeight: 'bold', marginTop: '10px' }}>
          You're on fire! Keep it going.
        </p>
        
        <div style={{ marginTop: '40px', color: 'white', fontSize: '1rem', background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '999px', border: '1px solid var(--glass-border)' }}>
          +50 BONUS COINS EARNED 🪙
        </div>
      </div>
      
      {/* Background Burst Effect */}
      <div style={{
        position: 'absolute',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
        opacity: 0.3,
        filter: 'blur(50px)',
        zIndex: -1
      }} />
    </div>
  );
}
