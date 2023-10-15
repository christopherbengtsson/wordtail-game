import { observer } from 'mobx-react';
import {
  Button,
  CenterContainer,
  CountdownIndicator,
  Input,
  useTranslation,
} from '../../components';
import { styled } from 'styled-components';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GameMoveParams, useMainStore } from '../../stores';
import { useNavigate } from 'react-router-dom';
import { quadraticDuration } from '../../utils';

export const RevealBluff = observer(function RevealBluff({
  gameId,
  letters,
}: {
  gameId: string;
  letters: string;
}) {
  const t = useTranslation();
  const { gameStore } = useMainStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [word, setWord] = useState('');
  const [timesUp, setTimesUp] = useState(false);

  const showWordMutation = useMutation({
    mutationFn: (params: GameMoveParams) => gameStore.handleGameMove(params),
    onSuccess: () => {
      queryClient.invalidateQueries(['game', gameId]);
      queryClient.invalidateQueries(['games']);
      navigate('stats', { replace: true });
    },
  });

  const submitWordOrGiveUp = () => {
    if (!word.length) {
      // TODO: Confirm no word = give up
      showWordMutation.mutate({
        gameId,
        gameMove: 'give_up',
      });
    }

    showWordMutation.mutate({
      gameId,
      gameMove: 'reveal_bluff',
      word,
    });
  };

  const onTimesUp = () => {
    setTimesUp(true);
    submitWordOrGiveUp();
  };

  return (
    <CenterContainer skipFlexGrow fullWidth>
      <CountdownIndicator
        duration={quadraticDuration(letters.length)}
        onTimeUp={onTimesUp}
      />

      <StyledForm>
        <Input
          className="wordInput"
          autoFocus
          value={word}
          disabled={timesUp}
          defaultValue={letters} // TODO
          onChange={(ev) => {
            setWord(ev.target.value.toUpperCase());
          }}
        />

        <Button
          primary
          size="lg"
          disabled={timesUp}
          onClick={() => submitWordOrGiveUp()}
        >
          {t('game.reveal.bluff.cta')}
        </Button>
      </StyledForm>
    </CenterContainer>
  );
});

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => p.theme.spacing.m};

  // & .wordInput {
  //   height: 100px;
  //   input {
  //     width: 100px;
  //     height: 100px;
  //     text-align: center;
  //     font-size: 4rem;
  //   }
  // }
`;
