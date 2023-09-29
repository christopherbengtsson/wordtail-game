import { observer } from 'mobx-react';
import { useMainStore } from '../../stores/MainStoreContext';
import { useEffect } from 'react';

export const Profile = observer(function Profile() {
  const store = useMainStore();

  if (!store.isLoggedIn) {
    throw new Error('No session in SupaStore!');
  }

  useEffect(() => {
    // store.fetchInitial();
  }, []);

  return (
    <>
      <button
        onClick={() => {
          store.supabaseStore.signOut();
        }}
      >
        Sign out
      </button>
      <h2>Hello {store.user?.username ?? 'Anonymous user'}</h2>
      <h4>{store.userId}</h4>
    </>
  );
});
