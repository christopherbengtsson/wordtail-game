import { observer } from 'mobx-react';
import { useMainStore } from '../../stores';
import { useMutation } from '@tanstack/react-query';
import { Body, Button, Subtitle } from '../../components';

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
      <Subtitle>{authStore.user?.email}</Subtitle>
      <Body>{authStore.user?.id}</Body>
    </>
  );
});
