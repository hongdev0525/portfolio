import styled from "styled-components";
import { device, fontWeight } from "component/common/GlobalComponent";
import MypageTitle from "../MypageTitle";
import RefundInfo from "component/payment/PaymentInfo/RefundInfo";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { Button } from "component/common/GlobalComponent";
import { refundState } from "state/subscribe";
import { customAxios } from "public/js/customAxios";
import CancelRefundInfo from "./CancelRefundInfo";
import { cancelRefundState } from "state/subscribe";
import { useState } from "react";
import Image from "next/image";
const CancelSubscribeWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px ;
  }
`
const CancelSubscribeContainer = styled.div`
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
 margin-bottom: 5px;
 div{
 border-bottom: none;
  }
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px 0px;
    div{
      margin-bottom: 0px;
    }
  }
`


const CancelSubscribeNotice = styled.div`
  width: 800px;
  height: 145px;
  font-size:18px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  background-color: #F1F1F5;
  border-radius: 5px;
  padding:30px;
  margin-bottom : 44px;
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

const CancelSubscribeButtonContainer = styled.div`
  display:flex;
  justify-content:  center;
  width: 596px;
  margin: 24px auto;
    @media ${device.mobileL} {
      width: 364px;
  }
`


const CancelSubscribeButton = styled(Button)`
  width: 100%;
  border-radius: 5px;
  font-size:18px;
  line-height: 38px;
  font-weight: ${fontWeight("bold")};
  margin-top:40px;
  @media ${device.mobileL} {
    border-radius: 5px;
    margin-top:30px;
  }
`

const CancelDoneWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
`

const CancelDoneContainer = styled.div`
   display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: #fefefe;
    border-radius: 5px;
    z-index: 10;
    margin-top: 300px;
    padding:40px;
    width: 487px;
      height: 308px;

      span{
        display: block;
        font-size: 18px;
        font-weight: ${fontWeight("regular")};
        color:#767676;
        text-align: center;
        line-height: 21px;
      }
      p{
        font-size: 18px;
        font-weight: ${fontWeight("regular")};
        line-height: 21px;
        color:#DC5F00;
        text-align: center;
      }
`
const CancelDoneBackground = styled.div`
   position: absolute;
  top:0;
  left:0;
  background-color: #232323;
  width: 100%;
  height: 100%;
  z-index: 5;
  opacity: .8;
`

const CancelDoneCloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width:100%;
  
`

const CancelDoneCloseButton = styled(Image)`
    cursor: pointer;
  @media ${device.mobileL} {
      width: 10px;
      height: 10px;
  }
`
const CancelButtonContainer = styled.div`
  width: 100%;
  text-align: center;
 
`
const CancelButton = styled.div`
  font-size: 20px;
  border: none;
  width: 100%;
  cursor: pointer;
  
`





function CancelSubscribe({ subsNo }) {
  const cancelRefundStateInfo = useRecoilValue(cancelRefundState(`subscribeCancel${subsNo}`));
  const [cancelDone, setCancelDone] = useState(false);
  const [maxDeliveryDate, setMaxDeliveryDate] = useState(null);
  const cancelSubscribe = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        cancelRefundStateInfo: cancelRefundStateInfo.list,
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/cancel`,
    })
  }

  const { refetch: cancelSubscribeRefetch } = useQuery(`cancelSubscribe${subsNo}`, () => cancelSubscribe(), {
    enabled: false,
    onSuccess: (res) => {
      const response = res.data;
      console.log('response', response)
      if (response.status === "success") {
        setCancelDone(true);
        setMaxDeliveryDate(response.maxDeliveryDate);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  const handleCancelSubscribe = () => {
    console.log("cancelRefundStateInfo", cancelRefundStateInfo)
    cancelSubscribeRefetch();
  }



  const handleCancelDone = () => {
    location.replace("/mypage");
  }

  return (
    <CancelSubscribeWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/mypage/subscribe/list`} title={"구독해지"} ></MypageTitle>
      </MypageTitleContainer>
      <CancelSubscribeNotice>
        <p>- <b>오박이(보냉가방) 수거를 위해</b> 구독 해지 신청 시점으로  가장 빠른 배송일(D+2일 기준 )에 마지막 배송이 이루어져요.</p>
        <p>- 마지막 배송일 변경이 필요한 경우 카카오 채널을 통해 문의해주세요.</p>
        <p>- 구독 해지가 완료된 이후에는 해지 취소가 불가하오니 신중하게 선택해주세요.</p>
      </CancelSubscribeNotice>
      <CancelSubscribeContainer>
        <CancelRefundInfo subsNo={subsNo} stateKey={`subscribeCancel${subsNo}`} refundType={"cancel"}></CancelRefundInfo>
      </CancelSubscribeContainer>
      <CancelSubscribeButtonContainer>
        <CancelSubscribeButton type="button" onClick={handleCancelSubscribe}>구독 해지하기</CancelSubscribeButton>
      </CancelSubscribeButtonContainer>
      {cancelDone === true &&
        <CancelDoneWrapper>
          <CancelDoneContainer>
            {/* <CancelDoneCloseButtonContainer>
              <CancelDoneCloseButton src="/img/main/web/crossIcon.png" width={19} height={19} alt="닫기 아이콘" onClick={handleCloseModal}></CancelDoneCloseButton>
            </CancelDoneCloseButtonContainer> */}
            {maxDeliveryDate ?
              <span>
                마지막 배송일은 {new Date(maxDeliveryDate).getMonth() + 1}월 {new Date(maxDeliveryDate).getDate()}일입니다.<br></br>
                오박이를 꼭 내어놓아주세요.
              </span>

              :
              <span>
                오박이를 꼭 내어놓아주세요.
              </span>
            }

            <p>
              *오박이를 내어놓지 않았을 경우
              <br />
              추가 배송수수료가 발생합니다.
            </p>
            <CancelButtonContainer>
              <CancelButton typeof="button" onClick={handleCancelDone}>확인</CancelButton>
            </CancelButtonContainer>
          </CancelDoneContainer>
          <CancelDoneBackground></CancelDoneBackground>
        </CancelDoneWrapper>
      }
    </CancelSubscribeWrapper>
  );
}

export default CancelSubscribe;