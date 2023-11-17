import { atom, atomFamily } from 'recoil'


export const prayStateFamily = atomFamily({
  key: `prayState`,
  default: (id) => ({
    userNo: id,
    prayList: null
  })
})


export const prayInfoStateFamily = atomFamily({
  key: `prayInfoState`,
  default: (id) => ({
    id: id,
    prayInfo: null
  })
})


