import { useQuery } from '@tanstack/react-query';
import { CommonStatsProps } from '.';
import { useMainStore } from '../../stores';

export function ActiveGameStats({ gameId }: CommonStatsProps) {
  const { gameStore } = useMainStore();

  const { data, error } = useQuery({
    queryKey: ['baseGameStats', gameId],
    queryFn: () => gameStore.getBaseGameStatsById(gameId),
  });
  const game = data?.data;
  console.log(game);

  return <div>ActiveGameStats</div>;
}
