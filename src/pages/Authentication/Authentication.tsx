import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Headline,
  StyledForm,
  FormInput,
  Body,
} from '../../components';
import { Frame } from 'react95';
import { getIsRecurringUser, setIsRecurringUser } from '../../utils';
import {
  AuthError,
  AuthResponse,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { isDev } from '../../Constants';

const yupEmailValidator = Yup.string()
  .email('Invalid email')
  .required('Email is required');
const yupPasswordValidator = Yup.string()
  .min(6, 'Password must to be at least 6 characters')
  .required('Password is required');
const yupConfirmPasswordValidator = Yup.string()
  .oneOf([Yup.ref('password')], "Passwords don't match")
  .required('Confirmation password is required');

export function Authentication() {
  const { authStore } = useMainStore();
  const navigate = useNavigate();
  const [doRegister, setDoRegister] = useState(!getIsRecurringUser());

  const ValidationSchema = doRegister
    ? Yup.object().shape({
        email: yupEmailValidator,
        password: yupPasswordValidator,
        confirmPassword: yupConfirmPasswordValidator,
      })
    : Yup.object().shape({
        email: yupEmailValidator,
        password: yupPasswordValidator,
      });

  const signInMutation = useMutation<
    AuthResponse,
    AuthError,
    SignUpWithPasswordCredentials
  >({
    mutationFn: (creds: SignUpWithPasswordCredentials) =>
      authStore.signIn(creds),
    onSuccess: () => {
      setIsRecurringUser();
      navigate('/');
    },
  });

  const signUpMutation = useMutation<
    AuthResponse,
    AuthError,
    SignUpWithPasswordCredentials
  >({
    mutationFn: (creds: SignUpWithPasswordCredentials) =>
      authStore.signUp(creds),
    onSuccess: () => {
      setIsRecurringUser();
      navigate('/');
    },
  });

  const mutationError = signInMutation.isError
    ? signInMutation.error
    : signUpMutation.isError
    ? signUpMutation.error
    : null;

  const onSubmit = async (creds: SignInWithPasswordCredentials) => {
    if (doRegister) {
      signUpMutation.mutate(creds);
    } else {
      signInMutation.mutate(creds);
    }
  };

  const DEV_GENERATE_USERS = async () => {
    authStore.DEV_GENERATE_USERS();
  };

  return (
    <FormContainer>
      <Headline>Wordtail</Headline>
      <StyledFrame>
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
              aria-label="Email"
              component={FormInput}
            />

            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              aria-label="Password"
              component={FormInput}
            />

            {doRegister && (
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                aria-label="Confirm password"
                component={FormInput}
              />
            )}

            <Button type="submit" size="lg" aria-label="Submit">
              {doRegister ? 'Register' : 'Sign In'}
            </Button>

            {isDev && (
              <Button type="button" onClick={DEV_GENERATE_USERS}>
                Generate users
              </Button>
            )}

            {mutationError !== null && (
              <ErrorContainer>
                <Body color="error">{mutationError.message}</Body>
              </ErrorContainer>
            )}
          </StyledForm>
        </Formik>

        <TextButton
          aria-label={
            doRegister ? "I don't have an account" : 'I already have an account'
          }
          onClick={() => setDoRegister(!doRegister)}
        >
          {!doRegister
            ? "I don't have an account"
            : 'I already have an account'}
        </TextButton>
      </StyledFrame>
    </FormContainer>
  );
}

const ErrorContainer = styled.div`
  align-self: flex-end;
`;

const StyledFrame = styled(Frame)`
  width: 95%;
  padding: ${(p) => p.theme.spacing.m};

  ${(p) => p.theme.screens.large} {
    padding: ${(p) => p.theme.spacing.xxl};
    width: initial;
  }
`;

const FormContainer = styled.main`
  flex: 1 1 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => p.theme.spacing.l};
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

const TextButton = styled.button`
  color: ${(p) => p.theme.anchor};
  background: none;
  border: none;
  margin-top: ${(p) => p.theme.spacing.xs};

  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: ${(p) => p.theme.anchorVisited};
  }
`;
