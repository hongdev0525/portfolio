import styled from 'styled-components'
import { customAxios } from '../../public/js/customAxios.js'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import { addressState } from '../../state/address'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { subscribeState } from '../../state/subscribe'
import { fontWeight } from 'component/common/CommonComponent.js'
import { device } from "component/common/GlobalComponent";

const AddressListWrapper = styled.div`
  width:100%;
`

const AddressSelectContainer = styled.div`
  position: relative;


  // 만약 select 박스로 사용시 아래방향버튼
  /* :after{
    content: "";
    position: absolute;
    top:30px;
    right:16px;
    width: 16px;
    height: 8px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    background-image: url("/img/down_arrow.png");
    cursor: pointer;
  } */
  @media ${device.mobileL} {
    :after{
    content: "";
    position: absolute;
    top:3px;
    right:10px;
    width: 31px;
    height: 31px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    background-image: url("/img/main/web/down_arrow.png");
    cursor: pointer;
  }
  }
  

`
const AddressSelect = styled.select`
  width: 100%;
  height: 63px;
  padding: 0 20px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  margin-bottom: 30px;
  font-size: 18px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  appearance: none;
  /* cursor: pointer; */
  outline: none;
  @media ${device.mobileL} {
    width: 100%;
    height: 48px;
    border-radius: 5px;
    font-size:14px;
    font-weight: ${fontWeight("medium")};
    line-height: 25px;
  }
  
`
const SelectOption = styled.option`
  height: 40px;
  width  : 100%;
`

const NoAddress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 171px;
  background-color: #F1F1F5;
  border : 1px solid #A9A9A8;
  border-radius: 10px;
  font-size: 16px;
  line-height: 23px;
  font-weight: ${fontWeight("regular")};
  text-align: center;
  margin-bottom: 30px;
  &>p{
    color:#A9A9A8;
  }
  @media ${device.mobileL} {
    width: 100%;
    height: 131px;
    border-radius: 5px;
    font-size:11px;
    font-weight: ${fontWeight("medium")};
    line-height: 15px;
  }
`


const AddressInfoContainer = styled.div`
  width: 100%;
  background-color: #fefefe;
  border:1px solid #DC5F00;
  border-radius: 10px;
  padding: 34px 30px;
  margin-bottom: 30px;
  @media ${device.mobileL} {
    padding: 20px 10px;
  }
`

const AddressInfo = styled.div`
  & > h2{
    font-size: 20px;
    line-height: 39px;
    font-weight: ${fontWeight("medium")};
    margin-bottom: 14px;
  }
  & p{
    font-size: 16px;
    line-height: 33px;
    font-weight: ${fontWeight("regular")};
    margin-bottom: 4px;
  }

  @media ${device.mobileL} {
    & > h2{
      font-size: 16px;
      line-height: 16px;
      font-weight: ${fontWeight("medium")};
      margin-bottom: 6px;
    }
    & p{
      font-size: 14px;
      line-height: 14px;
      font-weight: ${fontWeight("regular")};
      margin-bottom: 2px;
    }
  }
`

function AddressList({ stateKey }) {
  const addressStateInfo = useRecoilValue(addressState(stateKey));
  const subscribeStateInfo = useRecoilValue(subscribeState);
  const setAddressState = useSetRecoilState(addressState(stateKey))
  const setSubscribeState = useSetRecoilState(subscribeState)



  const getAddressInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { addressNo: addressStateInfo.addressNo },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/info`,
    })
  }

  const { refetch: getAddressInfoRefetch } = useQuery('getAddressList', () => getAddressInfo(), {
    onSuccess: (res) => {
      if (res.status === 200 && res.data?.data?.length !== 0) {
        setAddressState((oldState) => {
          return {
            ...oldState,
            addressList: res.data.data,
            // addressNo: addressStateInfo.length !== 0 && addressStateInfo.addressNo !== null ? addressStateInfo.addressNo : res.data.data ? res.data.data[0].AddressNo : ""
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  // 주소가 리스트로 바뀐다면 아래 코드 사용
  // const getAddressList = async () => {
  //   return await customAxios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/list`,
  //   })
  // }

  // const { refetch: getAddressListRefetch } = useQuery('getAddressList', () => getAddressList(), {
  //   onSuccess: (res) => {
  //     if (res.status === 200 && res.data?.data?.length !== 0) {
  //       setAddressState((oldState) => {
  //         return {
  //           ...oldState,
  //           addressList: res.data.data,
  //           addressNo: addressStateInfo.length !== 0 && addressStateInfo.addressNo !== null ? addressStateInfo.addressNo : res.data.data ? res.data.data[0].AddressNo : ""
  //         }
  //       })
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error Occured : ", error)
  //   }
  // })



  const handleAddressSelect = (e) => {
    setAddressState((oldState) => {
      return {
        ...oldState,
        addressNo: parseInt(e.target.value)
      }
    })
  }

  useEffect(() => {
    if (addressStateInfo.addressNo) {
      setSubscribeState((oldState) => {
        return {
          ...oldState,
          addressNo: addressStateInfo.addressNo
        }
      })
    }
  }, [addressStateInfo])


  return (
    <AddressListWrapper>
      {addressStateInfo.addressList == null || addressStateInfo.addressList.length === 0 &&
        <NoAddress><p>등록된 배송지가 없습니다<br></br> 배송지를 추가해주세요</p></NoAddress>
      }
      {addressStateInfo.addressList && addressStateInfo.addressList.length !== 0 &&
        // 주소 리스트 형태로 바뀔경우 쓰기위해 남김
        // <AddressSelectContainer>
        //   <AddressSelect onChange={handleAddressSelect} value={String(addressStateInfo.addressNo)} disabled>
        //     {
        //       addressStateInfo.addressList.map((address) => {
        //         return (
        //           <SelectOption key={`address${address.AddressNo}`} value={address.AddressNo} >
        //             {/* {address.AddressLabel}- */}
        //             {address.Address}
        //             {address.ApartmentName}/
        //             {address.ApartmentBuilding}동/
        //             {address.ApartmentUnit}호)
        //           </SelectOption>
        //         )
        //       })
        //     }
        //   </AddressSelect >
        // </AddressSelectContainer >
        <AddressInfoContainer>
          {
            addressStateInfo.addressList.map((address) => {
              if (address.AddressNo === addressStateInfo.addressNo) {
                return (
                  <AddressInfo key={`addressList${address.AddressNo}`} >
                    <h2>{address.AddressLabel} | {address.RcvName}</h2>
                    <p>{address.Address}</p>
                    <p>{address.ApartmentName} | {address.ApartmentUnit}호</p>
                    <p>{address.ContactNo}</p>
                  </AddressInfo>
                )
              }
            })
          }
        </AddressInfoContainer>
      }
    </AddressListWrapper>
  );
}

export default AddressList;