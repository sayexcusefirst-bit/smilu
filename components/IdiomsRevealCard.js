import { motion } from 'framer-motion';

export default function IdiomsRevealCard({ question, isCorrect, onNext }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-panel" 
      style={{ 
        padding: '24px', 
        textAlign: 'left', 
        marginTop: '20px', 
        border: isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
        background: isCorrect ? 'linear-gradient(to bottom, rgba(16, 185, 129, 0.05), transparent)' : 'linear-gradient(to bottom, rgba(239, 68, 68, 0.05), transparent)'
      }}
    >
      <div style={{ color: isCorrect ? '#10b981' : '#ef4444', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isCorrect ? '🎉 Correct Interpretation!' : '💡 Let\'s review this idiom.'}
      </div>
      
      <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fbbf24', marginBottom: '8px' }}>"{question.word}"</h3>
      <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', lineHeight: 1.5 }}>{question.answer}</p>
      
      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.85rem', color: '#ddd', fontStyle: 'italic', borderLeft: '4px solid #fbbf24' }}>
        "{question.explanation}"
      </div>

      <button onClick={onNext} className="btn-play-huge" style={{ marginTop: '24px', padding: '14px', background: '#f97316', boxShadow: '0 8px 25px rgba(249, 115, 22, 0.2)' }}>
        Next Act
      </button>
    </motion.div>
  );
}
