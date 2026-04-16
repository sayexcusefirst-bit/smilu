'use client';
import { useState, useEffect } from 'react';
import { Swords, Target, Trophy, User, BookOpen, BrainCircuit, Lightbulb, Zap, ShoppingBag, Sun, Moon } from 'lucide-react';
import DuelManager from '../components/DuelManager';
import AuthScreen from '../components/AuthScreen';
import StreakCelebration from '../components/StreakCelebration';
import { getUserData, getInsights } from '../lib/storage';

export default function AppHome() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('duels');
  const [isDueling, setIsDueling] = useState(false);
  const [gameMode, setGameMode] = useState('mixed');
  const [isLoading, setIsLoading] = useState(true);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('smilu_theme');
    if (savedMode === 'light') setIsLightMode(true);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.setAttribute('data-color-mode', 'light');
      localStorage.setItem('smilu_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      localStorage.setItem('smilu_theme', 'dark');
    }
  }, [isLightMode]);

  useEffect(() => {
    // Initial load
    const data = getUserData();
    setUser(data);
    setIsLoading(false);

    // Listen for updates from other parts of the app (like DuelManager)
    const handleUpdate = () => {
      const newData = getUserData();
      // Check if we should trigger streak celebration
      // Note: In a real app, we'd pass this flag explicitly through state or a global store.
      // For this prototype, we'll check if the streak was updated in the last few seconds.
      setUser(newData);
    };
    
    // Custom event for streak celebration
    const handleStreakCelebration = (e) => {
      setShowStreakCelebration(true);
    };

    window.addEventListener('smilu_data_updated', handleUpdate);
    window.addEventListener('smilu_streak_celebration', handleStreakCelebration);
    
    return () => {
      window.removeEventListener('smilu_data_updated', handleUpdate);
      window.removeEventListener('smilu_streak_celebration', handleStreakCelebration);
    };
  }, []);

  const startDuel = (mode = 'mixed') => {
    setGameMode(mode);
    setIsDueling(true);
  };

  if (isLoading) return <div className="mobile-app-frame" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>🌵</div>;

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const renderDuelsTab = () => (
    <>
      <div className="hero-card">
        <div className="hero-content">
          <p className="user-rank">{user.skillLevel} Scholar</p>
          <div className="user-elo text-glow">{user.elo} ELO</div>
          <button className="btn-play-huge" onClick={() => startDuel('mixed')}>
            Play Ranked
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 className="carousel-header" style={{ marginBottom: 0 }}>Game Formats</h4>
        <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
           🔥 {user.streak} Day Streak
        </div>
      </div>

      <div className="carousel-track">
        <div className="mode-card" onClick={() => startDuel('blitz')}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(59, 130, 246, 0.15)'}}>
            <BookOpen size={24} color="var(--brand-secondary)" />
          </div>
          <h3>Blitz</h3>
          <p>Rapid fire Synonyms & Antonyms.</p>
        </div>
        
        <div className="mode-card" onClick={() => startDuel('logic')}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(168, 85, 247, 0.15)'}}>
            <Lightbulb size={24} color="var(--brand-primary)" />
          </div>
          <h3>Logic</h3>
          <p>Decode idioms and one-words.</p>
        </div>

        <div className="mode-card" onClick={() => startDuel('mixed')}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.15)'}}>
            <BrainCircuit size={24} color="var(--brand-accent)" />
          </div>
          <h3>Mixed</h3>
          <p>The standard CGL vocabulary mock.</p>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h4 className="carousel-header">Daily Objective</h4>
        <div className="daily-banner" onClick={() => setActiveTab('daily')}>
          <div className="daily-banner-info">
            <h4>Crack the Daily Puzzle</h4>
            <p style={{ color: 'var(--brand-accent)', fontSize: '0.7rem', fontWeight: 'bold', marginTop: '4px' }}>Expires in 06:34</p>
          </div>
          <Target size={32} color="var(--brand-accent)" />
        </div>
      </div>
    </>
  );

  const renderDailyTab = () => (
    <div style={{ textAlign: 'center', paddingTop: '40px' }}>
      <Target size={64} color="var(--brand-accent)" style={{ margin: '0 auto 20px' }} />
      <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '8px' }}>Daily Workout</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Personalized training based on your performance.</p>
      
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--brand-accent)" /> Intelligence Insights
        </h4>
        {getInsights().map((msg, i) => (
          <p key={i} style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px', lineHeight: '1.4' }}>
            • {msg}
          </p>
        ))}
      </div>

      <button className="btn-play-huge" onClick={() => startDuel('mixed')}>START TRAINING</button>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div>
      <h4 className="carousel-header" style={{ marginTop: '10px' }}>Global Arena</h4>
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {[
          { rank: 1, name: 'Slayer99', elo: 2840 },
          { rank: 2, name: 'RohanSSC', elo: 2790 },
          { rank: 3, name: 'DivyaVocab', elo: 2650 },
          { rank: 34, name: user.username, elo: user.elo, isMe: true },
          { rank: 35, name: 'Priya20', elo: 1210 },
        ].map((p, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            padding: '20px 20px', 
            borderBottom: i === 4 ? 'none' : '1px solid var(--glass-border)', 
            background: p.isMe ? 'var(--glass-border)' : 'transparent',
            alignItems: 'center'
          }}>
            <div style={{ width: '40px', fontWeight: 'bold', fontSize: '1.1rem', color: p.rank <= 3 ? '#facc15' : 'var(--text-muted)' }}>#{p.rank}</div>
            <div style={{ flex: 1, fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>
              {p.name} {p.isMe && '(You)'}
            </div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: p.isMe ? 'var(--brand-accent)' : 'var(--text-main)' }}>{p.elo}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div style={{ paddingBottom: '40px' }}>
      <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{fontSize: '5rem', marginBottom: '16px'}}>{user.avatar}</div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '4px' }}>{user.username}</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--brand-accent)' }}>{user.elo} Elo</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', padding: '0 10px', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Matches</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '900' }}>{user.matches.total}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Accuracy</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--brand-accent)' }}>
              {user.matches.total > 0 ? Math.round((user.matches.wins / user.matches.total) * 100) : 0}%
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Streak</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f97316' }}>{user.streak}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--brand-accent)" /> SMILU SHOP
          </h4>
          <span style={{ fontSize: '0.6rem', color: 'var(--brand-accent)', border: '1px solid var(--brand-accent)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>COMING SOON</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Soon you can spend your 🪙 {user.coins} coins on custom avatars and theme effects.</p>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px', padding: '24px', textAlign: 'left' }}>
         <h4 style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform:'uppercase', letterSpacing:1}}>Category Mastery</h4>
         {Object.entries(user.performance).map(([cat, stats]) => {
           const accuracy = stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0;
           return (
             <div key={cat} style={{marginBottom: '16px'}}>
               <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', marginBottom:'6px', textTransform:'uppercase', fontWeight:'bold'}}>
                 <span>{cat}</span>
                 <span>{accuracy}%</span>
               </div>
               <div style={{height:6, background:'var(--glass-border)', borderRadius:3, overflow:'hidden'}}>
                 <div style={{height:'100%', background: accuracy > 70 ? 'var(--brand-accent)' : accuracy > 40 ? 'var(--brand-secondary)' : 'var(--danger)', width: `${accuracy}%`, transition: 'width 1s ease-out'}}></div>
               </div>
             </div>
           )
         })}
      </div>
    </div>
  );

  return (
    <div className="mobile-app-frame" data-theme={user.gender}>
      {showStreakCelebration && (
        <StreakCelebration streak={user.streak} onComplete={() => setShowStreakCelebration(false)} />
      )}

      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
            🌵
          </div>
          <h1 className="brand-title">SMILU</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div 
            onClick={() => setIsLightMode(!isLightMode)}
            style={{ 
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', 
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s', color: 'var(--text-main)'
            }}
            title="Toggle Theme"
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <div 
            onClick={() => setActiveTab('profile')}
            style={{ 
              background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', 
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              fontSize: '1rem', transition: 'all 0.2s'
            }}
            title="Coins"
          >
            🪙
          </div>
        </div>
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
            <Swords size={22} />
            <span>Duels</span>
          </button>
          <button className={`nav-item ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
            <Target size={22} />
            <span>Daily</span>
          </button>
          <button className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <Trophy size={22} />
            <span>Ranks</span>
          </button>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={22} />
            <span>Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
}
