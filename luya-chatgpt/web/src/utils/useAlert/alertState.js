import { atom, atomFamily } from 'recoil'
import uuid from 'react-uuid';


export const alertState = atom({
  key: `alertState${uuid()}`,
  default:
  {
    active: false,
    text: "",
    callback: null,
  }
});
