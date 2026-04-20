'use client';
import { useState, useEffect } from 'react';
import { updateMatchStats, getUserData } from '../lib/storage';
import { Swords, CheckCircle2, XCircle, BookOpen, Shield, Sparkles, Lightbulb, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameManager({ onExit, gameMode = 'mixed' }) {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, result
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60s per match
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [user, setUser] = useState(null);
  const [matchProcessed, setMatchProcessed] = useState(false);
  const [eloDelta, setEloDelta] = useState(0);

  const getModeConfig = (mode) => {
    switch(mode) {
      case 'synonyms': return { icon: <Swords size={40} color="#3b82f6" />, title: 'Synonyms Battle', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', action: 'ATTACK' };
      case 'antonyms': return { icon: <Shield size={40} color="#ef4444" />, title: 'Antonyms Arena', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', action: 'DEFEND' };
      case 'idioms': return { icon: <Sparkles size={40} color="#f97316" />, title: 'Idioms Theater', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', action: 'REVEAL' };
      case 'ows': return { icon: <Lightbulb size={40} color="#a855f7" />, title: 'OWS Chamber', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', action: 'SOLVE' };
      default: return { icon: <BrainCircuit size={40} color="#10b981" />, title: 'Mixed Quiz Show', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', action: 'ANSWER' };
    }
  };
  const config = getModeConfig(gameMode);

  useEffect(() => {
    setUser(getUserData());
  }, []);

  useEffect(() => {
    if (gameState === 'lobby') {
      const loadQuestions = async () => {
        try {
          const res = await fetch(`/api/questions?mode=${gameMode}`);
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();
          setQuestions(data);
          setGameState('playing');
          setTimeLeft(60);
        } catch (err) {
          console.error('Failed to load training data', err);
        }
      };

      setTimeout(() => {
        loadQuestions();
      }, 1500); // Quick preparation time
    }
  }, [gameState, gameMode]);

  // Handle Match Results persistence
  useEffect(() => {
    if (gameState === 'result' && !matchProcessed) {
      const delta = correctCount * 5;
      setEloDelta(delta);

      const result = updateMatchStats({
        isWin: true, 
        isDraw: false,
        eloDelta: delta,
        category: gameMode,
        questionsAnswered: questions.length,
        questionsCorrect: correctCount
      });

      if (result.streakUpdated) {
        window.dispatchEvent(new Event('smilu_streak_celebration'));
      }

      setMatchProcessed(true);
    }
  }, [gameState, score, questions.length, correctCount, gameMode, matchProcessed]);

  // Main Timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('result');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (option) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(option);
    const currQ = questions[currentIndex];
    
    if (option === currQ.answer) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameState('result');
      }
    }, 2000); // 2 second pause for animations and reading correct answer
  };

  if (gameState === 'lobby') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        style={{ textAlign: 'center', paddingTop: '100px' }}
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ margin: '0 auto 20px', display: 'flex', justifyContent: 'center' }}
        >
          {config.icon}
        </motion.div>
        <h2 className="text-glow" style={{ color: config.color }}>{config.title}</h2>
        <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Connecting to database...</p>
        
        <div className="glass-panel" style={{ marginTop: '40px', padding: '24px' }}>
          <h3>{user?.username || 'Scholar'}</h3>
          <p style={{marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>Loading challenges for {user?.skillLevel || 'Normal'} difficulty...</p>
        </div>

        <button 
          onClick={onExit}
          style={{ marginTop: '40px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </motion.div>
    );
  }

  if (gameState === 'playing') {
    const currQ = questions[currentIndex];
    const isAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === currQ?.answer;

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Score</div>
            <motion.div 
              key={score} 
              initial={{ scale: 1.5, color: '#10b981' }} 
              animate={{ scale: 1, color: config.color }} 
              style={{ fontSize: '1.5rem', fontWeight: '900' }}
            >
              {score}
            </motion.div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: timeLeft <= 10 ? 'var(--danger)' : 'var(--text-main)' }}>
              {Math.floor(timeLeft / 60)}:{ (timeLeft % 60).toString().padStart(2, '0') }
            </div>
            <button 
              onClick={onExit}
              style={{ fontSize: '0.6rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', marginTop: '4px' }}
            >
              EXIT
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>{config.title}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--brand-secondary)' }}>{currentIndex + 1}/{questions.length}</div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-drain" style={{ animationDuration: '60s' }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div className="glass-panel" style={{ padding: '32px 20px', textAlign: 'center', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
              {/* Dynamic Theme Background Glow */}
              <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle, ${config.bg} 0%, transparent 70%)`, opacity: 0.5, pointerEvents: 'none' }} />
              
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: config.color, padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
                {currQ?.category?.toUpperCase()}
              </span>
              
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '16px', lineHeight: 1.3 }}>{currQ?.word}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Hint: {currQ?.hint_hi}</p>
            </div>

            <div className="answers-grid">
              {currQ?.options.map((opt, i) => {
                let className = 'answer-btn';
                if (selectedAnswer) {
                  if (opt === currQ.answer) className += ' correct';
                  else if (opt === selectedAnswer) className += ' incorrect';
                }

                return (
                  <motion.button 
                    whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
                    key={i} 
                    className={className} 
                    onClick={() => handleAnswer(opt)} 
                    disabled={!!selectedAnswer}
                  >
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            {/* Answer Feedback Overlay */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: '24px', padding: '16px', borderRadius: '12px', textAlign: 'center',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}
                >
                  <h4 style={{ color: isCorrect ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {isCorrect ? <><CheckCircle2 size={20} /> AWESOME {config.action}!</> : <><XCircle size={20} /> MISSED!</>}
                  </h4>
                  {!isCorrect && (
                    <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      Correct answer: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{currQ.answer}</span>
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
      <CheckCircle2 size={80} color={config.color} style={{ margin: '0 auto 20px' }} />
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>
        {config.title.toUpperCase()} COMPLETE
      </h1>

      <div style={{ display: 'flex', gap: '16px', margin: '40px 0' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total ELO</div>
          <div style={{ fontSize: '2rem', fontWeight: '900' }}>{user?.elo + eloDelta}</div>
          <div style={{ color: eloDelta >= 0 ? 'var(--brand-accent)' : 'var(--danger)', fontWeight: 'bold' }}>
            +{eloDelta} Earned
          </div>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: '2rem', fontWeight: '900' }}>{Math.round((correctCount / questions.length) * 100)}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{correctCount}/{questions.length} Correct</div>
        </div>
      </div>

      <button className="btn-play-huge" style={{ marginBottom: '16px', background: config.color, boxShadow: `0 8px 25px ${config.bg}` }} onClick={() => {
        setMatchProcessed(false);
        setGameState('lobby');
        setScore(0);
        setCorrectCount(0);
        setCurrentIndex(0);
        setSelectedAnswer(null);
      }}>
        PLAY AGAIN
      </button>
      <button className="btn-play-huge" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={onExit}>
        Return to Dashboard
      </button>
    </motion.div>
  );
}
