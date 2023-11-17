import { atom } from 'recoil'
import { v1 } from 'uuid'

export const timerState = atom({
    key : `timerState/${v1()}`,
    default: false
  })
  
