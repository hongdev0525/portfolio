import { atom, atomFamily } from 'recoil'
import { v1 } from 'uuid'

export const addressState = atomFamily({
  key: `addressState/${v1()}`,

  default: (id) => (
    {
      id,
      addressList: [],
      addressNo: null,
      addModal: false,
      addressAvailable: null,
    })

})


export const addressInputState = atomFamily({
  key: `addressInputState/${v1()}`,
  default: (id) => (
    {
      id,
      address: { value: "", validation: "" },
      addressLabel: { value: "", validation: "" },
      rcvName: { value: "", validation: "" },
      address: { value: "", validation: "" },
      apartmentBuilding: { value: "", validation: "" },
      apartmentUnit: { value: "", validation: "" },
      contactNo: { value: "", validation: "" },
      enterancePassword: { value: "", validation: true },
    })
})




export const newAddressState = atom({
  key: `newAddressState/${v1()}`,
  default: {
    addressLabel: null,
    RcvName: false,
    Address: false,
    ApartmentName: false,
    ApartmentBuilding: false,
    ApartmentUnit: false,
    ContactNo: false,
  }
})



