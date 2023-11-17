import { atom } from 'recoil'
import { v1 } from 'uuid'

export const withdrawState = atom({
  key: `withdrawState/${v1()}`,
  default: {
    modalActive: false,
  }
})

