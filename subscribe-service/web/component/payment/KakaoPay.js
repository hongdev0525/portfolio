import styled from "styled-components";
import { customAxios } from '../../public/js/customAxios.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { subscribeState } from "../../state/subscribe";
import { useOnLeavePageConfirmation } from '../../hooks/useOnLeavePageConfirmation';
import { useQuery } from "react-query"
import { paymentListState } from "../../state/payment";
import { fontWeight } from "component/common/CommonComponent.js";
import { device } from "component/common/GlobalComponent.js";
import { GroupButton02 } from 'component/subscribe/CommonComponent.js'
import { useEffect } from "react";


const KakaoPayButton = styled(GroupButton02)`
  width: 100%;
  height: 56px;
  font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    height: 37px;
    }
`

function KakaoPay({ redirectUrl, failRedirectUrl , stateKey}) {
  const subscribeStateInfo = useRecoilValue(subscribeState);
  const setPaymentListState = useSetRecoilState(paymentListState(stateKey));
  const paymentListStateInfo = useRecoilValue(paymentListState(stateKey))

  const { refetch: issuekakaobillingRefetch } = useQuery('issuekakaobilling', () => issuekakaobilling(), {
    enabled: false,
    staleTime: Infinity,
    retry: false,
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data.status === "fail") {
          alert("카카오페이 결제수단 등록에 실패했습니다.");
        } else {
          setPaymentListState((oldState) => {
            return {
              ...oldState,
              paymentNo: res.data.data,
              paymentType: "Kakao",
              paymentModal: false,
              addPayment: false,
            }
          })
          localStorage.removeItem("tmpSubscribeInfo")
        }

      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const issuekakaobilling = async () => {
    const tmp = JSON.parse(localStorage.getItem("tmpSubscribeInfo"));
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        paymentCuid: tmp["paymentCuid"],
        paymentType: tmp["paymentType"],
        bankName: tmp['bankName'],
        cardName: tmp['cardName']
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/issuekakaobilling`,
    })
  }


  const handleKakaoPay = () => {

    const kakaoCuid = `KAKAO_CUID_${new Date().getTime()}`
    const tmpSubscribeInfo = { ...subscribeStateInfo };
    tmpSubscribeInfo['paymentCuid'] = kakaoCuid;
    tmpSubscribeInfo['paymentType'] = "Kakao"


    IMP.request_pay({
      pg: "kakaopay.TCSUBSCRIP",
      name: '현관앞키친 ',
      merchant_uid: `order_door_${new Date().getTime()}`,
      pay_method: "kakaopay",
      m_redirect_url: `http\:\/\/${location.host}` + redirectUrl,
      amount: 0, // 빌링키 발급만 진행하며 결제승인을 하지 않습니다.
      customer_uid: kakaoCuid, // 필수 입력
    }, function (rsp) {
      console.log("rps", rsp)

      if (rsp.success === false) {
        alert("카카오페이 등록에 실패했습니다.");
        // localStorage.removeItem("tmpSubscribeInfo")
        location.href = failRedirectUrl
      } else {
        console.log(rsp)
        tmpSubscribeInfo['bankName'] = rsp.bank_name ? rsp.bank_name : "";
        tmpSubscribeInfo['cardName'] = rsp.card_name ? rsp.card_name : "";
        localStorage.setItem("tmpSubscribeInfo", JSON.stringify(tmpSubscribeInfo));
        issuekakaobillingRefetch();
      }
    })
  }

  useOnLeavePageConfirmation(false)

  useEffect(() => {
    IMP.init("imp81502857");
  }, [])

  return (
    <KakaoPayButton type='button' onClick={handleKakaoPay}>
      카카오페이
    </KakaoPayButton>);
}

export default KakaoPay;