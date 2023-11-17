import { atom } from 'recoil'
import { v1 } from 'uuid'


export const termsModalState = atom({
  key: `termsModalState/${v1()}`,
  default: {
    type: null,
    scrollY: null,
  }
})


export const termsState = atom({
  key: `termsState/${v1()}`,
  default: {
    totalAgreement: false,
    termsAndConditions: false,
    privacyPolicy: false,
    marketing: false,
  }
})




