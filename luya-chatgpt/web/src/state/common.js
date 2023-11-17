import { atom, atomFamily } from 'recoil'

export const loadingState = atom({
  key: `loadingState`,
  default: {
    active: false,
  }
});
export const menuState = atom({
  key: `menuState`,
  default: {
    active: false,
    prevIndex: 0,
    activeIndex: 0,
  }
});



export const commonAlertState = atom({
  key: `commonAlertState`,
  default:
  {
    active: false,
    text: "",
    callback: null,
  }
});
export const commonConfirmState = atom({
  key: `commonConfirmState`,
  default:
  {
    active: false,
    text: "",
    callback: null,
  }
});


