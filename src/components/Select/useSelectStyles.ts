import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';
import { useTheme } from 'styled-components';
import { commonBoxShadow, insetShadow } from '../shared/common';
import { useMemo } from 'react';

export function useSelectStyles<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(): StylesConfig<Option, IsMulti, Group> {
  const theme = useTheme();

  const styles = useMemo(() => {
    const indicatorBtns: CSSObjectWithLabel = {
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
        borderTopColor: theme.borderLight,
        borderRightColor: theme.borderDarkest,
        borderBottomColor: theme.borderDarkest,
        borderLeftColor: theme.borderLight,
        boxShadow: `${theme.borderLightest} 1px 1px 0px 1px inset, ${theme.borderDark} -1px -1px 0px 1px inset`,
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
          borderTopColor: theme.borderDarkest,
          borderRightColor: theme.borderLight,
          borderBottomColor: theme.borderLight,
          borderLeftColor: theme.borderDarkest,
          boxShadow: `${theme.borderDark} 1px 1px 0px 1px inset, ${theme.borderLightest} -1px -1px 0px 1px inset`,
        },
        ':after': {
          outline: `${theme.borderDarkest} dotted 2px`,
          outlineOffset: '-8px',
        },
      },
    };

    const selectStyles: StylesConfig<Option, IsMulti, Group> = {
      placeholder: (base) => ({
        ...base,
        color: theme.materialTextPlaceholder,
      }),
      dropdownIndicator: (base) => ({
        ...base,
        ...indicatorBtns,
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
        ...indicatorBtns,
      }),
      control: (base, state) => {
        const styles: CSSObjectWithLabel = {
          ...base,
          minHeight: theme.sizes.buttonHeight,
          display: 'flex',
          color: theme.materialText,
          fontSize: '1rem',
          cursor: 'pointer',
          background: theme.canvas,
          position: 'relative',
          boxSizing: 'border-box',
          padding: '2px',
          borderStyle: 'solid',
          borderWidth: '2px',
          borderTopColor: theme.borderDark,
          borderRightColor: theme.borderLightest,
          borderBottomColor: theme.borderLightest,
          borderLeftColor: theme.borderDark,
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
            borderTopColor: theme.borderDarkest,
            borderRightColor: theme.borderLight,
            borderBottomColor: theme.borderLight,
            borderLeftColor: theme.borderDarkest,
            pointerEvents: 'none',
            boxShadow: insetShadow,
          },
        };

        if (state.isFocused && !state.menuIsOpen) {
          return {
            ...styles,
            '& .react-select__value-container': {
              background: theme.hoverBackground,
              color: theme.materialText,
              border: `2px dotted ${theme.focusSecondary}`,
            },
            '& .react-select__placeholder': {
              color: theme.materialText,
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
        background: theme.canvas,
        border: `2px solid ${theme.borderDarkest}`,
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
    };

    return selectStyles;
  }, [theme]);

  return styles;
}
