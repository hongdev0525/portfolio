import { atom, atomFamily } from 'recoil'
import { v1 } from 'uuid'

export const experienceState = atom({
  key: `experienceState/${v1()}`,
  default: {
    subscribeType: "experience",
    product: [],
    period: 1,
    deliveryDate: null,
    dows: [],
    addressNo: null,
    paymentNo: null,
    totalPrice: null,
    milesAmount: 0,
    coupon: {

    }
  }

})