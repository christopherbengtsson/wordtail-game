import { Body, BodyBold } from '../../components';
import { FormContainer } from '.';
import { Window, WindowContent, WindowHeader } from 'react95';

export function ConfirmEmail() {
  return (
    <FormContainer>
      <Window>
        <WindowHeader>
          <BodyBold>Inväntar bekräftelse</BodyBold>
        </WindowHeader>
        <WindowContent>
          <Body>Bekräfta din email genom att klicka på länken i mejlet du ska ha fått.</Body>
        </WindowContent>
      </Window>
    </FormContainer>
  );
}
