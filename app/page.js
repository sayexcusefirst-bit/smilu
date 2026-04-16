'use client';
import { useState } from 'react';
import { Swords, Target, Trophy, User, BookOpen, BrainCircuit, Lightbulb } from 'lucide-react';
import DuelManager from '../components/DuelManager';

export default function AppHome() {
  const [activeTab, setActiveTab] = useState('duels');
  const [isDueling, setIsDueling] = useState(false);
  const [gameMode, setGameMode] = useState('mixed');

  const startDuel = (mode = 'mixed') => {
    setGameMode(mode);
    setIsDueling(true);
  };

  const renderDuelsTab = () => (
    <>
      <div className="hero-card">
        <div className="hero-content">
          <p className="user-rank">Vanguard Scholar</p>
          <div className="user-elo text-glow">1240 ELO</div>
          <button className="btn-play-huge" onClick={() => startDuel('mixed')}>
            Play Ranked
          </button>
        </div>
      </div>

      <h4 className="carousel-header">Game Formats</h4>
      <div className="carousel-track">
        <div className="mode-card" onClick={() => startDuel('blitz')}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(59, 130, 246, 0.2)'}}>
            <BookOpen size={24} color="var(--brand-secondary)" />
          </div>
          <h3>Blitz</h3>
          <p>Rapid fire Synonyms & Antonyms.</p>
        </div>
        
        <div className="mode-card" onClick={() => startDuel('logic')}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(168, 85, 247, 0.2)'}}>
            <Lightbulb size={24} color="var(--brand-primary)" />
          </div>
          <h3>Logic</h3>
          <p>Decode idioms and one-words.</p>
        </div>

        <div className="mode-card" onClick={() => startDuel('mixed')}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.2)'}}>
            <BrainCircuit size={24} color="var(--brand-accent)" />
          </div>
          <h3>Mixed</h3>
          <p>The standard CGL vocabulary mock.</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4 className="carousel-header">Daily Objective</h4>
        <div className="daily-banner" onClick={() => setActiveTab('daily')}>
          <div className="daily-banner-info">
            <h4>Crack the Daily Puzzle</h4>
            <p>Expires in 06:34</p>
          </div>
          <Target size={32} color="var(--brand-accent)" />
        </div>
      </div>
    </>
  );

  const renderDailyTab = () => (
    <div style={{ textAlign: 'center', paddingTop: '40px' }}>
      <Target size={64} color="var(--brand-accent)" style={{ margin: '0 auto 20px' }} />
      <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Daily Workouts</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>5-min sessions with adaptive questions based on your weaknesses.</p>
      <button className="btn-play-huge">START WORKOUT</button>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div>
      <h4 className="carousel-header" style={{ marginTop: '10px' }}>Global Top 10</h4>
      <div style={{ background: 'var(--glass-bg)', borderRadius: '16px', overflow: 'hidden' }}>
        {[
          { rank: 1, name: 'Slayer99', elo: 2840 },
          { rank: 2, name: 'RohanSSC', elo: 2790 },
          { rank: 3, name: 'VocabKing', elo: 2650 },
          { rank: 4, name: 'Priya20', elo: 2510 },
          { rank: 5, name: 'You', elo: 1240 },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ width: '40px', fontWeight: 'bold', color: p.rank <= 3 ? '#facc15' : 'var(--text-muted)' }}>#{p.rank}</div>
            <div style={{ flex: 1, fontWeight: '600' }}>{p.name}</div>
            <div style={{ fontWeight: 'bold', color: 'var(--brand-accent)' }}>{p.elo}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div style={{ background: 'var(--glass-bg)', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
      <User size={64} color="var(--brand-primary)" style={{ margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Scholar #1337</h3>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--brand-accent)' }}>1240 Elo</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', padding: '0 10px', textAlign: 'center' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Matches</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24</p>
        </div>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Win Rate</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--brand-accent)' }}>68%</p>
        </div>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Streak</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>5 Days</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
            🌵
          </div>
          <h1 className="brand-title">SMILU</h1>
        </div>
        {!isDueling && (
          <div className="online-pill">
            Online: 394
          </div>
        )}
      </header>
      
      <main className="content-scroll">
        {isDueling ? (
          <div style={{ paddingTop: '20px' }}>
            <DuelManager onExit={() => setIsDueling(false)} gameMode={gameMode} />
          </div>
        ) : (
          <>
            {activeTab === 'duels' && renderDuelsTab()}
            {activeTab === 'daily' && renderDailyTab()}
            {activeTab === 'leaderboard' && renderLeaderboardTab()}
            {activeTab === 'profile' && renderProfileTab()}
          </>
        )}
      </main>

      {!isDueling && (
        <nav className="bottom-nav">
          <button className={`nav-item ${activeTab === 'duels' ? 'active' : ''}`} onClick={() => setActiveTab('duels')}>
            <Swords size={24} />
            <span>Duels</span>
          </button>
          <button className={`nav-item ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
            <Target size={24} />
            <span>Daily</span>
          </button>
          <button className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <Trophy size={24} />
            <span>Ranks</span>
          </button>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={24} />
            <span>Profile</span>
          </button>
        </nav>
      )}
    </>
  );
}
