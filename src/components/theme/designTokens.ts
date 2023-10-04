export const spacing = {
  tiny: '4px',
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
  xxl: '48px',
  xxxl: '56px',
} as const;

export const fontFamilies = {
  headline: {
    family: 'MS Sans Serif Bold, Courier New, Courier, monospace',
    weight: '700',
    size: '2rem',
    lineHeight: '2.5rem', //40px
  },
  title1: {
    family: 'MS Sans Serif Bold, Courier New, Courier, monospace',
    weight: '700',
    size: '1.75rem',
    lineHeight: '2rem', //32px
  },
  title2: {
    family: 'MS Sans Serif Bold, Courier New, Courier, monospace',
    weight: '700',
    size: '1.5rem',
    lineHeight: '2rem', // 32px
  },
  subtitle: {
    family: 'MS Sans Serif, Courier New, Courier, monospace',
    weight: '400',
    size: '1.25rem',
    lineHeight: '1.5rem', // 24px
  },
  body: {
    family: 'MS Sans Serif, Courier New, Courier, monospace',
    weight: '400',
    size: '1rem',
    lineHeight: '1.5rem', // 24px
  },
  smallBody: {
    family: 'MS Sans Serif, Courier New, Courier, monospace',
    weight: '400',
    size: '0.875rem',
    lineHeight: '1rem',
    lineHeightLarge: '1.125rem', //18px
  },
  caption: {
    family: 'MS Sans Serif, Courier New, Courier, monospace',
    weight: '400',
    size: '0.75rem',
    lineHeight: '1rem',
  },
  tiny: {
    family: 'MS Sans Serif, Courier New, Courier, monospace',
    weight: '400',
    size: '0.625rem',
    lineHeight: '0.75rem', // 12px
  },
} as const;
