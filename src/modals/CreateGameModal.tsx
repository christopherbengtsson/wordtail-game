import { Form, Input, Modal, Select } from 'antd';
import { observer } from 'mobx-react';
import { useMainStore } from '../stores';

export const CreateGameModal = observer(function CreateGameModal() {
  const { modalStore } = useMainStore();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // TODO: Mutate
        console.log(values);
        closeModal();
      })
      .catch((info) => {
        console.warn('Validate Failed:', info);
      });
  };

  const closeModal = () => {
    modalStore.setCreateGameModalVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      open={modalStore.createGameModalVisible}
      okText="Create game"
      onOk={handleOk}
      onCancel={closeModal}
      cancelText="Cancel"
      //   confirmLoading={confirmLoading}
      title="Create new game"
    >
      <Form
        name="create_game_form"
        form={form}
        preserve={false}
        onFinish={handleOk}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input type="text" size="large" placeholder="Game name" />
        </Form.Item>

        <Form.Item
          name="players"
          rules={[
            {
              required: true,
              message: 'You need to invite atleast one player',
            },
          ]}
        >
          <Select size="large" placeholder="Add players" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
