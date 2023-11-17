import { atom,atomFamily } from 'recoil'
import { v1 } from 'uuid'


export const milesState = atomFamily({
  key: `productState/${v1()}`,
  default: (id) => (
    {
      id,
      coupon: {
        code: null,
        name: null,
        type: null,
        discount: null,
        validation: null,
      },
      milesAmount: null
    })

})
