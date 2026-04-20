import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useEffect } from 'react';

export default function IdiomsSceneCard({ visualHint, onComplete }) {
  const IconComponent = LucideIcons[visualHint] || LucideIcons.Sparkles;

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="glass-panel" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#0a0a0a', border: '2px solid rgba(249, 115, 22, 0.3)', boxShadow: '0 10px 40px rgba(249, 115, 22, 0.1)' }}>
      {/* Curtains */}
      <motion.div initial={{ width: '51%' }} animate={{ width: '0%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'linear-gradient(90deg, #4c0519, #881337)', zIndex: 10, borderRight: '2px solid #be123c' }} />
      <motion.div initial={{ width: '51%' }} animate={{ width: '0%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: 'linear-gradient(-90deg, #4c0519, #881337)', zIndex: 10, borderLeft: '2px solid #be123c' }} />

      {/* Stage light */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1 }} style={{ position: 'absolute', top: '-50%', width: '150%', height: '150%', background: 'radial-gradient(circle at center top, rgba(251, 191, 36, 0.3), transparent 60%)' }} />

      {/* Visual Metaphor Icon */}
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.8 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
        style={{ zIndex: 5 }}
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
          <IconComponent size={100} color="#fbbf24" strokeWidth={1} style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))' }} />
        </motion.div>
      </motion.div>

      <button onClick={onComplete} style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '0.75rem', color: '#777', background: 'transparent', border: '1px solid #333', borderRadius: '12px', padding: '4px 10px', cursor: 'pointer', zIndex: 20 }}>
        Skip Scene ⏭️
      </button>
    </div>
  );
}
