import { observer } from 'mobx-react';
import { useMainStore } from '../stores';
import { Button, Modal, StyledForm, FormInput } from '../components';
import { Formik, Field, FieldArray } from 'formik';
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
  players: ['jared', 'ian', 'brent'],
};
export const CreateGameModal = observer(function CreateGameModal() {
  const { modalStore } = useMainStore();

  const onSubmit = (formValues: typeof initialFormValues) => {
    console.log(formValues);
    // closeModal();
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
        {({ values }) => (
          <StyledForm>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Game name"
              component={FormInput}
            />

            <FieldArray
              name="players"
              render={(arrayHelpers) => {
                return values.players && values.players.length > 0 ? (
                  values.players.map((player, index) => (
                    <div key={index}>
                      <Field
                        name={`player.${index}`}
                        placeholder="Add friend"
                        component={({ field, form, ...props }) => {
                          console.log(field);
                          return <input {...field} {...props} />;
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                      >
                        Uninvite
                      </Button>
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.insert(index, player)} // insert an empty string at a position
                      >
                        Invite
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>You need to add players to your friends list</p>
                );
              }}
            />

            <Button type="submit">Submit</Button>
          </StyledForm>
        )}
      </Formik>
    </Modal>
  );
});
