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
  height: 50px;
  width: 50px;
  border-radius: 50%;
  overflow: hidden;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(132, 133, 132) rgb(254, 254, 254) rgb(254, 254, 254)
    rgb(132, 133, 132);
  background: rgb(198, 198, 198);
`;
const StyledImg = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
  height: 100%;
`;
