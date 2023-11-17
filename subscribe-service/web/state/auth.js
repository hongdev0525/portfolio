import { atom } from 'recoil'
import { v1 } from 'uuid'

export const authPhoneState = atom({
    key: `authPhone/${v1()}`,
    default: {
        inAuth: false,
        authDone: false,
        authNumber: null,
        phoneNumber:null,
        isExistPhoneNumber: null,
    }
})

