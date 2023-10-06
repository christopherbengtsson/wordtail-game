import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import { Formik, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Headline, StyledForm, FormInput } from '../../components';
import { Frame } from 'react95';

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
export interface FormValues extends Credentials {
  confirmPassword: '';
}

export function Authentication() {
  const { authStore } = useMainStore();
  const navigate = useNavigate();
  const [doRegister, setDoRegister] = useState(false);

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
    { email, password }: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    if (doRegister) {
      signUpMutation.mutate({ email, password });
    } else {
      signInMutation.mutate({ email, password });
    }

    setSubmitting(false);
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
              component={FormInput}
            />

            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              component={FormInput}
            />

            {doRegister && (
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                component={FormInput}
              />
            )}

            <Button type="submit" size="lg">
              Submit
            </Button>
          </StyledForm>
        </Formik>

        <TextButton onClick={() => setDoRegister(!doRegister)}>
          {!doRegister
            ? "I don't have an account"
            : 'I already have an account'}
        </TextButton>
      </StyledFrame>
    </FormContainer>
  );
}

const StyledFrame = styled(Frame)`
  width: 95%;
  padding: ${(p) => p.theme.spacing.m};

  ${(p) => p.theme.screens.large} {
    padding: ${(p) => p.theme.spacing.xxl};
    width: initial;
  }
`;

const FormContainer = styled.div`
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

  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: ${(p) => p.theme.anchorVisited};
  }
`;
