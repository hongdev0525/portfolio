import { atom, atomFamily } from 'recoil'
import { v1 } from 'uuid'

export const cardState = atomFamily({
  key: `cardState/${v1()}`,
  default: (id) => ({
    id,
    cardNumber: "",
    expiry: "",
    birth: "",
    pwd2Digit: "",
  })
})
// export const paymentListState = atom({
//   key: `paymentListState/${v1()}`,
//   default: {
//     list: [],
//     paymentNo: null,
//     paymentModal: false,
//     paymentType: null,
//     addPayment: false,
//   },
// })

export const paymentListState = atomFamily({
  key: `deliveryDowState/${v1()}`,
  default: (id) => (
    {
      id,
      list: [],
      paymentNo: null,
      paymentModal: false,
      paymentType: null,
      addPayment: false,
    })

})
export const paymentHistoryState = atom({
  key: `paymentHistoryState/${v1()}`,
  default: {
    list: [],
  },
})



