import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Input } from '../../components';
import { TActiveGame, TMoveType } from '../../services';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

const ANIMATION_DURATION = 1000;
export interface SubmitLetterParams {
  gameId: string;
  gameMove: TMoveType;
  letter?: string;
}
export interface PlayProps {
  gameId: string;
  game: TActiveGame;
}

export const Play = observer(function Play({ gameId, game }: PlayProps) {
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
      navigate('/', { replace: true }); // TODO: Navigate to some stats or optimistically update like if too many marks
    },
  });

  const letters = game.lettersSoFar;

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
      gameId,
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
    <>
      {letters.length && animating ? (
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
    </>
  );
});

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
