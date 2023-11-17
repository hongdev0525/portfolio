import { atom } from 'recoil'
import { v1 } from 'uuid'

export const commonState = atom({
    key: `common/${v1()}`,
    default: {
        isLoading: false,
    }
})
export const loggedInState = atom({
    key: `loggedInState/${v1()}`,
    default: {
        loggedInState: null,
    }
})


export const scrollState = atom({
    key: `scrollState/${v1()}`,
    default: {
        scrollValue: false,
    }
})

export const loadingState = atom({
    key: `loadingState/${v1()}`,
    default: {
        active: false,
    }
})





