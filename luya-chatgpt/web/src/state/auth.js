import { atom } from 'recoil'

export const authPhoneState = atom({
    key: `authPhone`,
    default: {
        inAuth: false,
        authDone: false,
        authNumber: null,
        phoneNumber:null,
        isExistPhoneNumber: null,
    }
})

