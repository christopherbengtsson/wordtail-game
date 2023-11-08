import ReactSelect, { GroupBase, Props, StylesConfig } from 'react-select';

import { useSelectStyles } from './useSelectStyles';

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  const styles: StylesConfig<Option, IsMulti, Group> = useSelectStyles();

  return (
    <ReactSelect
      {...props}
      unstyled
      menuPlacement="auto"
      className="react-select-container"
      classNamePrefix="react-select"
      closeMenuOnSelect={!props.isMulti}
      onInputChange={props.onInputChange}
      styles={styles}
      inputId="select-player-input"
    />
  );
}
