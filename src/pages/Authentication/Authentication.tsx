import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useMainStore } from '../../stores';

export type Credentials = {
  email: string;
  password: string;
};

export function Authentication() {
  const { authStore } = useMainStore();
  const navigate = useNavigate();

  const [doRegister, setDoRegister] = useState(false);

  const signInMutation = useMutation({
    mutationFn: (creds: Credentials) => authStore.signIn(creds),
    onSuccess: () => {
      navigate('/');
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (creds: Credentials) => authStore.signUp(creds),
    onSuccess: () => {
      navigate('/');
    },
  });

  const onFinish = async (creds: Credentials) => {
    if (doRegister) {
      signUpMutation.mutate(creds);
    } else {
      signInMutation.mutate(creds);
    }
  };

  return (
    <FormContainer>
      <Form
        name="auth_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        disabled={signInMutation.isLoading || signUpMutation.isLoading}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input
            prefix={<UserOutlined />}
            type="email"
            size="large"
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            size="large"
            placeholder="Password"
          />
        </Form.Item>

        {doRegister && (
          <Form.Item
            name="password_confirm"
            rules={[
              { required: true, message: 'Please confirm your password' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Confirm password"
            />
          </Form.Item>
        )}

        <Form.Item>
          <ButtonContainer>
            <Button type="primary" htmlType="submit" size="large">
              {!doRegister ? 'Login' : 'Register'}
            </Button>

            <Button type="link" onClick={() => setDoRegister(!doRegister)}>
              {!doRegister
                ? "I don't have an account!"
                : 'I already have an account!'}
            </Button>
          </ButtonContainer>
        </Form.Item>
      </Form>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  form {
    min-width: 350px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
