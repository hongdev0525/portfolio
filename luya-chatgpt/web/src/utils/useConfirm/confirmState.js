import { atom, atomFamily } from 'recoil'


export const confirmState = atom({
  key: `confirmState`,
  default:
  {
    active: false,
    text: "",
    callback: null,
  }
});
