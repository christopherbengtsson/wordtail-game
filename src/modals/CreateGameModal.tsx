import { observer } from 'mobx-react';
import { useMainStore } from '../stores';
import { Button, Modal, StyledForm } from '../components';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { CustomInputComponent } from '../pages/Authentication/CustomInput';

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  players: Yup.array()
    .min(1, 'Add atleast one player')
    .required('Add atleast one player')
    .nullable(),
});

export const CreateGameModal = observer(function CreateGameModal() {
  const { modalStore } = useMainStore();

  const handleOk = () => {
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
        initialValues={{
          name: '',
          players: [],
        }}
        onSubmit={(values) => console.log(values)}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <StyledForm>
          <Field
            id="name"
            name="name"
            type="text"
            placeholder="Game name"
            component={CustomInputComponent}
          />

          <Field
            id="players"
            name="players"
            type="text"
            placeholder="Players"
            component={CustomInputComponent}
          />

          <Button type="submit">Submit</Button>
        </StyledForm>
      </Formik>
    </Modal>
  );
});
