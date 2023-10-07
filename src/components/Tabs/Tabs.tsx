import { Tabs as ReactTabs, Tab } from 'react95';
import { Badge, Body, BodyBold, Caption } from '..';
export function Tabs({
  activeTab,
  handleTabChange,
  tabs,
}: {
  activeTab: number;
  handleTabChange: (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  tabs: { label: string; badge?: number }[];
}) {
  return (
    <ReactTabs value={activeTab} onChange={handleTabChange}>
      {tabs.map(({ label, badge }, index) => {
        return (
          <Tab key={label} value={index}>
            {!!badge && badge > 0 && (
              <Badge>
                <Caption>{badge}</Caption>
              </Badge>
            )}
            {index === activeTab ? (
              <BodyBold>{label}</BodyBold>
            ) : (
              <Body>{label}</Body>
            )}
          </Tab>
        );
      })}
    </ReactTabs>
  );
}
