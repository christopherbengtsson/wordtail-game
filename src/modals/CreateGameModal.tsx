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
  players: [],
};

export const CreateGameModal = observer(function CreateGameModal() {
  const { modalStore, dbService } = useMainStore();

  const [searchTerm, setSearchTerm] = useState('');

  const friendResponse = useQuery({
    queryKey: ['friends'],
    queryFn: () => dbService.getFriends(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

  const searchReponse = useQuery({
    queryKey: ['searchUsers', searchTerm],
    queryFn: () => dbService.searchUser(searchTerm),
    enabled: Boolean(searchTerm.length),
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

  const handleChange = (val: string) => {
    setSearchTerm(val);
  };
  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 500);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
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

    if (searchReponse.status === 'loading') {
      return 'Searching...';
    }

    if (searchTerm.length) {
      return 'No player with username ' + input;
    }

    return 'Type a username!';
  };
  console.log(playerOptions);
  return (
    <Modal
      title="Create new game"
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
            component={FormInput}
          />

          <Field
            id="players"
            name="players"
            component={FormSelect}
            isMulti
            placeholder="Players..."
            onInputChange={debouncedResults}
            options={playerOptions}
            noOptionsMessage={({ inputValue }: { inputValue: string }) =>
              getLabel(inputValue)
            }
          />

          <Button type="submit">Submit</Button>
        </StyledForm>
      </Formik>
    </Modal>
  );
});
