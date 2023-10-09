import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input } from '../../components';
import { TMoveType } from '../../services';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

const ANIMATION_DURATION = 1000;
export interface SubmitLetterParams {
  gameId: string;
  gameMove: TMoveType;
  letter?: string;
}
export const Game = observer(function Game() {
  // unstable_usePrompt({
  //   when: true,
  //   message: 'TODO: unstable_useBlocker with custom dialog?',
  // });

  const { gameId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { gameStore } = useMainStore();

  const [animating, setAnimating] = useState(true);
  const [newLetter, setNewLetter] = useState('');

  const submitLetterMutation = useMutation<
    PostgrestSingleResponse<void>,
    PostgrestError,
    SubmitLetterParams
  >({
    mutationFn: (params: SubmitLetterParams) =>
      gameStore.handleGameMove(params),
    onSuccess: () => {
      queryClient.invalidateQueries(['game', gameId]);
      queryClient.invalidateQueries(['games']);
      navigate('/');
    },
  });

  const { data: response } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameStore.getGameById(gameId),
    enabled: !!gameId,
  });

  const letters = response?.data?.lettersSoFar;

  useEffect(() => {
    if (!gameId) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (letters?.length) {
      timeout = setTimeout(() => {
        console.log('Animation should be done now');
        setAnimating(false);
      }, letters.length * ANIMATION_DURATION);
    }

    return () => clearTimeout(timeout);
  }, [letters?.length]);

  const submitLetter = () => {
    const params: SubmitLetterParams = {
      gameId: gameId!,
      gameMove: 'add_letter',
      letter: newLetter,
    };
    if (!newLetter.trim().length) {
      // TODO: Confirm dialog
      params.letter = undefined;
    }

    submitLetterMutation.mutate(params);
  };

  // TODO: Don't show input if there's no response yet
  return (
    <StyledContainer>
      {letters?.length && animating ? (
        <AnimateLetters
          letters={letters}
          animationDuration={ANIMATION_DURATION}
        />
      ) : (
        <StyledForm>
          <Input
            className="letterInput"
            autoFocus
            maxLength={1}
            value={newLetter}
            onChange={(ev) => {
              setNewLetter(ev.target.value.toUpperCase());
            }}
          />
          <Button primary size="lg" onClick={() => submitLetter()}>
            Place letter
          </Button>
        </StyledForm>
      )}
    </StyledContainer>
  );
});

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => p.theme.spacing.m};

  & .letterInput {
    height: 100px;
    input {
      width: 100px;
      height: 100px;
      text-align: center;
      font-size: 4rem;
    }
  }
`;
