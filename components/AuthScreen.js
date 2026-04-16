'use client';
import { useState, useEffect } from 'react';
import { initializeUser } from '../lib/storage';

const MALE_AVATARS = ['🐒', '🦁', '🦉', '🦊', '🐢', '🦖', '🦄', '🥷'];
const FEMALE_AVATARS = ['👸', '👩‍🚀', '👩‍🎨', '👩‍🔬', '🧚‍♀️', '🧜‍♀️', '🦄', '🌸'];

const SKILLS = [
  { label: 'Beginner', elo: 800, desc: 'Starting my vocab journey' },
  { label: 'Intermediate', elo: 1200, desc: 'I know the basics well' },
  { label: 'Pro', elo: 1500, desc: 'Ready for SSC Tier-2 level' }
];

export default function AuthScreen({ onLogin }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null); // 'male' or 'female'
  const [avatar, setAvatar] = useState('');
  const [skill, setSkill] = useState(SKILLS[1]);

  // Set default avatar when gender changes
  useEffect(() => {
    if (gender === 'female') setAvatar('👸');
    if (gender === 'male') setAvatar('🐒');
  }, [gender]);

  const handleFinish = () => {
    if (!name.trim() || !gender) return;
    const user = initializeUser(name, avatar, skill.elo, skill.label, gender);
    onLogin(user);
  };

  const avatarsToChoose = gender === 'female' ? FEMALE_AVATARS : MALE_AVATARS;

  return (
    <div className="mobile-app-frame animate-slide-up" data-theme={gender} style={{ padding: '40px 20px', justifyContent: 'center' }}>
      
      {step === 1 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌵</div>
          <h1 className="brand-title" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>SMILU</h1>
          
          <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>How should we greet you?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>The arena adapts to your identity.</p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            <div 
              onClick={() => setGender('male')}
              className="glass-panel"
              style={{
                flex: 1, padding: '24px', cursor: 'pointer',
                border: `2px solid ${gender === 'male' ? 'var(--brand-accent)' : 'var(--glass-border)'}`,
                background: gender === 'male' ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧔</div>
              <div style={{ fontWeight: 'bold' }}>MALE</div>
            </div>
            <div 
              onClick={() => setGender('female')}
              className="glass-panel"
              style={{
                flex: 1, padding: '24px', cursor: 'pointer',
                border: `2px solid ${gender === 'female' ? 'var(--brand-accent)' : 'var(--glass-border)'}`,
                background: gender === 'female' ? 'rgba(251, 113, 133, 0.1)' : 'var(--glass-bg)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👩</div>
              <div style={{ fontWeight: 'bold' }}>FEMALE</div>
            </div>
          </div>

          <button 
            className="btn-play-huge" 
            disabled={!gender}
            onClick={() => setStep(2)}
          >
            Choose Identity
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Create Your Profile</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Select a codename and your warrior.</p>
          
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--brand-accent)', fontWeight: 'bold', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>CODENAME</label>
            <input 
              type="text" 
              placeholder="Your name..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)', borderRadius: '12px',
                padding: '16px', color: 'var(--text-main)', fontSize: '1.1rem',
                outline: 'none', marginBottom: '24px'
              }}
            />
            
            <label style={{ fontSize: '0.7rem', color: 'var(--brand-accent)', fontWeight: 'bold', display: 'block', marginBottom: '16px', textTransform: 'uppercase' }}>AVATAR</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {avatarsToChoose.map(a => (
                <div 
                  key={a}
                  onClick={() => setAvatar(a)}
                  style={{
                    fontSize: '2rem', cursor: 'pointer',
                    background: avatar === a ? 'var(--glass-border)' : 'var(--glass-bg)',
                    border: `1px solid ${avatar === a ? 'var(--brand-accent)' : 'transparent'}`,
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '60px', transition: 'all 0.2s'
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            <button className="btn-play-huge" style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn-play-huge" style={{ flex: 2 }} disabled={!name.trim()} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Rank Calibration</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Where do you stand in the vocab hierarchy?</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SKILLS.map(s => (
              <div 
                key={s.label}
                onClick={() => setSkill(s)}
                className="glass-panel"
                style={{
                  padding: '20px', cursor: 'pointer', textAlign: 'left',
                  border: `2px solid ${skill.label === s.label ? 'var(--brand-accent)' : 'var(--glass-border)'}`,
                  background: skill.label === s.label ? 'var(--glass-border)' : 'var(--glass-bg)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{s.label}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-accent)', fontWeight: '900' }}>{s.elo} ELO</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            <button className="btn-play-huge" style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn-play-huge" style={{ flex: 2 }} onClick={handleFinish}>
              Enter Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
