import { atom, atomFamily } from 'recoil'
import { v1 } from 'uuid'



export const mypageUserState = atom({
  key: `mypageUserState/${v1()}`,
  default: {}
});


export const pauseModalState = atom({
  key: `pauseModalState/${v1()}`,
  default: {
    modalActive: false,
    pause: true,
    pauseDeliveryDate: null,
  },
});



export const subscribeCalendarState = atomFamily({
  key: `mypageSubscribeCalendar/${v1()}`,
  default:
    (id) => ({
      id,
      selectedDate: new Date(),
      orderInfo: [],
      menuList: [],
    })
});

export const mypageUserPasswordState = atom({
  key: `mypageUserPasswordState/${v1()}`,
  default: {
    isModifying: false,
    currentPassword: null,
    userPassword: null,
    duplicated: false,
    validation: null,
  }
})


export const mypageSubscribeInfoState = atom({
  key: `mypageSubscribeInfoState/${v1()}`,
  default: []
})
export const mypageSubscribeListState = atom({
  key: `mypageSubscribeListState/${v1()}`,
  default: []
})



export const amountChangeState = atomFamily({
  key: `amountChangeState/${v1()}`,
  default: id => ({
    id,
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
  })
})

export const amountChangeProductState = atom({
  key: `amountChangeProductState/${v1()}`,
  default: []
})

export const mypageAddressState = atomFamily({
  key: `mypageAddressState/${v1()}`,
  default:
    (id) => ({
      id,
      modify: false,
    })
});