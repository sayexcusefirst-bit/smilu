'use client';
import { useState, useEffect } from 'react';
import { updateMatchStats, getUserData } from '../lib/storage';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IdiomsSceneCard from './IdiomsSceneCard';
import IdiomsRevealCard from './IdiomsRevealCard';

export default function IdiomsTheaterEngine({ onExit }) {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, result
  const [playState, setPlayState] = useState('scene'); // scene, question, reveal
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [user, setUser] = useState(null);
  const [matchProcessed, setMatchProcessed] = useState(false);
  const [eloDelta, setEloDelta] = useState(0);

  useEffect(() => {
    setUser(getUserData());
  }, []);

  useEffect(() => {
    if (gameState === 'lobby') {
      const loadQuestions = async () => {
        try {
          const res = await fetch(`/api/questions?mode=idioms`);
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();
          setQuestions(data);
          setGameState('playing');
          setPlayState('scene');
        } catch (err) {
          console.error('Failed to load idioms', err);
        }
      };

      setTimeout(loadQuestions, 1500);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'result' && !matchProcessed) {
      const delta = correctCount * 5;
      setEloDelta(delta);

      const result = updateMatchStats({
        isWin: true, 
        isDraw: false,
        eloDelta: delta,
        category: 'idioms',
        questionsAnswered: questions.length,
        questionsCorrect: correctCount
      });

      if (result.streakUpdated) {
        window.dispatchEvent(new Event('smilu_streak_celebration'));
      }

      setMatchProcessed(true);
    }
  }, [gameState, score, questions.length, correctCount, matchProcessed]);

  const handleAnswer = (option) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(option);
    const currQ = questions[currentIndex];
    
    if (option === currQ.answer) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
    }

    // Give 1 second to see green/red button, then show reveal card
    setTimeout(() => {
      setPlayState('reveal');
    }, 1000);
  };

  const nextRound = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setPlayState('scene');
    } else {
      setGameState('result');
    }
  };

  if (gameState === 'lobby') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', paddingTop: '100px' }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ margin: '0 auto 20px', display: 'flex', justifyContent: 'center' }}>
          <Sparkles size={64} color="#f97316" />
        </motion.div>
        <h2 className="text-glow" style={{ color: '#f97316', fontSize: '2rem' }}>Idioms Theater</h2>
        <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Take your seat. The show is about to begin...</p>
        <button onClick={onExit} style={{ marginTop: '40px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
      </motion.div>
    );
  }

  if (gameState === 'playing') {
    const currQ = questions[currentIndex];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Score</div>
            <motion.div key={score} initial={{ scale: 1.5, color: '#f97316' }} animate={{ scale: 1, color: '#f97316' }} style={{ fontSize: '1.5rem', fontWeight: '900' }}>
              {score}
            </motion.div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#f97316', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Act {currentIndex + 1}</div>
            <button onClick={onExit} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '4px' }}>EXIT THEATER</button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Progress</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>{currentIndex + 1}/{questions.length}</div>
          </div>
        </div>

        {/* Dynamic Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {playState === 'scene' && (
              <motion.div key="scene" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.5 }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>Watch closely...</h3>
                </div>
                <IdiomsSceneCard visualHint={currQ?.visualHint} onComplete={() => setPlayState('question')} />
              </motion.div>
            )}

            {playState === 'question' && (
              <motion.div key="question" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                <div className="glass-panel" style={{ padding: '32px 20px', textAlign: 'center', marginBottom: '30px' }}>
                  <span style={{ display: 'inline-block', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
                    What does this mean?
                  </span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '16px', lineHeight: 1.3 }}>"{currQ?.word}"</h2>
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
              </motion.div>
            )}

            {playState === 'reveal' && (
              <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <IdiomsRevealCard 
                  question={currQ} 
                  isCorrect={selectedAnswer === currQ.answer} 
                  onNext={nextRound} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Result State
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
      <CheckCircle2 size={80} color="#f97316" style={{ margin: '0 auto 20px' }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>CURTAIN CALL</h1>

      <div style={{ display: 'flex', gap: '16px', margin: '40px 0' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total ELO</div>
          <div style={{ fontSize: '2rem', fontWeight: '900' }}>{user?.elo + eloDelta}</div>
          <div style={{ color: eloDelta >= 0 ? 'var(--brand-accent)' : 'var(--danger)', fontWeight: 'bold' }}>+{eloDelta} Earned</div>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: '2rem', fontWeight: '900' }}>{Math.round((correctCount / questions.length) * 100)}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{correctCount}/{questions.length} Correct</div>
        </div>
      </div>

      <button className="btn-play-huge" style={{ marginBottom: '16px', background: '#f97316', boxShadow: '0 8px 25px rgba(249, 115, 22, 0.2)' }} onClick={() => {
        setMatchProcessed(false);
        setGameState('lobby');
        setScore(0);
        setCorrectCount(0);
        setCurrentIndex(0);
        setSelectedAnswer(null);
      }}>
        ENCORE (PLAY AGAIN)
      </button>
      <button className="btn-play-huge" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={onExit}>
        Leave Theater
      </button>
    </motion.div>
  );
}
