import AddAddress from "component/address/AddAddress";
import { device, fontWeight } from "component/common/GlobalComponent";
import styled from "styled-components";
import MypageTitle from "../MypageTitle";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { addressState } from "state/address";
import { useEffect } from "react";


const MypageAddAddressWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }
  `
const MypageAddAddressContainer = styled.div`
 width: 596px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`
const MypageTitleContainer = styled.div`
  width: 800px;
 margin-bottom: 40px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`

function MypageAddAddress() {
  const selectedAddress = useRecoilValue(addressState("mypageAddress"));
  const setAddressState = useSetRecoilState(addressState("mypageAddress"));

  useEffect(() => {
    console.log('selectedAddress', selectedAddress)
    if (selectedAddress.addressNo != null) {
      setAddressState((oldState) => {
        return {
          ...oldState,
          addressList: [],
          addressNo: null,
          addModal: false,
          addressAvailable: null
        }
      })
      Router.push("/mypage/address");
    }
  }, [selectedAddress])

  return (
    <MypageAddAddressWrapper>
      <MypageTitleContainer>
        <MypageTitle url={"/mypage"} title={"주소추가"} ></MypageTitle>
      </MypageTitleContainer>
      <MypageAddAddressContainer>
        <AddAddress activeSaveBtn={true} stateKey={"mypageAddress"}></AddAddress>
      </MypageAddAddressContainer>
    </MypageAddAddressWrapper>
  );
}

export default MypageAddAddress;