import { useEffect, useState } from "react";
import styled from "styled-components";
import MypageTitle from "../MypageTitle";
import DeliveryDow from "component/subscribe/DeliveryDow";
import Product from "component/subscribe/Product";
import DeliveryDate from "component/subscribe/DeliveryDate";
import SubscribeAddress from "component/address/SubscribeAddress";
import Payment from "component/payment/Payment";
import EarningMiles from "component/subscribe/EarningMiles";
import PaymentInfo from "component/payment/PaymentInfo/PaymentInfo";
import RefundInfo from "component/payment/PaymentInfo/RefundInfo";
import { fontWeight, device, Button } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { deliveryDowState } from "state/subscribe";
import { productState } from "state/subscribe";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { deliveryDateState } from "state/subscribe";
import { addressState } from "state/address";
import { paymentListState } from "state/payment";
import { milesState } from "state/miles";
import { refundState } from "state/subscribe";
import Router from "next/router";

const SubscribeChangeWrapper = styled.div`
 display: flex;
  flex-direction: column;
  align-items: center;
  margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }
`
const MypageTitleContainer = styled.div`
  width: 800px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`

const SubscribeChangeContainer = styled.div`
 display: flex;
  flex-direction: column;
  width: 596px;
  @media ${device.mobileL} {
   width: 100%;
   padding: 0 24px;
  }
`

const SubscribeChangeNotice = styled.div`
  width: 800px;
  height: 145px;
  font-size:18px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  background-color: #F1F1F5;
  border-radius: 5px;
  padding:30px;
  margin: 67px  auto 50px;
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

const SubscribeButtonContainer = styled.div`
  display:flex;
  justify-content:  center;
  width: 100%;
  margin: 24px auto;
`


const SubscribeButton = styled(Button)`
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

function SubscribeChange({ subsNo }) {
  const [mobile, setMobile] = useState(null);
  const deliveryDowStateInfo = useRecoilValue(deliveryDowState(`subscribeChange${subsNo}`));
  const setDeliveryDowState = useSetRecoilState(deliveryDowState(`subscribeChange${subsNo}`));
  const productStateInfo = useRecoilValue(productState(`subscribeChange${subsNo}`));
  const setProductState = useSetRecoilState(productState(`subscribeChange${subsNo}`));
  const setAddressState = useSetRecoilState(addressState(`subscribeChange${subsNo}`))
  const [newSubscribeInfo, setNewSubscribeInfo] = useState({
    product: [],
    period: 4,
    deliveryDate: null,
    dows: [],
    addressNo: null,
    paymentNo: null,
    totalPrice: null,
    milesAmount: 0,
    coupon: {},
    subsNo: subsNo
  });
  const deliveryDatetateInfo = useRecoilValue(deliveryDateState(`subscribeChange${subsNo}`));
  const setDeliveryDateState = useSetRecoilState(deliveryDateState(`subscribeChange${subsNo}`));
  const addressStateInfo = useRecoilValue(addressState(`subscribeChange${subsNo}`));
  const paymentListStateInfo = useRecoilValue(paymentListState(`subscribeChange${subsNo}`))
  const setPaymentListState = useSetRecoilState(paymentListState(`subscribeChange${subsNo}`));
  const refundStateInfo = useRecoilValue(refundState(`subscribeChange${subsNo}`));
  const milesStateInfo = useRecoilValue(milesState(`subscribeChange${subsNo}`));
  const setMilesState = useSetRecoilState(milesState(`subscribeChange${subsNo}`));


  const subscribeChange = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: newSubscribeInfo,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/subscribechange`,
    })
  }

  const { refetch: subscribeChangeRefetch } = useQuery(`subscribeChange${subsNo}`, subscribeChange, {
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data;
      if (res.status === 200 && response.status === "success") {
        alert("구독변경에 성공했습니다.");
      } else {
        alert("구독변경에 실패했습니다. 고객센터를 문의주세요.")
      }
      Router.replace("/mypage", undefined, { shallow: false })
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const getSubscribeInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/info`,
    })
  }


  useQuery('getSubscribeInfo', getSubscribeInfo, {
    enabled: subsNo != null,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data.data;
      if (res.status === 200) {
        setAddressState((oldState) => {
          return {
            ...oldState,
            addressNo: response.addressNo
          }
        })
        setPaymentListState((oldState) => {
          return {
            ...oldState,
            paymentNo: response.paymentNo,
            addPayment: false,
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  const handleSubmitSubscribe = () => {
    const productList = newSubscribeInfo.product;
    if (productList.length === 0) {
      alert(`상품 수량을 선택해주세요.`)
      return false;
    }

    if (productList.length !== 0) {
      for (let n = 0; n < deliveryDowStateInfo.list.length; n++) {
        const dow = deliveryDowStateInfo.list[n];
        let isContain = false;
        for (let i = 0; i < productList.length; i++) {
          const product = productList[i];
          if (product["dow"] === dow) {
            isContain = true;
            break;
          }
        }
        if (isContain === false) {
          alert(`${dow}요일 상품 수량을 선택해주세요.`)
          return false;
        }

      }
    }

    if (!newSubscribeInfo.deliveryDate) {
      alert("배송 시작일을 선택해주세요.")
      return false;
    }

    if (!newSubscribeInfo.addressNo) {
      alert("배송 주소를 입력해주세요.")
      return false;
    }

    if (!newSubscribeInfo.paymentNo) {
      alert("결제정보를 입력해주세요.")
      return false;
    }

    subscribeChangeRefetch();
  }



  // 요일 변경시
  useEffect(() => {
    console.log('deliveryDowStateInfo.list', deliveryDowStateInfo.list, productStateInfo.list)
    setNewSubscribeInfo((oldState) => {
      return {
        ...oldState,
        dows: deliveryDowStateInfo.list
      }
    })
  }, [deliveryDowStateInfo.list])


  useEffect(() => {

    if (productStateInfo && productStateInfo.list?.length !== 0) {
      const { totalPrice, defaultDiscountPrice, amountDiscount } = sumTotalPrice(productStateInfo.list);
      //상품변경시 마일리지 초기화
      setMilesState((oldState) => {
        return {
          ...oldState,
          milesAmount: 0
        }
      })
      setNewSubscribeInfo((oldState) => {
        return {
          ...oldState,
          product: productStateInfo.list,
          totalPrice: totalPrice,
          defaultDiscountPrice: defaultDiscountPrice,
          amountDiscount: amountDiscount * 4
        }
      })
    }
  }, [productStateInfo.list])

  useEffect(() => {
    setNewSubscribeInfo((oldState) => {
      return {
        ...oldState,
        addressNo: addressStateInfo.addressNo
      }
    })
  }, [addressStateInfo.addressNo])


  //가격 변경시 상태값 변경
  const sumTotalPrice = (productStateInfo) => {
    let totalPrice = 0;
    let amountDiscount = 0;
    if (newSubscribeInfo) {
      for (let i = 0; i < newSubscribeInfo.dows?.length; i++) {
        const dow = newSubscribeInfo.dows[i];
        const dowProductPrice = 0;
        let totalAmount = 0;
        for (let n = 0; n < productStateInfo.length; n++) {
          const product = productStateInfo[n];
          if (dow === product.dow) {
            totalAmount += product.amount;
            dowProductPrice += (parseInt(product["price"]) * product["amount"])
          }
        }
        if (totalAmount >= 2) amountDiscount++;

        totalPrice += dowProductPrice * 4;
      }
      return { totalPrice: totalPrice, defaultDiscountPrice: totalPrice - (amountDiscount * 1000 * 4), amountDiscount: amountDiscount };
    }
  }


  useEffect(() => {
    setNewSubscribeInfo((oldState) => {
      return {
        ...oldState,
        deliveryDate: deliveryDatetateInfo.deliveryDate,
      }
    })
  }, [deliveryDatetateInfo.deliveryDate])



  //결제 수단 컴포넌트에서 상태값 변경시 
  useEffect(() => {
    setNewSubscribeInfo((oldState) => {
      return {
        ...oldState,
        paymentNo: paymentListStateInfo.paymentNo
      }
    })
  }, [paymentListStateInfo.paymentNo])

  //쿠폰, 마일리지 컴포넌트에서 상태값 변경시 
  useEffect(() => {
    if (newSubscribeInfo?.defaultDiscountPrice < parseInt(milesStateInfo.milesAmount)) {

      setMilesState((oldState) => {
        return {
          ...oldState,
          milesAmount: newSubscribeInfo.defaultDiscountPrice
        }
      })
      setNewSubscribeInfo((oldState) => {
        return {
          ...oldState,
          coupon: milesStateInfo.coupon,
          milesAmount: newSubscribeInfo.defaultDiscountPrice
        }
      })
    } else {
      setNewSubscribeInfo((oldState) => {
        return {
          ...oldState,
          coupon: milesStateInfo.coupon,
          milesAmount: milesStateInfo.milesAmount
        }
      })
    }

  }, [milesStateInfo.coupon, milesStateInfo.milesAmount])


  //환불 마일리지 등록
  useEffect(() => {
    if (refundStateInfo.list != null) {
      setNewSubscribeInfo((oldState) => {
        return {
          ...oldState,
          refundPrice: refundStateInfo.list.TotalPrice,
          refundMilesAmount: refundStateInfo.list.MilesAmount
        }
      })
    }
  }, [refundStateInfo])

  useEffect(() => {

    setMobile(isMobile)
  }, [])


  useEffect(() => {
    // For reloading.
    window.onbeforeunload = (e) => {
      setNewSubscribeInfo({
        product: [],
        period: 4,
        deliveryDate: null,
        dows: [],
        addressNo: null,
        paymentNo: null,
        totalPrice: null,
        milesAmount: 0,
        coupon: {},
        subsNo: subsNo
      });
      setDeliveryDowState(() => { return [] })
      setDeliveryDateState(() => { return [] })
      setMilesState(() => { return [] })
      setProductState((oldState) => { return { ...oldState, list: [] } })
      return false;
    };

    const routeChangeStart = (path) => {
      setNewSubscribeInfo({
        product: [],
        period: 4,
        deliveryDate: null,
        dows: [],
        addressNo: null,
        paymentNo: null,
        totalPrice: null,
        milesAmount: 0,
        coupon: {},
        subsNo: subsNo
      });
      setDeliveryDowState(() => { return [] })
      setDeliveryDateState(() => { return [] })
      setMilesState(() => { return [] })
      setProductState((oldState) => { return { ...oldState, list: [] } })
    };


    Router.events.on('routeChangeStart', routeChangeStart);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      window.onbeforeunload = () => {
      };
    };

  }, []);



  useEffect(() => {
    console.log('newSubscribeInfo', newSubscribeInfo)
  }, [newSubscribeInfo])

  useEffect(() => {
    console.log("productInfo is changed", productStateInfo.list)
  }, [productStateInfo.list])

  return (
    <SubscribeChangeWrapper>
      <MypageTitleContainer>
        <MypageTitle url={"/mypage"} title={"전체 구독 변경"} ></MypageTitle>
      </MypageTitleContainer>
      <SubscribeChangeNotice>
        <p>- 구독 변경은 기존 구독의 남은 주문수는 전체 해지 및 카드 환불 처리돼요</p>
        <p>- 새로운 구독에 대한 결제 후 구독 변경이 완료돼요</p>
        <p>- 구독 변경시 지정한 첫 배송일부터 변경된 구독이 적용돼요</p>
      </SubscribeChangeNotice>
      <SubscribeChangeContainer>
        <DeliveryDow stateKey={`subscribeChange${subsNo}`}></DeliveryDow>
        {
          deliveryDowStateInfo && deliveryDowStateInfo.list?.length >= 2 &&
          <>
            <Product selectedDowList={deliveryDowStateInfo.list} stateKey={`subscribeChange${subsNo}`}></Product>
            <DeliveryDate stateKey={`subscribeChange${subsNo}`}></DeliveryDate>
          </>
        }
        {deliveryDowStateInfo && deliveryDowStateInfo.list?.length >= 2 && newSubscribeInfo?.deliveryDate != null && newSubscribeInfo?.length !== 0 &&
          <>
            <SubscribeAddress stateKey={`subscribeChange${subsNo}`}></SubscribeAddress>
            <Payment
              stateKey={`subscribeChange${subsNo}`}
              selectedDowListLength={deliveryDowStateInfo.length}
              redirectUrl={`/subscribe/${subsNo}`}
              failRedirectUrl={`/subscribe/${subsNo}`}
            ></Payment>
            <EarningMiles stateKey={`subscribeChange${subsNo}`}></EarningMiles>
            <RefundInfo subsNo={subsNo} stateKey={`subscribeChange${subsNo}`} refundType={"change"}></RefundInfo>
            <PaymentInfo paymentDetails={newSubscribeInfo}></PaymentInfo>
            <SubscribeButtonContainer>
              <SubscribeButton onClick={handleSubmitSubscribe}>구독 결제하기</SubscribeButton>
            </SubscribeButtonContainer>
          </>
        }
      </SubscribeChangeContainer>
    </SubscribeChangeWrapper>
  );
}

export default SubscribeChange;