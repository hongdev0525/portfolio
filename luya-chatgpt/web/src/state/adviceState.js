import { atom, atomFamily } from 'recoil'


export const adviceState = atom({
  key: `adviceState`,
  default: {
    message: null,
    advice: "",
  }
})


