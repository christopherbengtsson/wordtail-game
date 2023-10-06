import { observer } from 'mobx-react';
import { useMainStore } from '../../stores';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../components';
import {
  Headline,
  PrimaryTitleWrapper,
  SecondaryTitle,
  SecondaryTitleWrapper,
  BodyAsTitle,
  BodyAsTitleWrapper,
  Subtitle,
  Body,
  BodyBold,
  SmallBody,
  Caption,
  Tiny,
} from '../../components/Typography/Typography';

export const Profile = observer(function Profile() {
  const { authStore } = useMainStore();
  const signOutMutation = useMutation({
    mutationFn: () => authStore.signOut(),
  });

  return (
    <>
      <Button
        onClick={() => {
          signOutMutation.mutate();
        }}
      >
        Sign out
      </Button>

      <Body>{authStore.userId}</Body>
      <Body>{authStore.user?.email}</Body>

      <Headline>Headline</Headline>
      <br />
      <PrimaryTitleWrapper>PrimaryTitleWrapper</PrimaryTitleWrapper>
      <br />
      <PrimaryTitleWrapper large>Large PrimaryTitleWrapper</PrimaryTitleWrapper>
      <br />
      <SecondaryTitle>SecondaryTitle</SecondaryTitle>
      <br />
      <SecondaryTitleWrapper>SecondaryTitleWrapper</SecondaryTitleWrapper>
      <br />
      <BodyAsTitle>BodyAsTitle</BodyAsTitle>
      <br />
      <BodyAsTitleWrapper>BodyAsTitleWrapper</BodyAsTitleWrapper>
      <br />
      <Subtitle>Subtitle</Subtitle>
      <br />
      <BodyBold>BodyBold</BodyBold>
      <br />
      <Body>Body</Body>
      <br />
      <SmallBody>SmallBody</SmallBody>
      <br />
      <Caption>Caption</Caption>
      <br />
      <Tiny>Tiny</Tiny>
      <br />
    </>
  );
});
