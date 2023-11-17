import styled from "styled-components";
import { customAxios } from "public/js/customAxios";
import { useQuery } from "react-query";
import MypageTitle from "component/mypage/MypageTitle";
import { device, fontWeight } from "component/common/GlobalComponent";
import Image from "next/image";
import { MypageButton } from "component/mypage/CommonComponent";
import { useEffect } from "react";
import Router from "next/router";
const WithdrawDoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 142px 0px;
  height: 100%;
  @media ${device.mobileL} {
    padding-top: 80px;
    margin: 0px 24px;
  }
`
const WithdrawDoneContainer = styled.div`
  width: 793px;
  @media ${device.mobileL} {
   width: 100%;
  }
`

const WithdrawDoneNotice = styled.div`
  padding: 60px 0 18px;
  font-size: 18px;
  font-weight: ${fontWeight("regular")};
  text-align: center;
  h2{
    font-size: 28px;
    font-weight: ${fontWeight("Medium")};
    margin-bottom: 20px;
  }
  span{
    display: block;
    margin-bottom: 56px;
    line-height: 26px;
  }
  @media ${device.mobileL} {
   padding: 0;
   h2{
    font-size: 20px;
    font-weight: ${fontWeight("regular")};
   }
   span{
    font-size: 14px;
    line-height: 20px;
    font-weight: ${fontWeight("regular")};
   }
  }

`

const WithDrawImgContainer = styled.div`
  

  @media ${device.mobileL} {
    img{
        width: 155px;
        height: 205px;
  } 
  }
  
`

const WithDrawButtonContainer = styled.div`
  width: 793px;
  margin-top: 60px;
  @media ${device.mobileL} {
   width: 100%;
  }
`

function WithdrawDone() {


  const handleWithdrawDone = () => {
    location.href = "/";
  }



  return (
    <WithdrawDoneWrapper>
      <WithdrawDoneContainer>
        <MypageTitle url="/" backward={false} title="탈퇴하기"></MypageTitle>
      </WithdrawDoneContainer>
      <WithdrawDoneNotice>
        <h2>회원 탈퇴가 완료되었습니다. </h2>
        <span>현관앞키친과 함께 해주셔서 감사합니다.<br></br>
          다시 만날 때 까지 식사 잘 챙겨드시고 다시 만나요.</span>
      </WithdrawDoneNotice>
      <WithDrawImgContainer>
        <Image src="/img/mypage/withdraw.png" width={217} height={287} alt="회원탈퇴 완료아이콘"></Image>
      </WithDrawImgContainer>
      <WithDrawButtonContainer>
        <MypageButton type="button" onClick={handleWithdrawDone}>확인</MypageButton>
      </WithDrawButtonContainer>
    </WithdrawDoneWrapper>
  );
}

export default WithdrawDone;