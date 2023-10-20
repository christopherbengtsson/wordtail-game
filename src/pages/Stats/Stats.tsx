import { useParams, useSearchParams } from 'react-router-dom';
import { BaseStats } from './BaseStats';
import { ExtendedStats } from './ExtendedStats';
import { PlayerStatus } from '../../services';

export interface CommonStatsProps {
  gameId: string;
}

export function Stats() {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();

  const statsType = searchParams.get('statsType'); // TODO: typing
  const playerStatus = searchParams.get('playerStatus') as PlayerStatus | null;

  if (!gameId) {
    throw new Error('No gameId provided to stats');
  }

  if (
    statsType === 'move' ||
    (statsType === 'active' && playerStatus === 'out')
  ) {
    return <ExtendedStats gameId={gameId} />;
  }

  return <BaseStats gameId={gameId} />;
}
