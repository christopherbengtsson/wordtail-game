import styled from 'styled-components';
import { IColors } from '../theme/theme';
import { fontFamilies } from '../theme/designTokens';
import { useAutoFocus } from '../../hooks';

export interface TypographyProps {
  color?: keyof IColors;
}

export interface TypographyMappedProps extends TypographyProps {
  fontColor?: string;
}

export interface TitleProps {
  children: React.ReactNode;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

const MainHeadline = styled.h1<TypographyMappedProps>((p) => {
  const headline = fontFamilies.headline;
  return {
    fontFamily: headline.family,
    fontSize: headline.size,
    fontWeight: headline.weight,
    lineHeight: headline.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
    overflowWrap: 'break-word',
    outline: 'none',
  };
});

export function Headline({ children, autoFocus, ...props }: TitleProps) {
  const { ref, tabIndex } = useAutoFocus(autoFocus);

  return (
    <MainHeadline {...props} ref={ref} tabIndex={tabIndex}>
      {children}
    </MainHeadline>
  );
}

/** @description h1 tag. Default size is 24px, but increases to 28px when the 'large' prop is used. */
const PrimaryTitle = styled.h1<TypographyMappedProps & { large?: boolean }>(
  (p) => {
    const title = p.large ? fontFamilies.title1 : fontFamilies.title2;
    return {
      fontFamily: title.family,
      fontSize: title.size,
      fontWeight: title.weight,
      lineHeight: title.lineHeight,
      color: p.color ? p.theme[p.color] : 'inherit',
      overflowWrap: 'break-word',
      outline: 'none',
    };
  },
);

export function PrimaryTitleWrapper({
  children,
  autoFocus,
  ...props
}: TitleProps & { large?: boolean }) {
  const { ref, tabIndex } = useAutoFocus(autoFocus);

  return (
    <PrimaryTitle {...props} ref={ref} tabIndex={tabIndex}>
      {children}
    </PrimaryTitle>
  );
}

/** @description Title1 as h2 tag */
export const SecondaryTitle = styled.h2<TypographyMappedProps>((p) => {
  const title = fontFamilies.title2;

  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
    overflowWrap: 'break-word',
    outline: 'none',
  };
});

export function SecondaryTitleWrapper({
  children,
  autoFocus,
  ...props
}: TitleProps) {
  const { ref, tabIndex } = useAutoFocus(autoFocus);

  return (
    <SecondaryTitle {...props} ref={ref} tabIndex={tabIndex}>
      {children}
    </SecondaryTitle>
  );
}

export const BodyAsTitle = styled.h2<TypographyMappedProps>((p) => {
  const body = fontFamilies.bodyBold;

  return {
    fontFamily: body.family,
    fontSize: body.size,
    fontWeight: body.weight,
    lineHeight: body.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
    overflowWrap: 'break-word',
    hyphens: 'auto',
  };
});

export function BodyAsTitleWrapper({
  children,
  autoFocus,
  ...props
}: TitleProps) {
  const { ref, tabIndex } = useAutoFocus(autoFocus);

  return (
    <BodyAsTitle {...props} ref={ref} tabIndex={tabIndex}>
      {children}
    </BodyAsTitle>
  );
}

export const Subtitle = styled.h2<TypographyMappedProps>((p) => {
  const title = fontFamilies.subtitle;

  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
    overflowWrap: 'break-word',
    hyphens: 'auto',
  };
});

export const BodyBold = styled.span<TypographyMappedProps>((p) => {
  const title = fontFamilies.bodyBold;
  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
  };
});

export const Body = styled.span<TypographyMappedProps>((p) => {
  const title = fontFamilies.body;
  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
  };
});

export const SmallBody = styled.span<TypographyMappedProps>((p) => {
  const title = fontFamilies.smallBody;
  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
  };
});

export const Caption = styled.span<TypographyMappedProps>((p) => {
  const title = fontFamilies.caption;
  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
  };
});

export const Tiny = styled.span<TypographyMappedProps>((p) => {
  const title = fontFamilies.tiny;
  return {
    fontFamily: title.family,
    fontSize: title.size,
    fontWeight: title.weight,
    lineHeight: title.lineHeight,
    color: p.color ? p.theme[p.color] : 'inherit',
  };
});
