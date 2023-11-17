import styled from "styled-components";
import { fontWeight, device } from "component/common/GlobalComponent";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { mypageAddressState } from "state/mypage";
import Router from "next/router";


const MypageAddressListWrapper = styled.div`
  margin-bottom: 20px;
  @media ${device.mobileL} {
  width: 100%;
  }

`
const MypageAddressListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 596px;
  height: 171px;
  border:1px solid #DC5F00;
  border-radius: 10px;
  padding: 34px 30px;
  @media ${device.mobileL} {
    width: 100%;
    height: auto;
    padding: 30px;
}
`
const AddressInfoContainer = styled.div`
  h2{
    font-size:20px;
    font-weight: ${fontWeight("medium")};
    margin-bottom: 14px;
  }
  p{
    font-size: 16px;
    font-weight: ${fontWeight('regular')};
    margin-bottom: 4px;
    line-height: 20px;
  }
  @media ${device.mobileL} {
    width: 100%;
    h2{
    font-size:16px;
    margin-bottom: 10px;
  }
  p{
    font-size: 14px;
    font-weight: ${fontWeight('regular')};
    margin-bottom: 2px;
  }
  }
`

const AddressButtonGroup = styled.div`
  width: 174px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  @media ${device.mobileL} {
    width: fit-content;
}
`
const AddressButton = styled.button`
  width: 79px;
  height: 39px;
  border: 1px solid #DC5F00;
  border-radius: 5px;
  color:#DC5F00;
  font-size: 16px;
  font-weight: ${fontWeight("semiBold")};
  background-color: #fefefe;
  margin-left: 16px;
  cursor: pointer;
  @media ${device.mobileL} {
  width: 44px;
  height: 25px;
  font-size: 14px;
  font-weight: ${fontWeight("regular")};
}
`
function MypageAddressList({ address, subsNo }) {
  const mypageAddressStateInfo = useRecoilValue(mypageAddressState(address));
  const setMypageAddressState = useSetRecoilState(mypageAddressState(address));

  useEffect(() => {
    console.log('address', address)
  }, [])
  return (
    <MypageAddressListWrapper>
      <MypageAddressListContainer>
        <AddressInfoContainer>
          <h2>{address.AddressLabel}</h2>
          <p>{address.Address}</p>
          <p>{address.ApartmentName}</p>
          <p>{address.ContactNo}</p>
        </AddressInfoContainer>
        <AddressButtonGroup>
          <AddressButton onClick={() => { Router.push(`/mypage/address/modify?subsNo=${subsNo}&addressNo=${address.AddressNo}`) }}>변경</AddressButton>
        </AddressButtonGroup>
      </MypageAddressListContainer>
    </MypageAddressListWrapper>
  );
}

export default MypageAddressList;