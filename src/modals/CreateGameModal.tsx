import { observer } from 'mobx-react';
import { useMainStore } from '../stores';
import { Button, Modal, StyledForm, FormInput } from '../components';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  players: Yup.array()
    .min(1, 'Add atleast one player')
    .required('Add atleast one player')
    .nullable(),
});

const initialFormValues = {
  name: '',
  players: [],
};
export const CreateGameModal = observer(function CreateGameModal() {
  const { modalStore } = useMainStore();

  const onSubmit = (formValues: typeof initialFormValues) => {
    console.log(formValues);
    closeModal();
  };

  const closeModal = () => {
    modalStore.setCreateGameModalVisible(false);
  };

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
            placeholder="Game name"
            component={FormInput}
          />

          <Field
            id="players"
            name="players"
            type="text"
            placeholder="Players"
            component={FormInput}
          />

          <Button type="submit">Submit</Button>
        </StyledForm>
      </Formik>
    </Modal>
  );
});
