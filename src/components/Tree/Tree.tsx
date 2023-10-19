import { Fragment, useState } from 'react';
import { css, styled } from 'styled-components';
import { Body, BodyBold } from '..';
import { GroupBox } from 'react95';

export interface TreeProps {
  items: TreeItem[];
}

export interface TreeItem {
  id: string;
  label: React.ReactNode;
  expandable?: boolean;
  items?: TreeItem[];
}

export function Tree({ items, title }: TreeProps & { title: string }) {
  return (
    <Container>
      <GroupBox label={<BodyBold>{title}:</BodyBold>}>
        <TreeList items={items} />
      </GroupBox>
    </Container>
  );
}

function TreeList({ items }: TreeProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isExpanded = (id: string) => expandedItems.includes(id);

  const handleClick = (id: string) => {
    setExpandedItems((prev) => {
      if (isExpanded(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const onKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(id);
    }
  };

  return (
    <StyledList>
      {items.map((item) => (
        <Fragment key={item.id}>
          <StyledListItem
            tabIndex={0}
            expandable={item.expandable}
            expanded={item.expandable && isExpanded(item.id)}
            onKeyDown={
              item.expandable ? (ev) => onKeyDown(ev, item.id) : undefined
            }
            onClick={item.expandable ? () => handleClick(item.id) : undefined}
          >
            <Body>{item.label}</Body>
          </StyledListItem>
          {item.items && isExpanded(item.id) && <TreeList items={item.items} />}
        </Fragment>
      ))}
    </StyledList>
  );
}

const Container = styled.div`
  width: 100%;
`;

const StyledList = styled.ul`
  width: 100%;
  list-style-type: disc;
  ul {
    list-style-type: circle;
    ul {
      list-style-type: square;
    }
  }
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.m};
  text-align: start;
`;

const StyledListItem = styled.li<{ expandable?: boolean; expanded?: boolean }>`
  display: list-item;
  position: relative;
  padding: 0 ${(p) => p.theme.spacing.xs};

  &::before {
    content: '→'; // default right arrow
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    visibility: ${(p) => (p.expandable ? 'visible' : 'hidden')};
  }

  &:hover::before {
    ${(p) =>
      p.expanded
        ? css`
            padding-top: 2px;
          `
        : css`
            padding-left: 2px;
          `}
  }

  ${(p) =>
    p.expandable &&
    css`
      list-style-type: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      &:focus,
      &:active {
        background: ${(p) => p.theme.hoverBackground};
        color: ${(p) => p.theme.materialTextInvert};
        border: 2px dotted ${(p) => p.theme.focusSecondary};
        outline: none;
      }
      &:focus::before,
      &:active::before {
        color: ${(p) => p.theme.materialText};
      }
    `}

  ${(p) =>
    p.expandable &&
    p.expanded &&
    css`
      list-style-type: none;
      &::before {
        content: '↓'; // down arrow when expanded
      }
    `}
`;
