import styled from 'styled-components'
import Router from 'next/router'
import { customAxios } from 'public/js/customAxios.js';
import DeliveryDow from '../DeliveryDow';
import Product from '../Product';
import SubscribeAddress from 'component/address/SubscribeAddress.js';
import Payment from 'component/payment/Payment';
import DeliveryDate from '../DeliveryDate';
import EarningMiles from '../EarningMiles.js';
import PaymentInfo from 'component/payment/PaymentInfo/PaymentInfo.js';
import MypageTitle from 'component/mypage/MypageTitle';
import { Button } from 'component/common/GlobalComponent';
import { deliveryDowState } from 'state/subscribe.js';
import { productState } from 'state/subscribe.js';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { experienceState } from 'state/experience.js';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { common } from 'public/js/common.js';
import { fontWeight } from 'component/common/CommonComponent.js';
import { device } from "component/common/GlobalComponent";
import { paymentListState } from 'state/payment.js';
import { milesState } from 'state/miles.js';
import { deliveryDateState } from 'state/subscribe.js';
import { addressState } from 'state/address.js';
import { useOnLeavePageConfirmation } from 'hooks/useOnLeavePageConfirmation';

const ExperienceWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px ;
  }
`


const ExperienceContainer = styled.div`
    width: 596px;
    min-height: 100vh;

    @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    
  }
`
const ExperienceButtonContainer = styled.div`
  display:flex;
  justify-content:  center;
  width: 100%;
  margin: 24px auto;
`


const ExperienceButton = styled(Button)`
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

const ExperienceNotice = styled.div`
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



/**
 * 
 * 

    구독번호 -> 유저정보, 주소정보, 태그정보, 배송시작일, 
    1. 유저정보 - UserNo
    2. 구독정보 - TagGroupNo , Period, DeliveryStartDate, 
  
    3. 태그정보 - Product , DeliveryDow, 
    4. 주소정보 - Address, ApartmentName, ApartmentBuilding, ApartmentUnit, RcvName, ContactNo, Region
    5. 주문정보 - OrderPice , StatusCode, DeliveryDate , 
    6. 계정정보 - LoocalDeliverer
    7. 결제정보 - PaymentType, CustomerUid
*/




function Experience() {
  const selectedDowList = useRecoilValue(deliveryDowState('experience'));
  const setselectedDowList = useSetRecoilState(deliveryDowState('experience'));
  const experienceStateInfo = useRecoilValue(experienceState);
  const setExperienceState = useSetRecoilState(experienceState);
  const setProductState = useSetRecoilState(productState("experience"));
  const paymentListStateInfo = useRecoilValue(paymentListState("experience"))
  const productStateInfo = useRecoilValue(productState("experience"));
  const milesStateInfo = useRecoilValue(milesState("experience"));
  const setMilesState = useSetRecoilState(milesState("experience"));
  const deliveryDateStateInfo = useRecoilValue(deliveryDateState("experience"));
  const setDeliveryDateState = useSetRecoilState(deliveryDateState("experience"));
  const addressStateInfo = useRecoilValue(addressState("experience"));
  const deliveryDowStateInfo = useRecoilValue(deliveryDowState("experience"));
  const setDeliveryDowState = useSetRecoilState(deliveryDowState("experience"));
  const setAddressState = useSetRecoilState(addressState("experience"));
  const setPaymentListState = useSetRecoilState(paymentListState("experience"))


  const stateInitialize = () => {
    setAddressState((oldState) => {
      return {
        ...oldState,
        addressList: [],
        addressNo: null,
        addModal: false,
        addressAvailable: null,
      }
    })
    setPaymentListState((oldState) => { return [] })
    setExperienceState((oldState) => {
      return {
        subscribeType: "experience",
        product: [],
        period: 1,
        deliveryDate: null,
        dows: [],
        addressNo: null,
        paymentNo: null,
        totalPrice: null,
        milesAmount: 0,
        coupon: {
        }
      }
    });
    setselectedDowList(() => { return [] })
    setDeliveryDateState(() => { return [] })
    setMilesState(() => { return [] })
    setProductState((oldState) => { return { ...oldState, list: [] } })
  }



  const checkLogin = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/check`,
    })
  }


  const submitExperience = async () => {
    let tmp = null;
    const searchParams = (new URL(window.location)).searchParams;
    if ([...searchParams.keys()].length !== 0) {
      if (JSON.parse(searchParams.get("imp_success")) === true) {
        tmp = JSON.parse(localStorage.getItem("tmpExperienceInfo"));
        tmp["impUid"] = searchParams.get("imp_uid");
      }
    } else {
      tmp = { ...experienceStateInfo };
    }

    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: tmp,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/create`,
    })
  }


  const { refetch: submitExperienceRefetch } = useQuery(['submitExperience',experienceStateInfo.impUid], submitExperience, {
    enabled: experienceStateInfo.impUid != null && experienceStateInfo.impUid.length != 0,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data.status === "fail") {
          alert(`결제 실패 :${res.data.message}`);
        } else {
          alert("체험하기 구매가 완료되었습니다.")
          stateInitialize();
          localStorage.removeItem("tmpExperienceInfo")
          Router.replace("/mypage", undefined, { shallow: false })
        }
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  });
  const { refetch: checkLoginRefetch } = useQuery('checkLogin', () => checkLogin(), {
    retry: false,
    onSuccess: (res) => {
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  });


  // 요일 변경시
  useEffect(() => {
    console.log('deliveryDowStateInfo.list', deliveryDowStateInfo.list, productStateInfo.list)
    setExperienceState((oldState) => {
      return {
        ...oldState,
        dows: deliveryDowStateInfo.list
      }
    })
  }, [deliveryDowStateInfo.list])




  const handleSubmitExperience = () => {
    const productList = experienceStateInfo.product;
    if (productList.length === 0) {
      alert(`상품 수량을 선택해주세요.`)
      return false;
    }

    if (productList.length !== 0) {
      for (let n = 0; n < selectedDowList.length; n++) {
        const dow = selectedDowList[n];
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

    if (!experienceStateInfo.deliveryDate) {
      alert("배송 시작일을 선택해주세요.")
      return false;
    }

    if (!experienceStateInfo.addressNo) {
      alert("배송 주소를 입력해주세요.")
      return false;
    }


    const tmpSubscribeInfo = { ...experienceStateInfo };
    localStorage.setItem("tmpExperienceInfo", JSON.stringify(tmpSubscribeInfo));


    IMP.request_pay({
      pg: 'nice.nictest00m',
      pay_method: 'card',
      merchant_uid: `order_monthly_${Date.now()}`,
      name: '현관앞키친 - 체험하기',
      m_redirect_url: `http\:\/\/${location.host}` + "/experience",
      amount: experienceStateInfo.defaultDiscountPrice - parseInt(experienceStateInfo.milesAmount),
    }, function (rsp) { 
      if (rsp.success === true && rsp.status === "paid") {
        setExperienceState((oldState) => {
          return {
            ...oldState,
            impUid: rsp.imp_uid,
          }
        })
      } else {
        alert("결제에 실패했습니다. 다시 시도해주세요.")
        localStorage.removeItem("tmpExperienceInfo")
      }
    });

  }



  useEffect(() => {

    const tmp = JSON.parse(localStorage.getItem("tmpExperienceInfo"));
    if (tmp) {
      setExperienceState(tmp);
      setProductState((oldState) => {
        return {
          ...oldState,
          list: tmp["product"]
        }
      })
      setselectedDowList((oldState) => {
        return {
          ...oldState,
          list: tmp["dows"]
        }
      })
      setAddressState((oldState) => {
        return {
          ...oldState,
          addModal: false,
          addressNo: tmp["addressNo"]
        }
      })
      setDeliveryDateState((oldState) => {
        return {
          ...oldState,
          deliveryDate: tmp["deliveryDate"]
        }
      })
    } else {
      stateInitialize();
    }



  }, [])

  useEffect(() => {

    const tmp = JSON.parse(localStorage.getItem("tmpExperienceInfo"));

    //모바일 redirect 결과 처리
    console.log('Router.query', !Router.query)
    // if (Router.query.length===0) {
    const searchParams = (new URL(window.location)).searchParams;
    if (searchParams.length !== 0 && tmp) {
      if (JSON.parse(searchParams.get("imp_success")) === true) {
        console.log('mobile')
        submitExperienceRefetch();
      } else if (JSON.parse(searchParams.get("imp_success")) === false) {
        localStorage.removeItem("tmpExperienceInfo")
      }
    }

    // }

  }, [])


  useEffect(() => {
    // For reloading.
    // window.onbeforeunload = (e) => {
    //   localStorage.removeItem("tmpExperienceInfo")
    //   stateInitialize();
    //   return false;
    // };

    const routeChangeStart = (path) => {

      checkLoginRefetch();
      // if (subscribeDone === false) {
      //     if (path !== "/login") {
      //         const ok = confirm('변경사항이 저장되지 않을 수 있습니다. 페이지를 벗어나시겠습니까?');
      //         if (!ok) {
      //             common.loginCheck();
      //             Router.events.emit('routeChangeError');
      //             throw 'Abort route change. Please ignore this error.';
      //         }
      //     }
      // }
      stateInitialize();
      localStorage.removeItem("tmpExperienceInfo")
    };


    Router.events.on('routeChangeStart', routeChangeStart);
    return () => {
      // Router.events.off('routeChangeStart', routeChangeStart);
      window.onbeforeunload = () => {
        // common.loginCheck();
      };
    };

  }, []);


  //가격 변경시 상태값 변경
  const sumTotalPrice = (productStateInfo) => {
    let totalPrice = 0;
    let amountDiscount = 0;
    if (experienceStateInfo) {
      for (let i = 0; i < experienceStateInfo.dows.length; i++) {
        const dow = experienceStateInfo.dows[i];
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

        totalPrice += dowProductPrice;
      }
      console.log('amountDiscount :>> ', amountDiscount);
      return { totalPrice: totalPrice, defaultDiscountPrice: totalPrice - (amountDiscount * 1000), amountDiscount: amountDiscount };
    }
  }

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
      setExperienceState((oldState) => {
        return {
          ...oldState,
          product: productStateInfo.list,
          totalPrice: totalPrice,
          defaultDiscountPrice: defaultDiscountPrice,
          amountDiscount: amountDiscount
        }
      })
    }
  }, [productStateInfo.list])


  //결제 수단 컴포넌트에서 상태값 변경시 
  useEffect(() => {
    setExperienceState((oldState) => {
      return {
        ...oldState,
        paymentNo: paymentListStateInfo.paymentNo,
        paymentType: paymentListStateInfo.paymentType,
      }
    })
  }, [paymentListStateInfo.paymentNo])



  //쿠폰, 마일리지 컴포넌트에서 상태값 변경시 
  useEffect(() => {
    if (experienceStateInfo?.totalPrice < parseInt(milesStateInfo.milesAmount)) {
      setMilesState((oldState) => {
        return {
          ...oldState,
          milesAmount: experienceStateInfo.totalPrice
        }
      })
      setExperienceState((oldState) => {
        return {
          ...oldState,
          coupon: milesStateInfo.coupon,
          milesAmount: experienceStateInfo.totalPrice
        }
      })
    } else {
      setExperienceState((oldState) => {
        return {
          ...oldState,
          coupon: milesStateInfo.coupon,
          milesAmount: milesStateInfo.milesAmount
        }
      })
    }
  }, [milesStateInfo.coupon, milesStateInfo.milesAmount])



  useEffect(() => {
    setExperienceState((oldState) => {
      return {
        ...oldState,
        deliveryDate: deliveryDateStateInfo.deliveryDate,
      }
    })
  }, [deliveryDateStateInfo.deliveryDate])



  useEffect(() => {
    IMP.init("imp81502857");
  }, [])

  useEffect(() => {
    setExperienceState((oldState) => {
      return {
        ...oldState,
        addressNo: addressStateInfo.addressNo
      }
    })
  }, [addressStateInfo.addressNo])


  return (
    <ExperienceWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/`} title={"체험하기"} ></MypageTitle>
      </MypageTitleContainer>
      <ExperienceNotice>
        <p>- 선택한 횟수(요일)만큼 배송이 돼요.</p>
        <p>- 주 1회 배송은 오박이(보냉가방)가 아닌 하루체험팩(일회용)으로 배송이 돼요. </p>
        <p>- 체험 상품은  하루 쉬어가기 및 하루 수량변경(취소)이 불가해요.</p>
      </ExperienceNotice>
      <ExperienceContainer>
        <DeliveryDow stateKey={"experience"}></DeliveryDow>
        {
          selectedDowList && selectedDowList.list?.length >= 1 &&
          <>
            <Product selectedDowList={selectedDowList.list} stateKey={"experience"} experience={true}></Product>
            <DeliveryDate stateKey={"experience"}></DeliveryDate>
          </>
        }
        {selectedDowList && selectedDowList.list?.length >= 1 && experienceStateInfo?.deliveryDate != null && experienceStateInfo?.length !== 0 &&
          <>
            <SubscribeAddress stateKey={"experience"}></SubscribeAddress>
            <EarningMiles stateKey={"experience"} subscribePrice={experienceStateInfo.defaultDiscountPrice}></EarningMiles>
            <PaymentInfo paymentDetails={experienceStateInfo} experience={true}></PaymentInfo>
            {/* <Payment selectedDowListLength={selectedDowList.length} experience={true} stateKey={"experience"} paymentPrice={(experienceStateInfo.defaultDiscountPrice ? parseInt(experienceStateInfo.defaultDiscountPrice) : 0) - parseInt(experienceStateInfo.milesAmount)}></Payment> */}
            <ExperienceButtonContainer>
              <ExperienceButton onClick={handleSubmitExperience}>체험하기</ExperienceButton>
            </ExperienceButtonContainer>
          </>
        }
      </ExperienceContainer >
    </ExperienceWrapper>
  );
}

export default Experience;