import { useTheme } from 'styled-components';
import {
  Body,
  BodyAsTitle,
  BodyAsTitleWrapper,
  BodyBold,
  Button,
  Caption,
  Headline,
  PrimaryTitleWrapper,
  SecondaryTitle,
  SecondaryTitleWrapper,
  SmallBody,
  Subtitle,
  Tiny,
} from '../../components';

export default function DevComponent() {
  const theme = useTheme();

  return (
    <>
      <Button>Regular</Button>
      <br />
      <Button size="lg" colorVariant="info">Info</Button>
      <br />
      <Button colorVariant="success">Success</Button>
      <br />
      <Button colorVariant="warning">Warning</Button>
      <br />
      <Button colorVariant="error">Error</Button>
      <br />
      <Headline>Headline</Headline>
      <br />
      <PrimaryTitleWrapper>PrimaryTitleWrapper</PrimaryTitleWrapper>
      <br />
      <PrimaryTitleWrapper large>Large PrimaryTitleWrapper</PrimaryTitleWrapper>
      <br />
      <SecondaryTitle>SecondaryTitle</SecondaryTitle>
      <br />
      <SecondaryTitleWrapper>SecondaryTitleWrapper</SecondaryTitleWrapper>
      <br />
      <BodyAsTitle>BodyAsTitle</BodyAsTitle>
      <br />
      <BodyAsTitleWrapper>BodyAsTitleWrapper</BodyAsTitleWrapper>
      <br />
      <Subtitle>Subtitle</Subtitle>
      <br />
      <BodyBold>BodyBold</BodyBold>
      <br />
      <Body>Body</Body>
      <br />
      <SmallBody>SmallBody</SmallBody>
      <br />
      <Caption>Caption</Caption>
      <br />
      <Tiny>Tiny</Tiny>
      <br />

      {Object.values(theme)
        .filter((color) => typeof color === 'string')
        .map((color, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <span>{Object.keys(theme)[idx]}:</span>
            <div
              key={color}
              style={{
                background: color,
                height: '50px',
                width: '50px',
              }}
            />
          </div>
        ))}
    </>
  );
}
