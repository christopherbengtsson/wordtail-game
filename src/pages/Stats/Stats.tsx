import { useParams, useSearchParams } from 'react-router-dom';
import { ActiveGameStats } from './ActiveGameStats';
import { FinishedGameStats } from './FinishedGameStats';
import { MoveMadeStats } from './MoveMadeStats';

export interface CommonStatsProps {
  gameId: string;
}

export function Stats() {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();

  const statsType = searchParams.get('statsType');

  // TODO: Get some query param to determine component?

  if (!gameId) {
    throw new Error('No gameId provided to stats');
  }

  if (statsType === 'active') {
    return <ActiveGameStats gameId={gameId} />;
  }
  if (statsType === 'move') {
    return <MoveMadeStats gameId={gameId} />;
  }

  // Defaulting to finished stats
  return <FinishedGameStats gameId={gameId} />;
}
