'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Target, Trophy, User, BookOpen, BrainCircuit, Lightbulb, Zap, ShoppingBag, Sun, Moon, Shield, Sparkles } from 'lucide-react';
import AuthScreen from '../components/AuthScreen';
import StreakCelebration from '../components/StreakCelebration';
import { getUserData, getInsights } from '../lib/storage';
export default function AppHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('play');
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

  const startGame = (mode = 'mixed') => {
    router.push(`/games/${mode}`);
  };

  if (isLoading) return <div className="mobile-app-frame" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>🌵</div>;

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const renderPlayTab = () => (
    <>
      <div className="hero-card">
        <div className="hero-content">
          <p className="user-rank">{user.skillLevel} Scholar</p>
          <div className="user-elo text-glow">{user.elo} ELO</div>
          <button className="btn-play-huge" onClick={() => startGame('mixed')}>
            Start Training
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 className="carousel-header" style={{ marginBottom: 0 }}>Game Formats</h4>
        <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
           🔥 {user.streak} Day Streak
        </div>
      </div>

      <div className="carousel-track" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', overflowX: 'visible', paddingRight: 0 }}>
        
        <div className="mode-card" onClick={() => startGame('idioms')} style={{ minWidth: '100%', padding: '20px' }}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(249, 115, 22, 0.15)'}}>
            <Sparkles size={24} color="#f97316" />
          </div>
          <h3 style={{fontSize: '1rem'}}>Idioms Theater</h3>
          <p style={{fontSize: '0.75rem'}}>Animated scene & meaning quizzes.</p>
        </div>

        <div className="mode-card" onClick={() => startGame('synonyms')} style={{ minWidth: '100%', padding: '20px' }}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(59, 130, 246, 0.15)'}}>
            <Swords size={24} color="#3b82f6" />
          </div>
          <h3 style={{fontSize: '1rem'}}>Synonyms Battle</h3>
          <p style={{fontSize: '0.75rem'}}>Defeat enemies with similar words.</p>
        </div>

        <div className="mode-card" onClick={() => startGame('antonyms')} style={{ minWidth: '100%', padding: '20px' }}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(239, 68, 68, 0.15)'}}>
            <Shield size={24} color="#ef4444" />
          </div>
          <h3 style={{fontSize: '1rem'}}>Antonyms Arena</h3>
          <p style={{fontSize: '0.75rem'}}>Defend by finding opposites.</p>
        </div>
        
        <div className="mode-card" onClick={() => startGame('ows')} style={{ minWidth: '100%', padding: '20px' }}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(168, 85, 247, 0.15)'}}>
            <Lightbulb size={24} color="#a855f7" />
          </div>
          <h3 style={{fontSize: '1rem'}}>OWS Chamber</h3>
          <p style={{fontSize: '0.75rem'}}>One-word substitution trials.</p>
        </div>

      </div>

      <div style={{ marginTop: '16px' }} onClick={() => startGame('mixed')}>
        <div className="mode-card" style={{ minWidth: '100%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="mode-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.2)'}}>
            <BrainCircuit size={28} color="#10b981" />
          </div>
          <div>
            <h3 style={{fontSize: '1.1rem', color: '#10b981'}}>Mixed SSC Quiz Show</h3>
            <p style={{fontSize: '0.8rem'}}>The ultimate fast-paced mock.</p>
          </div>
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

      <button className="btn-play-huge" onClick={() => startGame('mixed')}>START TRAINING</button>
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
      
      <main className="content-scroll" style={{ paddingBottom: '80px' }}>
        {activeTab === 'play' && renderPlayTab()}
        {activeTab === 'daily' && renderDailyTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </main>

      <nav className="bottom-nav">
          <button className={`nav-item ${activeTab === 'play' ? 'active' : ''}`} onClick={() => setActiveTab('play')}>
            <BookOpen size={22} />
            <span>Play</span>
          </button>
          <button className={`nav-item ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
            <Target size={22} />
            <span>Daily</span>
          </button>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={22} />
            <span>Profile</span>
          </button>
        </nav>
    </div>
  );
}
