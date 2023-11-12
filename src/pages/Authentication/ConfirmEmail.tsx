import {
  Body,
  BodyBold,
  TranslationMap,
  useTranslation,
} from '../../components';
import { FormContainer } from '.';
import { Window, WindowContent, WindowHeader } from 'react95';

const STRINGS = {
  header: 'confirm.email.header',
  body: 'confirm.email.body',
} satisfies TranslationMap;

export function ConfirmEmail() {
  const t = useTranslation();

  return (
    <FormContainer>
      <Window>
        <WindowHeader>
          <BodyBold>{t(STRINGS.header)}</BodyBold>
        </WindowHeader>
        <WindowContent>
          <Body>{t(STRINGS.body)}</Body>
        </WindowContent>
      </Window>
    </FormContainer>
  );
}
