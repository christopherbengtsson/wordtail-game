import { observer } from 'mobx-react';
import { useMainStore } from '../../stores';

export const Profile = observer(function Profile() {
  const { authStore } = useMainStore();

  if (!authStore.isLoggedIn) {
    throw new Error('No session in SupaStore!');
  }

  return (
    <>
      <button
        onClick={() => {
          authStore.signOut();
        }}
      >
        Sign out
      </button>
      <h2>Hello {authStore.user?.username ?? 'Anonymous user'}</h2>
      <h4>{authStore.userId}</h4>
    </>
  );
});
