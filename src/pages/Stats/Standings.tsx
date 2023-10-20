import { styled } from 'styled-components';
import { Avatar, Body, BodyBold, List } from '../../components';
import { getUniqueUserAvatar } from '../../utils';
import { BaseGameStats, ExtendedGameStats } from '../../services';
import { GroupBox } from 'react95';

export interface Standing {
  marks: number;
  playerId: string;
  username: string;
}

export function Standings({
  game,
}: {
  game: BaseGameStats | ExtendedGameStats;
}) {
  return (
    <FlexStartContainer>
      <GroupBox label={<BodyBold>Prickar:</BodyBold>}>
        <List
          items={
            game.standings as {
              marks: number;
              playerId: string;
              username: string;
            }[]
          }
          render={(standing: Standing) => (
            <StyledListItem key={standing.playerId}>
              <Avatar lazyLoad src={getUniqueUserAvatar(standing.playerId)} />
              <Body>
                {standing.username}: <BodyBold>{standing.marks}</BodyBold>
              </Body>
            </StyledListItem>
          )}
        />
      </GroupBox>
    </FlexStartContainer>
  );
}

const StyledListItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${(p) => p.theme.spacing.s};
`;

const FlexStartContainer = styled.div`
  gap: ${(p) => p.theme.spacing.s};
`;
