import ReactSelect, {
  CSSObjectWithLabel,
  GroupBase,
  Props,
} from 'react-select';
import { useTheme } from 'styled-components';
import {
  commonBoxShadow,
  createBorderStyles,
  insetShadow,
} from '../shared/common';

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  const theme = useTheme();

  return (
    <ReactSelect
      {...props}
      unstyled
      menuPlacement="auto"
      className="react-select-container"
      classNamePrefix="react-select"
      closeMenuOnSelect={!props.isMulti}
      styles={{
        placeholder: (base) => ({
          ...base,
          color: theme.materialTextPlaceholder,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          boxSizing: 'border-box',
          background: theme.material,
          color: theme.materialText,
          border: 'none',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: 'auto',
          padding: '0px 10px',
          fontSize: '1rem',
          userSelect: 'none',
          fontFamily: 'inherit',
          ':before': {
            boxSizing: 'border-box',
            content: '""',
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor:
              'rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10) rgb(223, 223, 223)',
            boxShadow:
              'rgb(254, 254, 254) 1px 1px 0px 1px inset, rgb(132, 133, 132) -1px -1px 0px 1px inset',
          },
          ':after': {
            content: '""',
            position: 'absolute',
            display: 'block',
            top: '0px',
            left: '0px',
            height: '100%',
            width: '100%',
          },
          ':active': {
            ':before': {
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor:
                'rgb(10, 10, 10) rgb(223, 223, 223) rgb(223, 223, 223) rgb(10, 10, 10)',
              boxShadow:
                'rgb(132, 133, 132) 1px 1px 0px 1px inset, rgb(254, 254, 254) -1px -1px 0px 1px inset',
            },
            ':after': {
              outline: 'rgb(10, 10, 10) dotted 2px',
              outlineOffset: '-8px',
            },
          },
        }),
        multiValueRemove: (base) => ({
          ...base,
          paddingLeft: '2px',
          paddingRight: '2px',
          ':hover': {
            background: theme.focusSecondary,
            color: theme.materialText,
          },
        }),
        clearIndicator: (base) => ({
          ...base,
          boxSizing: 'border-box',
          background: 'rgb(198, 198, 198)',
          color: 'rgb(10, 10, 10)',
          border: 'none',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: 'auto',
          padding: '0px 10px',
          fontSize: '1rem',
          userSelect: 'none',
          fontFamily: 'inherit',
          ':before': {
            boxSizing: 'border-box',
            content: '""',
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor:
              'rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10) rgb(223, 223, 223)',
            boxShadow:
              'rgb(254, 254, 254) 1px 1px 0px 1px inset, rgb(132, 133, 132) -1px -1px 0px 1px inset',
          },
          ':after': {
            content: '""',
            position: 'absolute',
            display: 'block',
            top: '0px',
            left: '0px',
            height: '100%',
            width: '100%',
          },
          ':active': {
            ':before': {
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor:
                'rgb(10, 10, 10) rgb(223, 223, 223) rgb(223, 223, 223) rgb(10, 10, 10)',
              boxShadow:
                'rgb(132, 133, 132) 1px 1px 0px 1px inset, rgb(254, 254, 254) -1px -1px 0px 1px inset',
            },
            ':after': {
              outline: 'rgb(10, 10, 10) dotted 2px',
              outlineOffset: '-8px',
            },
          },
        }),
        control: (base, state) => {
          const styles: CSSObjectWithLabel = {
            ...base,
            minHeight: theme.sizes.buttonHeight,
            display: 'flex',
            color: 'rgb(10, 10, 10)',
            fontSize: '1rem',
            cursor: 'pointer',
            background: 'rgb(255, 255, 255)',
            position: 'relative',
            boxSizing: 'border-box',
            padding: '2px',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor:
              'rgb(132, 133, 132) rgb(254, 254, 254) rgb(254, 254, 254) rgb(132, 133, 132)',
            lineHeight: 1.5,
            ':before': {
              position: 'absolute',
              left: '0px',
              top: '0px',
              content: '""',
              width: 'calc(100% - 4px)',
              height: 'calc(100% - 4px)',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor:
                'rgb(10, 10, 10) rgb(223, 223, 223) rgb(223, 223, 223) rgb(10, 10, 10)',
              pointerEvents: 'none',
              boxShadow: insetShadow,
            },
          };

          if (state.isFocused && !state.menuIsOpen) {
            return {
              ...styles,
              '& .react-select__value-container': {
                background: ' rgb(6, 0, 132)',
                color: ' rgb(254, 254, 254)',
                border: ' 2px dotted rgb(254, 254, 3)',
              },
            };
          }

          return styles;
        },
        valueContainer: (base) => ({
          ...base,
          paddingLeft: '8px',
          height: 'calc(100% - 4px)',
          width: 'calc(100% - 4px)',
        }),
        menuList: (base) => ({
          ...base,
          background: 'white',
          border: '2px solid rgb(10, 10, 10)',
          boxShadow: commonBoxShadow,
          padding: '2px',
        }),
        option: (base, state) => {
          const styles: CSSObjectWithLabel = {
            ...base,
            height: theme.sizes.buttonHeight,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '8px',
            ':hover': {
              background: theme.hoverBackground,
              color: theme.materialTextInvert,
              cursor: 'pointer',
            },
          };

          if (state.isFocused) {
            return {
              ...styles,
              background: theme.hoverBackground,
              color: theme.materialTextInvert,
            };
          }

          return styles;
        },
      }}
    />
  );
}
