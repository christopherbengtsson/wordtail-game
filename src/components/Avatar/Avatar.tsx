import { styled } from 'styled-components';
import { useTranslation } from '..';

export interface AvatarProps {
  src: string;
  lazyLoad?: boolean;
  width?: number;
  height?: number;
}

export function Avatar({
  src,
  lazyLoad,
  width = 50,
  height = 50,
}: AvatarProps) {
  const t = useTranslation();

  return (
    <Wrapper width={width}>
      <StyledImg
        loading={lazyLoad ? 'lazy' : undefined}
        width={width}
        height={height}
        alt={t('auth.avatar.alt')}
        src={src}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ width: number }>`
  display: inline-block;
  box-sizing: border-box;
  object-fit: contain;
  width: ${(p) => p.width}px;
  border-radius: 50%;
  overflow: hidden;
  border-width: 2px;
  border-style: solid;
  border-top-color: ${(p) => p.theme.borderDark};
  border-right-color: ${(p) => p.theme.borderLightest};
  border-bottom-color: ${(p) => p.theme.borderLightest};
  border-left-color: ${(p) => p.theme.borderDark};
  background: ${(p) => p.theme.material};
`;
const StyledImg = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
  height: 100%;
`;
