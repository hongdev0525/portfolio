import AddAddress from "component/address/AddAddress";
import { device, fontWeight } from "component/common/GlobalComponent";
import styled from "styled-components";
import MypageTitle from "../MypageTitle";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { addressState } from "state/address";
import { cloneElement, useEffect } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";


const MypageAddressModfiyWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }
  `
const MypageAddressModfiyContainer = styled.div`
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

function MypageAddressModfiy({ subsNo, addressNo }) {
  const addressStateInfo = useRecoilValue(addressState(`mypageAddress${subsNo}`));
  const setAddressState = useSetRecoilState(addressState(`mypageAddress${subsNo}`));


  const updateSubscribeAddress = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        addressNo: addressStateInfo.addressNo,
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/updatesubscribeaddress`,
    })
  }

  const { refetch: updateSubscribeAddressRefetch } = useQuery(`updateSubscribeAddress${subsNo + addressStateInfo.addressNo}`, updateSubscribeAddress, {
    enabled: subsNo != null && addressStateInfo.addressNo != null,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {

      const response = res.data;
      console.log('response', response);
      if (response.status === "success") {
        alert("구독과 배송예정 주문의 주소가 변경되었습니다.");
        location.href = `/mypage/address/${subsNo}`;
      }

    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  useEffect(() => {
    console.log('selectedAddress', addressStateInfo)
    if (addressStateInfo.addressNo != null) {
      updateSubscribeAddressRefetch();
    }
  }, [addressStateInfo])

  return (
    <MypageAddressModfiyWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/mypage/address/${subsNo}`} title={"주소변경"} ></MypageTitle>
      </MypageTitleContainer>
      <MypageAddressModfiyContainer>
        <AddAddress title={false} activeSaveBtn={true} stateKey={`mypageAddress${subsNo}`}></AddAddress>
      </MypageAddressModfiyContainer>
    </MypageAddressModfiyWrapper>
  );
}

export default MypageAddressModfiy;