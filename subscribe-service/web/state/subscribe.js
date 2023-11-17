import { atom, atomFamily } from 'recoil'
import { v1 } from 'uuid'

export const subscribeState = atom({
    key: `subscribeState/${v1()}`,
    default: {
        product: [],
        period: 4,
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

// code: null,
// name: null,
// type: null,
// discount: 0,
// validation: null,
export const subscribeRouterState = atom({
    key: `subscribeRouterState/${v1()}`,
    default: true,
})

export const productState = atomFamily({
    key: `productState/${v1()}`,
    default: (id) => (
        {
            id,
            list: []
        })

})



export const deliveryDowState = atomFamily({
    key: `deliveryDowState/${v1()}`,
    default: (id) => (
        {
            id,
            list: []
        })

})
export const deliveryDateState = atomFamily({
    key: `deliveryDateState/${v1()}`,
    default: (id) => (
        {
            id,
            list: []
        })

})
export const refundState = atomFamily({
    key: `refundState/${v1()}`,
    default: (id) => (
        {
            id,
            list: {}
        })

})
export const cancelRefundState = atomFamily({
    key: `cancelRefundState/${v1()}`,
    default: (id) => (
        {
            id,
            list: {}
        })

})
