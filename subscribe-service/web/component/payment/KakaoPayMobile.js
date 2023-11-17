import styled from "styled-components";
import { customAxios } from '../../public/js/customAxios.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { subscribeState } from "../../state/subscribe";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import { useOnLeavePageConfirmation } from '../../hooks/useOnLeavePageConfirmation';
import { useQuery } from "react-query"
import { paymentListState } from "../../state/payment";
import { GroupButton02 } from 'component/subscribe/CommonComponent.js'
import { fontWeight } from "component/common/CommonComponent.js";
import { device } from "component/common/GlobalComponent.js";

// const KakaoPayButton = styled(Button)`
//   /* background-image: url("./pulic/image/payment_icon_yellow_medium.png"); */
// `

const KakaoPayButton = styled(GroupButton02)`
  width: 100%;
  height: 48px;
  font-size:12px;
  font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    height: 37px;
    }
`

function KakaoPayMobile({ redirectUrl, failRedirectUrl, stateKey }) {
  IMP.init("imp81502857");
  const subscribeStateInfo = useRecoilValue(subscribeState);
  const setPaymentListState = useSetRecoilState(paymentListState(stateKey));

  const { refetch: issuekakaobillingRefetch } = useQuery('issuekakaobilling', () => issuekakaobilling(), {
    enabled: false,
    staleTime: Infinity,
    retry: false,
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data.status === "fail") {
          alert("카카오페이 결제수단 등록에 실패했습니다.");
        } else {
          alert("카카오페이가 등록되었습니다.");

          setPaymentListState((oldState) => {
            return {
              ...oldState,
              paymentNo: res.data.data
            }
          })

          const tmp = JSON.parse(localStorage.getItem("tmpSubscribeInfo"))
          const subscribeInfo = Object.keys(tmp)
            .filter((key) => key !== "paymentType" && key !== "paymentCuid")
            .reduce((obj, key) => {
              return Object.assign(obj, {
                [key]: tmp[key]
              });
            }, {})

          localStorage.setItem("tmpSubscribeInfo", JSON.stringify(subscribeInfo));

        }

      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const issuekakaobilling = async (kakaopayInfo) => {
    const tmp = JSON.parse(localStorage.getItem("tmpSubscribeInfo"));
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: { paymentCuid: tmp["paymentCuid"], paymentType: tmp["paymentType"] },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/issuekakaobilling`,
    })
  }


  const handleKakaoPay = () => {
    const kakaoCuid = `KAKAO_CUID_${new Date().getTime()}`

    const tmpSubscribeInfo = { ...subscribeStateInfo };
    tmpSubscribeInfo['paymentCuid'] = kakaoCuid;
    tmpSubscribeInfo['paymentType'] = "Kakao"
    localStorage.setItem("tmpSubscribeInfo", JSON.stringify(tmpSubscribeInfo));
    IMP.request_pay({
      pg: "kakaopay.TCSUBSCRIP",
      merchant_uid: `order_door_${new Date().getTime()}`,
      name: '현관앞키친',
      pay_method: "kakaopay",
      m_redirect_url: `http\:\/\/${location.host}` + redirectUrl,
      amount: 0, // 빌링키 발급만 진행하며 결제승인을 하지 않습니다.
      customer_uid: kakaoCuid, // 필수 입력
    }, function (rsp) {
      if (rsp.success === false) {
        alert("카카오페이 등록에 실패했습니다.");
        location.href = failRedirectUrl
      }
    })
  }

  useOnLeavePageConfirmation(false)


  useEffect(() => {


    const tmp = JSON.parse(localStorage.getItem("tmpSubscribeInfo"));
    //모바일 redirect 결과 처리
    if (!Router.query) {
      const searchParams = (new URL(window.location)).searchParams;
      console.log(searchParams);
      if (searchParams.length !== 0 && tmp) {
        if (JSON.parse(searchParams.get("imp_success")) === true && tmp["paymentType"] && tmp["paymentCuid"]) {
          issuekakaobillingRefetch()
        }
      }

    }
    return () => {
    }
  }, [])

  useEffect(() => {
    IMP.init("imp81502857");
  }, [])


  return (
    <KakaoPayButton type='button' onClick={handleKakaoPay}>
      카카오페이
    </KakaoPayButton>);
}

export default KakaoPayMobile;