import { observer } from 'mobx-react';
import { useMainStore } from '../../stores';
import { useMutation } from '@tanstack/react-query';
import { Body, Button } from '../../components';

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

      <Body>{authStore.user?.email}</Body>
      <Body>{authStore.user?.id}</Body>
    </>
  );
});
