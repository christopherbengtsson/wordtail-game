interface ListProps<T> {
  items?: T[] | null;
  render: (data: T) => React.ReactNode;
  emptyText?: string;
}

export function List<T>({
  items,
  render,
  emptyText = 'No data',
}: ListProps<T>): React.ReactElement {
  return <ul>{items?.length ? items.map(render) : <li>{emptyText}</li>}</ul>;
}
