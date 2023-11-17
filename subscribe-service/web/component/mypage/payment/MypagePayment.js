import styled from "styled-components";
import MypageTitle from "../MypageTitle";
import { device, fontWeight } from "component/common/GlobalComponent";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useEffect } from "react";
import { useState } from "react";
import MypagePaymentInfo from "./MypagePaymentInfo";

const MypagePaymentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }
`
const MypagePaymentContainer = styled.div`
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

const MypagePaymentNotice = styled.div`
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


function MypagePayment({ subsNo }) {
  const [paymentList, setPaymentList] = useState(null);
  // 혹시 리스트로 바뀔경우를 대비해 남겨둠.
  // const getPaymentList = async () => {
  //   return await customAxios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/list`,
  //   })
  // }

  // useQuery('getPaymentList', () => getPaymentList(), {
  //   onSuccess: (res) => {
  //     console.log('res', res)
  //     setPaymentList(res.data.data)
  //   },
  //   onError: (error) => {
  //     console.error("Error Occured : ", error)
  //   }
  // })

  const getPaymentInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/infowithsubsno`,
    })
  }

  useQuery('getPaymentList', getPaymentInfo, {
    enabled: subsNo != null,
    onSuccess: (res) => {
      console.log('res', res)
      setPaymentList(res.data.data)
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  useEffect(() => {
    console.log('paymentList', paymentList)
  }, [paymentList])





  return (
    <MypagePaymentWrapper>
      <MypageTitleContainer>
        <MypageTitle url={"/mypage"} title={"결제관리"}></MypageTitle>
      </MypageTitleContainer>
      <MypagePaymentNotice>
        <p>  - 정기구독 진행 중인 상품이 있을 경우, 결제수단 삭제는 불가합니다.</p>
        <p>- 등록한 결제수단으로 자동 결제가 진행됩니다.</p>
        <p>- 정기구독 결제는 마지막 배송일 기준 D-2일에 이루어집니다.</p>
      </MypagePaymentNotice>
      <MypagePaymentContainer>
        {paymentList && paymentList.map(paymentInfo => {
          return <MypagePaymentInfo key={paymentInfo.PaymentNo} paymentInfo={paymentInfo} subsNo={subsNo}></MypagePaymentInfo>
        })}
      </MypagePaymentContainer>
    </MypagePaymentWrapper>
  );
}

export default MypagePayment;