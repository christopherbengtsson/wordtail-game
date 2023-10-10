import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  CenterContainer,
  CountdownIndicator,
  Input,
} from '../../components';
import { TActiveGame, TMoveType } from '../../services';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { quadraticDuration } from '../../utils';

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
  const [timesUp, setTimesUp] = useState(false);

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
      navigate('stats', { replace: true }); // TODO: Navigate to some stats or optimistically update like if too many marks
    },
  });

  const letters = game.lettersSoFar;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (letters?.length) {
      timeout = setTimeout(() => {
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
      if (!game.lettersSoFar) {
        // TODO: User can't quit on first move, show some text or whatev
        // return;
      }

      // TODO: Confirm dialog
      params.letter = undefined;
    }

    submitLetterMutation.mutate(params);
  };

  const onTimesUp = () => {
    setTimesUp(true);
    setTimeout(() => {
      setNewLetter('');
      submitLetter();
    }, 500);
  };

  return (
    <>
      {letters.length && animating ? (
        <AnimateLetters
          letters={letters}
          animationDuration={ANIMATION_DURATION}
        />
      ) : (
        <CenterContainer skipFlexGrow fullWidth>
          <CountdownIndicator
            duration={quadraticDuration(letters.length)}
            onTimeUp={onTimesUp}
          />
          <StyledForm>
            <Input
              className="letterInput"
              autoFocus
              disabled={timesUp}
              maxLength={1}
              value={newLetter}
              onChange={(ev) => {
                setNewLetter(ev.target.value.toUpperCase());
              }}
            />
            <Button
              primary
              size="lg"
              disabled={timesUp}
              onClick={() => submitLetter()}
            >
              Place letter
            </Button>
          </StyledForm>
        </CenterContainer>
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
