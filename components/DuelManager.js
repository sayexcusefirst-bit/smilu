'use client';
import { useState, useEffect } from 'react';
import { getMatchQuestions } from '../lib/vocabData';
import { updateMatchStats, getUserData } from '../lib/storage';
import { Swords, CheckCircle2, XCircle } from 'lucide-react';

export default function DuelManager({ onExit, gameMode = 'mixed' }) {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, result
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60s per match
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
      setTimeout(() => {
        setQuestions(getMatchQuestions(gameMode));
        setGameState('playing');
        setTimeLeft(60);
      }, 3000); // Simulate 3s matchmaking
    }
  }, [gameState, gameMode]);

  // Handle Match Results persistence
  useEffect(() => {
    if (gameState === 'result' && !matchProcessed) {
      const isWinner = score > botScore;
      const isTie = score === botScore;
      
      const delta = isWinner ? 25 : isTie ? 5 : -15;
      setEloDelta(delta);

      const result = updateMatchStats({
        isWin: isWinner,
        isDraw: isTie,
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
  }, [gameState, score, botScore, questions.length, correctCount, gameMode, matchProcessed]);

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

  // Bot logic
  useEffect(() => {
    if (gameState === 'playing' && !selectedAnswer) {
      const botTimer = setTimeout(() => {
        const isCorrect = Math.random() < 0.7;
        if (isCorrect) {
          setBotScore(prev => prev + 10);
        }
      }, Math.random() * 3000 + 3000);
      return () => clearTimeout(botTimer);
    }
  }, [currentIndex, gameState, selectedAnswer]);

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
    }, 1000);
  };

  if (gameState === 'lobby') {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px' }} className="animate-slide-up">
        <Swords size={64} className="animate-pulse" style={{ margin: '0 auto 20px', color: 'var(--brand-primary)' }} />
        <h2 className="text-glow">Finding Opponent...</h2>
        <p style={{color: 'var(--text-muted)'}}>Mode: {gameMode.toUpperCase()}</p>
        
        <div className="glass-panel" style={{ marginTop: '40px', padding: '24px' }}>
          <h3>{user?.username || 'Challenger'}</h3>
          <p style={{color: 'var(--brand-accent)', fontWeight: 'bold'}}>{user?.elo || 1200} ELO</p>
          <p style={{marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>Calibrating arena for {user?.skillLevel || 'Normal'} difficulty...</p>
        </div>

        <button 
          onClick={onExit}
          style={{ marginTop: '40px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}
        >
          Cancel Matchmaking
        </button>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currQ = questions[currentIndex];
    return (
      <div className="animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>You</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--brand-accent)' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: timeLeft <= 10 ? 'var(--danger)' : 'white' }}>
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
            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Opponent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--brand-secondary)' }}>{botScore}</div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-drain" style={{ animationDuration: '60s' }}></div>
        </div>

        <div className="glass-panel" style={{ padding: '32px 20px', textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: 1 }}>
            {currQ?.type} Logic
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '8px' }}>{currQ?.word}</h2>
          <p style={{ color: 'var(--brand-accent)', fontStyle: 'italic', fontSize: '0.9rem' }}>Hint: {currQ?.hint_hi}</p>
        </div>

        <div className="answers-grid">
          {currQ?.options.map((opt, i) => {
            let className = 'answer-btn';
            if (selectedAnswer) {
              if (opt === currQ.answer) className += ' correct';
              else if (opt === selectedAnswer) className += ' incorrect';
            }

            return (
              <button key={i} className={className} onClick={() => handleAnswer(opt)} disabled={!!selectedAnswer}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    );
  }

  const isWinner = score > botScore;
  const isTie = score === botScore;

  return (
    <div style={{ textAlign: 'center', paddingTop: '40px' }} className="animate-slide-up">
      {isWinner ? (
        <CheckCircle2 size={80} color="var(--brand-accent)" style={{ margin: '0 auto 20px' }} />
      ) : isTie ? (
        <Swords size={80} color="#ccc" style={{ margin: '0 auto 20px' }} />
      ) : (
        <XCircle size={80} color="var(--danger)" style={{ margin: '0 auto 20px' }} />
      )}
      
      <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>
        {isWinner ? 'VICTORY' : isTie ? 'DRAW' : 'DEFEAT'}
      </h1>

      <div style={{ display: 'flex', gap: '16px', margin: '40px 0' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Match ELO</div>
          <div style={{ fontSize: '2rem', fontWeight: '900' }}>{user?.elo + eloDelta}</div>
          <div style={{ color: eloDelta >= 0 ? 'var(--brand-accent)' : 'var(--danger)', fontWeight: 'bold' }}>
            {eloDelta >= 0 ? '+' : ''}{eloDelta}
          </div>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: '2rem', fontWeight: '900' }}>{Math.round((correctCount / questions.length) * 100)}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{correctCount}/{questions.length} Correct</div>
        </div>
      </div>

      <button className="btn-play-huge" style={{ marginBottom: '16px' }} onClick={() => {
        setMatchProcessed(false);
        setGameState('lobby');
        setScore(0);
        setBotScore(0);
        setCorrectCount(0);
        setCurrentIndex(0);
        setSelectedAnswer(null);
      }}>
        FIND NEW MATCH
      </button>
      <button className="btn-play-huge" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={onExit}>
        Exit Arena
      </button>
    </div>
  );
}
