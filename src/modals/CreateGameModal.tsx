import { observer } from 'mobx-react';
import { useMainStore } from '../stores';
import {
  Button,
  Modal,
  StyledForm,
  FormInput,
  FormSelect,
  Body,
  useTranslation,
} from '../components';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import debouce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { styled } from 'styled-components';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { E2E_GAME_NAME } from '../Constants';

export interface CreateGameValues {
  gameName: string;
  players: string[];
  maxNumberOfMarks: number;
}
export interface CreateGameForm {
  gameName: string;
  players: { label: string; value: string }[];
  maxNumberOfMarks: number;
}

const initialFormValues = {
  gameName: '',
  maxNumberOfMarks: NaN,
  players: [],
};

export const CreateGameModal = observer(function CreateGameModal() {
  const t = useTranslation();
  const { modalStore, authStore, gameStore, dbService } = useMainStore();
  const queryClient = useQueryClient();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const createGameNutation = useMutation<
    PostgrestSingleResponse<string>,
    PostgrestError,
    CreateGameValues
  >({
    mutationFn: (values: CreateGameValues) => gameStore.createGame(values),
    onSuccess: () => {
      queryClient.invalidateQueries(['games']);
      closeModal();
    },
  });

  const friendResponse = useQuery({
    queryKey: ['friends'],
    queryFn: () => dbService.getFriends(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

  const searchReponse = useQuery({
    queryKey: ['searchUsers', debouncedSearchTerm],
    queryFn: () => dbService.searchUser(debouncedSearchTerm, authStore.userId),
    enabled: Boolean(debouncedSearchTerm.length),
  });

  const playerOptions = useMemo(() => {
    const friends =
      friendResponse.data?.data?.map(({ friendId, username }) => ({
        label: username,
        value: friendId,
      })) ?? [];
    const searchResults =
      searchReponse.data?.data?.map(({ id, username }) => ({
        label: username,
        value: id,
      })) ?? [];

    return [...friends, ...searchResults];
  }, [friendResponse.data?.data, searchReponse.data?.data]);

  const handleDebouncedSelectChange = (val: string) => {
    setDebouncedSearchTerm(val);
  };
  const debouncedSelectResults = useMemo(() => {
    return debouce(handleDebouncedSelectChange, 500);
  }, []);

  useEffect(() => {
    return () => {
      debouncedSelectResults.cancel();
    };
  });

  const onSubmit = ({ players, ...values }: CreateGameForm) => {
    createGameNutation.mutate({
      ...values,
      players: players.map((p) => p.value),
    });
  };

  const closeModal = () => {
    modalStore.setCreateGameModalVisible(false);
  };
  const getLabel = (input: string) => {
    if (friendResponse.status === 'loading') {
      return t('modal.create.game.friend.loading');
    }

    if (searchReponse.isInitialLoading) {
      return t('modal.create.game.search.loading');
    }

    if (debouncedSearchTerm.length && !searchReponse.data?.data?.length) {
      return t('modal.create.game.search.empty', { values: [input] });
    }

    return t('modal.create.game.friends.empty');
  };

  const ValidationSchema = Yup.object().shape({
    gameName: Yup.string()
      .required(t('general.input.required'))
      .test(
        'is-valid-game-name',
        t('modal.create.game.invalidName'),
        function (value) {
          if (authStore.isE2e) {
            return true;
          } else {
            return value.trim() !== E2E_GAME_NAME;
          }
        },
      ),
    maxNumberOfMarks: Yup.number()
      .min(1, t('modal.create.game.min.marks'))
      .max(5, t('modal.create.game.max.marks'))
      .required(t('general.input.required')),
    players: Yup.array()
      .min(1, t('modal.create.game.min.players'))
      .of(
        Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        }),
      ),
  });

  return (
    <Modal
      title={t('modal.create.game.title')}
      aria={{ labelledby: 'createGameModalTitle' }}
      open={modalStore.createGameModalVisible}
      onRequestClose={closeModal}
      onClose={closeModal}
      showCloseButton
    >
      <Formik
        validationSchema={ValidationSchema}
        initialValues={initialFormValues}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <StyledForm>
          <Field
            id="gameName"
            name="gameName"
            type="text"
            placeholder={t('modal.create.game.name.label')}
            aria-label={t('modal.create.game.name.label')}
            component={FormInput}
          />

          <Field
            id="maxNumberOfMarks"
            name="maxNumberOfMarks"
            type="number"
            placeholder={t('modal.create.game.marks.label')}
            aria-label={t('modal.create.game.marks.label')}
            component={FormInput}
          />

          <Field
            id="players"
            name="players"
            component={FormSelect}
            isMulti
            placeholder={t('modal.create.game.players.label')}
            onInputChange={debouncedSelectResults}
            options={playerOptions}
            aria-label={t('modal.create.game.players.label')}
            noOptionsMessage={({ inputValue }: { inputValue: string }) =>
              getLabel(inputValue)
            }
          />

          <Button type="submit" name="submit">
            {t('modal.create.game.cta')}
          </Button>

          {createGameNutation.isError && (
            <ErrorContainer>
              <Body color="error">{createGameNutation.error.message}</Body>
            </ErrorContainer>
          )}
        </StyledForm>
      </Formik>
    </Modal>
  );
});

const ErrorContainer = styled.div`
  align-self: flex-end;
`;
