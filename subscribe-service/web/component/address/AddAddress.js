import styled, { css } from 'styled-components'
import DaumPostcode from "react-daum-postcode";
import { customAxios } from '../../public/js/customAxios.js'
import { Input, InputLabel, InputGroup, Button } from '../common/GlobalComponent';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useQuery } from 'react-query'
import { addressInputState, addressState } from '../../state/address';
import { subscribeState } from '../../state/subscribe';
import { fontWeight } from 'component/common/CommonComponent.js';
import { Title } from 'component/subscribe/CommonComponent.js';
import { device } from "component/common/GlobalComponent";
import { MdClose } from "react-icons/md";

const AddAddressContainer = styled.div`
  /* position: relative; */
  width:100%;
  margin-bottom:48px;
  @media ${device.mobileL} {
    margin-bottom: 30px;
  }
`

const InputFlexGroup = styled.div`
  display: flex;
  justify-content: space-between;
  &>div{
    width: 48%;
  }
`
const AddressInputGroup = styled(InputGroup)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
  margin: 0;

  @media ${device.mobileL} {
    &>input{
      width: 100%;
    }
  }

`
const AddressDetails = styled(InputGroup)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
  @media ${device.mobileL} {
    margin: 0;
  }
`

const AddressInputLabel = styled(InputLabel)`
  display:flex;
  align-items: center;
  font-size: 16px;
  line-height: 18px;
  font-weight: ${fontWeight("semiBold")};
  margin-bottom: 6px;
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 13px;
    font-weight: ${fontWeight("medium")};
    padding-left:5px;
    margin-bottom: 6px;
  }

`

const Notice = styled.p`
  color:${props => { return props.color }};
  margin-top: 4px;
  margin-bottom: 10px;
  padding-left: 10px;
  @media ${device.mobileL} {
    font-size: 11px;
    line-height: 21px;
    font-weight: ${fontWeight("regular")};
    margin-top: 5px;
    padding-left: 5px;
  }
`
const Required = styled.p`
  font-size: 24px;
  line-height: 36px;
  padding-left:5px;
  color:tomato;
`

const AddAddressButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
  border-radius: 10px;
  font-weight: ${fontWeight("bold")};
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 13px;
    font-weight: ${fontWeight("medium")};
    padding-left:5px;
    margin-bottom: 6px;
  }

`

const DaumPost = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 100;
`

const DaumPostCode = styled(DaumPostcode)`
  position: fixed;
  top:30%;
  left:50%;
  transform: translate(-50%,0%);
  width: 758px !important;
  z-index: 3;
  @media ${device.mobileL} {
    width: 100% !important;
    padding:  0 24px;
  }
`
const DaumPostCodeCloseButton = styled.div`
   position: fixed;
  top:80%;
  left:50%;
  width: fit-content;
  background-color: rgba(0,0,0,0.1);
  border-radius: 50%;
  padding:10px;
  z-index: 10;
  cursor: pointer;
`

const DaumPostBackground = styled.div`
  position: absolute;
  top:0%;
  left:00%;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  z-index: 1;
`

const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  @media ${device.mobileL} {
   &>div{
    margin-bottom: 0;
   }
  }
`

const CanclButton = styled.div`
  font-size: 14px;
  line-height: 39px;
  font-weight: ${fontWeight("regular")};
  text-decoration: underline;
  cursor: pointer;
  @media ${device.mobileL} {
    font-size: 11px;
    line-height: 18px;
    font-weight: ${fontWeight("regular")};
  }
  
`

const SearchButton = styled(Button)`
  width: 136px;
  height: 56px;
  box-shadow: 5px 5px 10px rgba(0,0,0,.1);
  font-size: 16px;
  line-height: 27px;
  font-weight: ${fontWeight("bold")};
  cursor: pointer;
  border-radius: 10px;
  @media ${device.mobileL} {
    width: 95px;
    height: 48px;
    border-radius: 5px;
    font-size:14px;
    font-weight: ${fontWeight("medium")};
    line-height: 15px;
  }

`

const ReadOnlyInput = styled(Input)`
  width: 448px;
  background-color: #F1F1F5;
  border: 1px solid #DBDBDB;
  @media ${device.mobileL} {
    width: 221px !important;
  }
`

const ApartmentInput = styled(Input)`
  width: 396px;
  @media ${device.mobileL} {
    width: 199px;
  }
`
const UnitInput = styled(Input)`
  width: 188px;
  @media ${device.mobileL} {
    width: 120px;
  }
`

const PasswordButtonGroup = styled.div`
  display: flex;
  width: 100%;
  @media ${device.mobileL} {  
    margin-top: 0px;
  }
`
const ExistButton = styled.button`
    width: 50%;
    height: 56px;
    font-size: 16px;
    line-height: 27px;
    font-weight: ${fontWeight("regular")};
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border:none;
    cursor: pointer;

    ${props => props.active == true ?
    css`
        color:#fefefe;
        background-color: #DC5F00;
      font-weight: ${fontWeight("bold")};
     `
    :
    css`
        color:#a9a9a8;
        background-color: #fefefe;
        border: 1px solid #DBDBDB;
     `
  }

  @media ${device.mobileL} {  
    font-size: 14px;
    line-height: 10px;
    font-weight: ${fontWeight("medium")};
    width: 50%;
    height: 48px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
`
const NoExistButton = styled(ExistButton)`
    font-size: 14px;
    line-height: 10px;
    font-weight: ${fontWeight("medium")};
    border-radius: 0;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  @media ${device.mobileL} {  
    width: 50%;
    height: 48px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`
const CloseIcon = styled(MdClose)`
  width: 30px;
  height: 30px;
  z-index: 500;

`
/**
 * 배송지명, 수령인, 연락처, 주소, 상세주소(동이나 주택이름), 호수
 * 
 */

function AddAddress({ title = true, isCancelable, activeSaveBtn, stateKey }) {

  const [addressInput, setAddressInput] = useState({
    address: { value: "", validation: "" },
    addressLabel: { value: "", validation: "" },
    rcvName: { value: "", validation: "" },
    address: { value: "", validation: "" },
    apartmentBuilding: { value: "", validation: "" },
    apartmentUnit: { value: "", validation: "" },
    contactNo: { value: "", validation: "" },
    enterancePassword: { value: "", validation: true },
  });
  const [addressModal, setAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const selectedAddress = useRecoilValue(addressState(stateKey));
  const setAddressState = useSetRecoilState(addressState(stateKey));
  const addressInputStateInfo = useRecoilValue(addressInputState(stateKey));
  const setAddressInputState = useSetRecoilState(addressInputState(stateKey));
  const setSubscribeState = useSetRecoilState(subscribeState)
  const [enterancePwdEixst, setEnterancePwdEixst] = useState(true);
  const { refetch: addressAvailableCheckRefetch } = useQuery('addressAvailableCheck', () => addressAvailableCheck(address), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data.status === "exist") {
        console.log("배송가능지역", res.data)
        setAddressState((oldState) => {
          return {
            ...oldState,
            addressAvailable: true,
          }
        })
      } else if (res.status === 200 && res.data.status === "unavailable") {
        console.log("배송불가지역", res.data)
        setAddressState((oldState) => {
          return {
            ...oldState,
            addressAvailable: false,
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })
  const { refetch: addAddressRefetch } = useQuery('addAddress', () => addAddress(addressInputStateInfo), {
    enabled: false,
    onSuccess: (res) => {
      console.log("address add", res);
      if (res.status === 200) {
        setAddressState((oldState) => {
          return {
            ...oldState,
            addModal: !selectedAddress.addModal,
            addressNo: res.data.data
          }
        })
        // setSubscribeState(oldState => {
        //   return {
        //     ...oldState,
        //     addressNo: res.data.data
        //   }
        // })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const addressAvailableCheck = async (address) => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { roadAddress: address },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/available`,
    })
  }
  const addAddress = async (addressInputStateInfo) => {
    const inputDataList = {};
    Object.keys(addressInputStateInfo).forEach((key) => {
      inputDataList[key] = addressInputStateInfo[key].value;
    })
    return await customAxios({
      method: "post",
      withCredentials: true,
      data: { addressInfo: inputDataList },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/add`,
    })
  }

  const onCompletePostcodeMadal = (data) => {
    if (data.roadAddress) {
      setAddress(data.roadAddress);
      setAddressInputState((oldState) => {
        return {
          ...oldState,
          address: { value: data.roadAddress, validation: true }
        }
      })
    }
    setAddressModal(false);
  };

  const handleClosePostModal = () => {
    setAddressModal(false);
  }

  const handleOnchangeInput = (e) => {
    setAddressInputState((oldState) => {
      return {
        ...oldState,
        [e.currentTarget.id]: { value: e.currentTarget.value, validation: e.currentTarget.value.length === 0 ? false : true }

      }
    })
  }


  const handleAddAddress = () => {
    if (selectedAddress.addressAvailable === false) {
      alert("배송불가 지역입니다.")
      return false;
    }
    for (let key in addressInputStateInfo) {
      if (addressInputStateInfo[key].validation === '' || addressInputStateInfo[key].validation === false) {
        alert("배송지 정보를 정확히 입력해주세요.")
        return false
      }
    }
    addAddressRefetch()
    return false;
  }

  useEffect(() => {
    if (address) {
      addressAvailableCheckRefetch();
    }
  }, [address])



  return (
    <AddAddressContainer>
      <TitleGroup>
        {title === true &&
          <Title>배송지 추가</Title>
        }
        {isCancelable === true &&
          <CanclButton type='button' onClick={() => {
            setAddressState((oldState) => {
              return {
                ...oldState,
                addModal: !selectedAddress.addModal
              }
            })
          }}>	&lt; 등록 취소하기</CanclButton>
        }
      </TitleGroup>
      <InputGroup>
        <AddressInputLabel htmlFor='addressLabel'>배송지 이름<Required>*</Required></AddressInputLabel>
        <Input name="addressLabel" id="addressLabel" type="text" placeholder="배송지 이름을 입력해주세요" onChange={handleOnchangeInput}></Input>
      </InputGroup>
      <InputGroup>
        <AddressInputLabel htmlFor='rcvName'>수령인<Required>*</Required></AddressInputLabel>
        <Input name="rcvName" id="rcvName" type="text" placeholder="받으실분 성함을 입력해주세요" onChange={handleOnchangeInput}></Input>
      </InputGroup>
      <InputGroup>
        <AddressInputLabel htmlFor='contactNo'>연락처<Required>*</Required></AddressInputLabel>
        <Input name="contactNo" id="contactNo" type="text" placeholder="받으실분 연락처를 입력해주세요" onChange={handleOnchangeInput}></Input>
      </InputGroup>
      <InputGroup>
        <AddressInputLabel htmlFor='Address'>주소<Required>*</Required></AddressInputLabel>
        <AddressInputGroup>
          <ReadOnlyInput name="Address" id="Address" type="text" placeholder="주소를 검색해 주세요" readOnly value={address}></ReadOnlyInput>
          <SearchButton type="button" onClick={() => setAddressModal(true)}>검색</SearchButton>
        </AddressInputGroup>
        {selectedAddress.addressAvailable === false && stateKey!= "simpleSignup" &&  <Notice color={"#DC5F00"}>*새벽 배송 불가능 지역입니다.</Notice>}
        {selectedAddress.addressAvailable === true && stateKey!= "simpleSignup" && <Notice color={"#A9A9A8"}>새벽 배송 가능 지역입니다.</Notice>}
      </InputGroup>
      {selectedAddress.addressAvailable === true &&
        <>
          <InputGroup>
            <AddressInputLabel htmlFor='apartmentBuilding'>상세주소<Required>*</Required></AddressInputLabel>
            <AddressDetails>
              <ApartmentInput name="apartmentBuilding" id="apartmentBuilding" type="text" placeholder="상세주소(아파트동/건물명)를 입력해주세요." onChange={handleOnchangeInput}></ApartmentInput>
              <UnitInput name="apartmentUnit" id="apartmentUnit" type="text" placeholder="호수를 입력해주세요." onChange={handleOnchangeInput}></UnitInput>
            </AddressDetails>
          </InputGroup>
          <AddressInputLabel htmlFor='enterancePassword'>공동현관비밀번호</AddressInputLabel>
          <PasswordButtonGroup>
            <ExistButton active={enterancePwdEixst == true ? true : false} onClick={() => setEnterancePwdEixst(true)}>있어요</ExistButton>
            <NoExistButton active={enterancePwdEixst == true ? false : true} onClick={() => setEnterancePwdEixst(false)}>없어요</NoExistButton>
          </PasswordButtonGroup>
          {
            enterancePwdEixst == true &&
            <InputGroup>
              <Input name="enterancePassword" id="enterancePassword" type="text" placeholder="공동현관비밀번호 입력해주세요" onChange={handleOnchangeInput}></Input>
              <Notice color={"#DC5F00"}>* 공동현관비밀번호 오류시 정확한 배송이 어려우니 정확하게 입력해주세요.</Notice>
            </InputGroup>
          }
          {activeSaveBtn == true &&
            <AddAddressButton AddAddressButton type='button' onClick={handleAddAddress}>배송지 저장하기</AddAddressButton>
          }
        </>
      }

      {
        addressModal === true && (
          <DaumPost>
            <DaumPostCode onComplete={onCompletePostcodeMadal}></DaumPostCode>
            <DaumPostCodeCloseButton onClick={handleClosePostModal}><CloseIcon></CloseIcon></DaumPostCodeCloseButton>
            <DaumPostBackground onClick={handleClosePostModal}></DaumPostBackground>
          </DaumPost>
        )
      }
    </AddAddressContainer >
  );
}

export default AddAddress;
