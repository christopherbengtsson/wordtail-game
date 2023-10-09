import { observer } from 'mobx-react';
import { useMainStore } from '../stores';
import {
  Button,
  Modal,
  StyledForm,
  FormInput,
  FormSelect,
} from '../components';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import debouce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  maxNumberOfMarks: Yup.number()
    .min(1, 'Min 1 mark')
    .max(5, 'Max 5 marks')
    .required('Required field'),
  players: Yup.array()
    .min(1, 'Pick at least 1 player')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      }),
    ),
});

const initialFormValues = {
  name: '',
  maxNumberOfMarks: '',
  players: [],
};

export const CreateGameModal = observer(function CreateGameModal() {
  const { modalStore, dbService } = useMainStore();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const friendResponse = useQuery({
    queryKey: ['friends'],
    queryFn: () => dbService.getFriends(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

  const searchReponse = useQuery({
    queryKey: ['searchUsers', debouncedSearchTerm],
    queryFn: () => dbService.searchUser(debouncedSearchTerm),
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

  const onSubmit = (formValues: typeof initialFormValues) => {
    console.log(formValues);
    // closeModal();
  };

  const closeModal = () => {
    modalStore.setCreateGameModalVisible(false);
  };
  const getLabel = (input: string) => {
    if (friendResponse.status === 'loading') {
      return 'Loading friends...';
    }

    if (searchReponse.isInitialLoading) {
      return 'Searching...';
    }

    if (debouncedSearchTerm.length && !searchReponse.data?.data?.length) {
      return 'No player with username ' + input;
    }

    return 'No friends found, try searching';
  };

  return (
    <Modal
      title="Create new game"
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
            id="name"
            name="name"
            type="text"
            placeholder="Game name..."
            aria-label="Enter a game name"
            component={FormInput}
          />

          <Field
            id="maxNumberOfMarks"
            name="maxNumberOfMarks"
            type="number"
            placeholder="Max number of marks..."
            aria-label="Enter max number of marks for a player"
            component={FormInput}
          />

          <Field
            id="players"
            name="players"
            component={FormSelect}
            isMulti
            placeholder="Players..."
            onInputChange={debouncedSelectResults}
            options={playerOptions}
            aria-label="Select players"
            noOptionsMessage={({ inputValue }: { inputValue: string }) =>
              getLabel(inputValue)
            }
          />

          <Button type="submit" name="submit">
            Submit
          </Button>
        </StyledForm>
      </Formik>
    </Modal>
  );
});
