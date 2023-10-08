import { observer } from 'mobx-react';
import { useMainStore } from '../../stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Body,
  BodyBold,
  Button,
  List,
  PrimaryTitleWrapper,
} from '../../components';
import { getUniqueUserAvatar } from '../../utils';
import { styled } from 'styled-components';

export const Profile = observer(function Profile() {
  const { authStore, dbService } = useMainStore();

  const queryClient = useQueryClient();

  const { data: profileResponse } = useQuery({
    queryKey: ['profile', authStore.userId],
    queryFn: () => dbService.getProfileById(authStore.userId),
  });

  const { data: friendsResponse } = useQuery({
    queryKey: ['friends', authStore.userId],
    queryFn: () => dbService.getFriends(),
  });

  const signOutMutation = useMutation({
    mutationFn: () => authStore.signOut(),
    onSuccess: () => queryClient.removeQueries(),
  });

  return (
    <>
      <FlexContainer>
        <Avatar
          lazyLoad
          width={80}
          height={80}
          src={getUniqueUserAvatar(authStore.userId)}
        />
        <PrimaryTitleWrapper>
          {profileResponse?.data?.username}
        </PrimaryTitleWrapper>
      </FlexContainer>

      <Body>
        <BodyBold>ID: </BodyBold>
        {authStore.user?.id}
      </Body>
      <Body>
        <BodyBold>Email: </BodyBold>
        {authStore.user?.email}
      </Body>

      <BodyBold>Friends:</BodyBold>
      <List
        items={friendsResponse?.data}
        emptyText="No friends added yet"
        render={({ friendId, username }) => (
          <li key={username}>
            <FlexContainer>
              <Avatar src={getUniqueUserAvatar(friendId)} />
              <Body>{username}</Body>
            </FlexContainer>
          </li>
        )}
      />

      <Button
        onClick={() => {
          signOutMutation.mutate();
        }}
      >
        Sign out
      </Button>
    </>
  );
});

const FlexContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${(p) => p.theme.spacing.s};
`;
