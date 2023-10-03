import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { CustomInputComponent } from './CustomInput';
import { Button, MOBILE_SCREEN_WIDTH } from '../../components';

const yupEmailValidator = Yup.string()
  .email('Invalid email')
  .required('Email required');
const yupPasswordValidator = Yup.string().required('Password required');
const yupConfirmPasswordValidator = Yup.string()
  .oneOf([Yup.ref('password')], "Passwords don't match")
  .required('Password required');

export type Credentials = {
  email: string;
  password: string;
};

interface IValues {
  email: '';
  password: '';
  confirmPassword: '';
}

export function Authentication() {
  const { authStore } = useMainStore();
  const navigate = useNavigate();
  const [doRegister, setDoRegister] = useState(false);

  const ValidationSchema = useMemo(() => {
    if (doRegister) {
      return Yup.object().shape({
        email: yupEmailValidator,
        password: yupPasswordValidator,
        confirmPassword: yupConfirmPasswordValidator,
      });
    }

    return Yup.object().shape({
      email: yupEmailValidator,
      password: yupPasswordValidator,
    });
  }, [doRegister]);

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

  const onSubmit = async (
    { email, password }: IValues,
    { setSubmitting }: FormikHelpers<IValues>,
  ) => {
    if (doRegister) {
      signUpMutation.mutate({ email, password });
    } else {
      signInMutation.mutate({ email, password });
    }

    setSubmitting(false);
  };

  return (
    <Container>
      <FormContainer>
        <Frame>
          <Formik
            validationSchema={ValidationSchema}
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            <StyledForm>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                component={CustomInputComponent}
              />

              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                component={CustomInputComponent}
              />

              {doRegister && (
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  component={CustomInputComponent}
                />
              )}

              <Button type="submit">Submit</Button>
            </StyledForm>
          </Formik>

          <TextButton onClick={() => setDoRegister(!doRegister)}>
            {!doRegister
              ? "I don't have an account"
              : 'I already have an account'}
          </TextButton>
        </Frame>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  form {
    width: 100%;
  }

  ${(p) => p.theme.screens.large} {
    form {
      min-width: 316px;
    }
  }
`;

const Frame = styled.div`
  padding: ${(p) => p.theme.spacing.m};
  width: 90%;
  border-color: rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10)
    rgb(223, 223, 223);
  box-shadow: rgba(0, 0, 0, 0.35) 4px 4px 10px 0px,
    rgb(254, 254, 254) 1px 1px 0px 1px inset,
    rgb(132, 133, 132) -1px -1px 0px 1px inset;

  ${(p) => p.theme.screens.large} {
    padding: ${(p) => p.theme.spacing.xxl};
    width: initial;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;

  .customFormikInput {
    width: 100%;
  }

  button {
    align-self: flex-end;
  }

  p {
    align-self: flex-start;
  }
`;

const TextButton = styled.button`
  color: ${(p) => p.theme.colors.lightBlue};
  background: none;
  border: none;

  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: grey;
  }
`;
