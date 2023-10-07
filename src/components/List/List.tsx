interface ListProps<T> {
  items?: T[];
  render: (data: T) => React.ReactNode;
  emptyText?: string;
}

export function List<T>({
  items,
  render,
  emptyText = 'No data',
}: ListProps<T>): React.ReactElement {
  return <div>{items?.length ? items.map(render) : emptyText}</div>;
}
