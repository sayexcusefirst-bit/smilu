'use client';
import { useState, useEffect } from 'react';
import { getMatchQuestions } from '../lib/vocabData';
import { Swords, CheckCircle2, XCircle } from 'lucide-react';

export default function DuelManager({ onExit, gameMode = 'mixed' }) {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, result
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60s per match
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (gameState === 'lobby') {
      setTimeout(() => {
        setQuestions(getMatchQuestions(gameMode));
        setGameState('playing');
        setTimeLeft(60);
      }, 3000); // Simulate 3s matchmaking
    }
  }, [gameState]);

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
      // Bot answers randomly every 3-6 seconds
      const botTimer = setTimeout(() => {
        // 70% chance bot gets it right
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
    }

    // Move to next question after delay
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
        <Swords size={64} color="var(--neon-purple)" className="animate-pulse" style={{ margin: '0 auto 20px' }} />
        <h2 className="text-glow">Finding Opponent...</h2>
        <p>Estimated queue time: 0:03</p>
        
        <div className="glass-panel" style={{ marginTop: '40px', padding: '20px' }}>
          <h3>Your Rating: 1200 Elo</h3>
          <p>Matchmaking in progress. Get ready!</p>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currQ = questions[currentIndex];
    return (
      <div className="animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>You</div>
            <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft <= 10 ? 'var(--neon-red)' : 'white' }}>0:{timeLeft.toString().padStart(2, '0')}</div>
            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Match Timer</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Opponent</div>
            <div className="text-glow" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--neon-red)' }}>{botScore}</div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-drain" style={{ animationDuration: '60s' }}></div>
        </div>

        <div className="glass-panel" style={{ padding: '30px 20px', textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ display: 'inline-block', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--neon-purple)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '10px', textTransform: 'uppercase' }}>
            {currQ.type}
          </span>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{currQ.word}</h2>
          <p style={{ color: '#888', fontStyle: 'italic' }}>Hint: {currQ.hint_hi}</p>
        </div>

        <div className="answers-grid">
          {currQ.options.map((opt, i) => {
            let className = 'answer-btn';
            if (selectedAnswer) {
              if (opt === currQ.answer) className += ' correct';
              else if (opt === selectedAnswer) className += ' incorrect';
            }

            return (
              <button 
                key={i} 
                className={className}
                onClick={() => handleAnswer(opt)}
                disabled={!!selectedAnswer}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    );
  }

  // Result screen
  const isWinner = score > botScore;
  const isTie = score === botScore;

  return (
    <div style={{ textAlign: 'center', paddingTop: '60px' }} className="animate-slide-up">
      {isWinner ? (
        <CheckCircle2 size={80} color="var(--neon-green)" style={{ margin: '0 auto 20px' }} />
      ) : isTie ? (
        <Swords size={80} color="#ccc" style={{ margin: '0 auto 20px' }} />
      ) : (
        <XCircle size={80} color="var(--neon-red)" style={{ margin: '0 auto 20px' }} />
      )}
      
      <h1 className={isWinner ? "text-gradient" : ""} style={{ fontSize: '2.5rem' }}>
        {isWinner ? 'Victory!' : isTie ? 'Draw!' : 'Defeat!'}
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '40px 0' }}>
        <div className="glass-panel" style={{ padding: '20px', width: '45%' }}>
          <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Your Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{score}</div>
          <div style={{ color: 'var(--neon-green)', marginTop: '10px' }}>{isWinner ? '+25 Elo' : isTie ? '+0 Elo' : '-15 Elo'}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', width: '45%' }}>
          <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Bot Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{botScore}</div>
        </div>
      </div>

      <button className="btn-neon" style={{ marginRight: '16px' }} onClick={() => setGameState('lobby')}>
        Rematch
      </button>
      <button className="btn-neon" style={{ background: 'transparent', borderColor: '#444' }} onClick={onExit}>
        Back to Home
      </button>
    </div>
  );
}
