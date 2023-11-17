import styled from "styled-components";
import { device, fontWeight } from "component/common/GlobalComponent";
import MypageTitle from "../MypageTitle";
import MypageAddressList from "./MypageAddressList";
import { MypageButton } from "../CommonComponent";
import AddAddress from "component/address/AddAddress";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useEffect, useState } from "react";
import Router from "next/router";
const MypageAddresssWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 60px;
  }
`
const MypageAddresssContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
 width: 800px;
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
  div{
    border-bottom: none;
  }
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`
const MypageAddresssButtonContainer = styled.div`
  width: 596px;
  margin-top: 40px;
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


const MypageAddresssNotice = styled.div`
  width: 800px;
  height: auto;
  font-size:18px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  background-color: #F1F1F5;
  border-radius: 5px;
  padding:30px;
  margin-bottom: 50px;
  span{
    font-weight: ${fontWeight("semiBold")};
  }
  @media ${device.mobileL} {
    width: 100%;
    height: 100%;
    font-size:12px;
    line-height: 20px;
    margin: 18px  auto 40px;
    padding:20px 24px;
  }
`

function MypageAddresss({ subsNo }) {
  const [addressList, setAddressList] = useState([]);

  const getAddressinfoWithSubsNo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/infowithsubsno`,
    })
  }

  useQuery('getAddressList', () => getAddressinfoWithSubsNo(), {
    enabled: subsNo != null,
    onSuccess: (res) => {
      if (res.status === 200 && res.data?.data?.length !== 0) {
        console.log('res.data', res.data)
        setAddressList(res.data.data);
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const handleAddAddress = () => {
    Router.push("/mypage/address/add")
  }


  useEffect(() => { console.log('addressList', addressList) },
    [addressList])
  return (
    <MypageAddresssWrapper>
      <MypageTitleContainer>
        <MypageTitle url={"/mypage"} title={"주소관리"} ></MypageTitle>
      </MypageTitleContainer>
      <MypageAddresssNotice>
        <p>- 주소지를 수정하시면 다음배송일 (D+2일)부터 변경된 주소지로 배송 되오니 신중하게 수정해주세요. </p>
        <p>- 구독중인 상태의 주소지는 삭제가 불가해요. </p>
      </MypageAddresssNotice>
      <MypageAddresssContainer>
        {!addressList || addressList.length === 0 &&
          <NoAddress><p>등록된 배송지가 없습니다<br></br> 배송지를 추가해주세요</p></NoAddress>
        }
        {/* <AddAddress activeSaveBtn={false} stateKey={"myapgeAddress"}></AddAddress> */}
        {addressList && addressList.map(address => {
          return <MypageAddressList key={address.AddressNo} address={address} subsNo={subsNo}></MypageAddressList>
        })}
      </MypageAddresssContainer>
    </MypageAddresssWrapper>
  );
}

export default MypageAddresss;