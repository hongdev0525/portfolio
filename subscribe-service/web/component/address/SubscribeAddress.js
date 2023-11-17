import styled from 'styled-components'
import AddressList from './AddressList';
import AddAddress from '../address/AddAddress';
import { deliveryDowState } from '../../state/subscribe'
import { Title, TitleGroup } from '../subscribe/CommonComponent';
import { addressState } from '../../state/address'
import { subscribeState } from '../../state/subscribe';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useEffect, useState } from 'react';
import { Button } from '../common/GlobalComponent';
import { fontWeight } from 'component/common/CommonComponent';
import { device } from "component/common/GlobalComponent";
import { useQuery } from 'react-query';
import { customAxios } from 'public/js/customAxios';

const SubcribeAddressWrapper = styled.div`
  margin-bottom:50px;
  @media ${device.mobileL} {
    margin-bottom: 60px;
  }
`
const SubcribeAddressContainer = styled.div``
const SelectAddress = styled.div``
const AddAddressContainer = styled.div``

const AddAddressButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  @media ${device.mobileL} {
    width: 100%;
    height: 48px;
    border-radius: 5px;
    font-size:14px;
    font-weight: ${fontWeight("medium")};
    line-height: 15px;
  }
`

const AddressListContainer = styled.div`
  display: flex;
  justify-content: space-between  ;
  align-items: center;
  flex-direction: column;
`

const AddressInfoTitle = styled(Title)`
  margin-bottom: 20px;
  @media ${device.mobileL} {
    margin-bottom: 30px;
   
  }
`


function SubscribeAddress({ stateKey }) {
  const addressStateInfo = useRecoilValue(addressState(stateKey));
  const setAddressState = useSetRecoilState(addressState(stateKey));

  const [subscribeExist, setSubscribeExist] = useState(null);

  const getSubscribeList = async () => {
    return await customAxios({
      method: "get",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/list`,
    })
  }
  useQuery('getSubscribeList', getSubscribeList, {
    onSuccess: (res) => {
      console.log("subscribeExist", res.data.data)
      if (res.data.data?.length !== 0) {
        setSubscribeExist(true);
      } else {
        setSubscribeExist(false);
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })


  const getAvailableAddressInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { addressNo: addressStateInfo.addressNo },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/infowithavailable`,
    })
  }

  const { refetch: getAvailableAddressInfoRefetch } = useQuery('getAvailableAddressInfo', () => getAvailableAddressInfo(), {
    enabled: subscribeExist !== null,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data?.data?.length !== 0) {
        if (subscribeExist === false) {
          setAddressState((oldState) => {
            return {
              ...oldState,
              addModal: false,
              addressList: res.data.data,
              addressNo: addressStateInfo.length !== 0 && addressStateInfo.addressNo !== null ? addressStateInfo.addressNo : res.data.data ? res.data.data[0].AddressNo : ""
            }
          })
        } else {
          if (stateKey != "experience") {
            if (stateKey !== "subscribe") {
              setAddressState((oldState) => {
                return {
                  ...oldState,
                  addModal: false,
                  addressList: res.data.data,
                  addressNo: addressStateInfo.length !== 0 && addressStateInfo.addressNo !== null ? addressStateInfo.addressNo : res.data.data ? res.data.data[0].AddressNo : ""
                }
              })
            }
            // else if (subscribeExist === true) {
            //   setAddressState((oldState) => {
            //     return {
            //       ...oldState,
            //       addModal: true,
            //     }
            //   })
            // }
          } else {
            setAddressState((oldState) => {
              return {
                ...oldState,
                addModal: false,
              }
            })
          }
        }
      } else if (res.status === 200 && res.data?.data?.length === 0) {
        setAddressState((oldState) => {
          return {
            ...oldState,
            addModal: false,
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const getExperienceAddressInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { addressNo: addressStateInfo.addressNo },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/info`,
    })
  }

  const { refetch: getExperienceAddressInfoRefetch } = useQuery('getExperienceAddressInfo', () => getExperienceAddressInfo(), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data?.data?.length !== 0) {
        setAddressState((oldState) => {
          return {
            ...oldState,
            addModal: false,
            addressList: res.data.data,
            addressNo: addressStateInfo.length !== 0 && addressStateInfo.addressNo !== null ? addressStateInfo.addressNo : res.data.data ? res.data.data[0].AddressNo : ""
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })




  const handleAddAddressModal = () => {
    setAddressState((oldState) => {
      return {
        ...oldState,
        addModal: !addressStateInfo.addModal
      }
    })
  }


  useEffect(() => {
    // if ((stateKey === "experience")) {
    //   setAddressState((oldState) => {
    //     return {
    //       ...oldState,
    //       addModal: true,
    //     }
    //   })
    // }
  }, [])


  useEffect(() => {
    getExperienceAddressInfoRefetch();
  }, [addressStateInfo.addressNo])


  return (
    <SubcribeAddressWrapper>
      <SubcribeAddressContainer >
        {
          // addressStateInfo.addModal == false && addressStateInfo.addressList?.length !== 0 &&
          addressStateInfo.addModal == false &&
          <>
            <SelectAddress>
              <TitleGroup>
                <AddressInfoTitle>배송정보</AddressInfoTitle>
              </TitleGroup>
              <AddressListContainer>
                <AddressList stateKey={stateKey}></AddressList>
              </AddressListContainer>
            </SelectAddress>
            <AddAddressButton type='button' onClick={handleAddAddressModal}>배송지
              {addressStateInfo.addressList?.length == 0 ? " 추가" : " 변경"}
            </AddAddressButton>
          </>
        }
        {
          addressStateInfo.addModal == true &&
          <AddAddressContainer>
            <AddAddress isCancelable={false} activeSaveBtn={true} stateKey={stateKey} ></AddAddress>
          </AddAddressContainer>
        }
      </SubcribeAddressContainer>
    </SubcribeAddressWrapper >
  );
}

export default SubscribeAddress;