'use client';
import { useRouter } from 'next/navigation';
import GameManager from '../../../components/GameManager';
import IdiomsTheaterEngine from '../../../components/IdiomsTheaterEngine';

export default function GameModePage({ params }) {
  const router = useRouter();
  const mode = params.mode; // synonyms, antonyms, idioms, ows, mixed

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div className="mobile-app-frame" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        {mode === 'idioms' ? (
          <IdiomsTheaterEngine onExit={handleExit} />
        ) : (
          <GameManager onExit={handleExit} gameMode={mode} />
        )}
      </div>
    </div>
  );
}
