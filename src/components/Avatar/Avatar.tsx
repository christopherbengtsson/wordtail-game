import { styled } from 'styled-components';

export function Avatar({ src, lazyLoad }: { src: string; lazyLoad?: boolean }) {
  return (
    <Wrapper>
      <StyledImg
        loading={lazyLoad ? 'lazy' : undefined}
        width={50}
        height={50}
        src={src}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: inline-block;
  box-sizing: border-box;
  object-fit: contain;
  width: 50px;
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
