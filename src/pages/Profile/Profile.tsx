import { observer } from 'mobx-react';
import { useMainStore } from '../../stores';
import { useMutation } from '@tanstack/react-query';

export const Profile = observer(function Profile() {
  const { authStore } = useMainStore();
  const signOutMutation = useMutation({
    mutationFn: () => authStore.signOut(),
  });

  return (
    <>
      <button
        onClick={() => {
          signOutMutation.mutate();
        }}
      >
        Sign out
      </button>
      <h4>{authStore.userId}</h4>
      <h4>{authStore.user?.email}</h4>
    </>
  );
});
