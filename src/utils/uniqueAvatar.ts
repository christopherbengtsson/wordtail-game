import { DICE_BEAR_URL } from '../Constants';

export const getUniqueUserAvatar = (userId: string) =>
  `${DICE_BEAR_URL}?seed=${userId}`;
