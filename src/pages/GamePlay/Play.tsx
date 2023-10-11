import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { GameMoveParams, useMainStore } from '../../stores';
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
import { Json } from '../../services/IDatabase';

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

  const playerMoveMutation = useMutation<
    Document | PostgrestSingleResponse<void | Json>,
    PostgrestError,
    GameMoveParams
  >({
    mutationFn: (params: GameMoveParams) => gameStore.handleGameMove(params),
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

  const submitLetterOrGiveUp = () => {
    const params: GameMoveParams = {
      gameId,
      gameMove: 'add_letter',
      letter: newLetter,
    };
    if (!newLetter.trim().length) {
      // TODO: Confirm dialog
      params.letter = undefined;
      params.gameMove = 'give_up';
    }

    playerMoveMutation.mutate(params);
  };

  const callFinishedWord = () => {
    const params: GameMoveParams = {
      gameId,
      gameMove: 'call_finished_word',
    };
    playerMoveMutation.mutate(params);
  };

  const callBluff = () => {
    console.log('TODO: Not implemented');
  };

  const onTimesUp = () => {
    // setTimesUp(true);
    // setTimeout(() => {
    //   setNewLetter('');
    //   submitLetter();
    // }, 500);
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
              onClick={() => submitLetterOrGiveUp()}
            >
              Send letter
            </Button>

            {/* {!!letters.length && ( */}
            <ActionContainer>
              <Button size="lg" disabled={true} onClick={() => callBluff()}>
                Call Bluff
              </Button>

              <Button
                size="lg"
                disabled={false}
                onClick={() => callFinishedWord()}
              >
                Call Finished Word
              </Button>
            </ActionContainer>
            {/* )} */}
          </StyledForm>
        </CenterContainer>
      )}
    </>
  );
});

// TODO: Should it be a form?
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

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.m};
  width: 100%;

  & > button {
    flex: 1;
  }
`;
