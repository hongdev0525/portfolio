import styled from 'styled-components'
import Router from 'next/router'
import { customAxios } from '../../public/js/customAxios.js'
import DeliveryDow from './DeliveryDow';
import Product from './Product';
import SubscribeAddress from '../address/SubscribeAddress';
import Payment from '../payment/Payment';
import DeliveryDate from './DeliveryDate';
import EarningMiles from './EarningMiles.js';
import PaymentInfo from '../payment/PaymentInfo/PaymentInfo.js';
import { Button } from '../common/GlobalComponent';
import { deliveryDowState } from '../../state/subscribe'
import { productState } from '../../state/subscribe';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { subscribeState } from '../../state/subscribe';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { common } from 'public/js/common.js';
import { fontWeight } from 'component/common/CommonComponent.js';
import { device } from "component/common/GlobalComponent";
import { paymentListState } from 'state/payment.js';
import { milesState } from 'state/miles.js';
import { deliveryDateState } from '../../state/subscribe';
import { addressState } from 'state/address.js';
const SubscribeContainer = styled.div`
    width: 596px;
    min-height: 100vh;
    padding : 170px 0;
@media ${device.mobileL} {
    min-height: 100vh;
    width: 327px;
    padding: 120px 0;
    @media ${device.mobileL} {
        padding: 115px 0;
    }
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




function Subscribe() {
    const selectedDowList = useRecoilValue(deliveryDowState('subscribe'));
    const setselectedDowList = useSetRecoilState(deliveryDowState('subscribe'));
    const subscribeStateInfo = useRecoilValue(subscribeState);
    const setSubscribeState = useSetRecoilState(subscribeState);
    const setProductState = useSetRecoilState(productState("subscribe"));
    const paymentListStateInfo = useRecoilValue(paymentListState("subscribe"))
    const setPaymentListState = useSetRecoilState(paymentListState("subscribe"))
    const productStateInfo = useRecoilValue(productState("subscribe"));
    const milesStateInfo = useRecoilValue(milesState("subscribe"));
    const setMilesState = useSetRecoilState(milesState("subscribe"));
    const deliveryDateStateInfo = useRecoilValue(deliveryDateState("subscribe"));
    const setDeliveryDateState = useSetRecoilState(deliveryDateState("subscribe"));
    const addressStateInfo = useRecoilValue(addressState("subscribe"));
    const setAddressState = useSetRecoilState(addressState("subscribe"));



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
        setSubscribeState(null);
        setselectedDowList(() => { return [] })
        setDeliveryDateState(() => { return [] })
        setMilesState(() => { return [] })
        setProductState((oldState) => { return { ...oldState, list: [] } })
    }

    const checkLogin = async (subscribeStateInfo) => {
        return await customAxios({
            method: "GET",
            withCredentials: true,
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/check`,
        })
    }


    const submitSubscribe = async (subscribeStateInfo) => {
        return await customAxios({
            method: "POST",
            withCredentials: true,
            data: subscribeStateInfo,
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/create`,
        })
    }


    const { refetch: submitSubscribeRefetch } = useQuery('submitSubscribe', () => submitSubscribe(subscribeStateInfo), {
        enabled: false,
        staleTime: Infinity,
        retry: false,
        onSuccess: (res) => {
            if (res.status === 200) {
                if (res.data.status === "fail") {
                    alert(`결제 실패 :${res.data.message}`);
                }
                // else if (res.data.status === "exist") {
                //     alert("구독이 이미 존재합니다. 1인당 1개의 구독만 가능합니다.");
                // } 
                else {
                    alert("구독이 완료되었습니다.")
                    stateInitialize();
                    localStorage.removeItem("tmpSubscribeInfo")
                    window.location.href = "/mypage"
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



    const handleSubmitSubscribe = () => {
        const productList = subscribeStateInfo.product;
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

        if (!subscribeStateInfo.deliveryDate) {
            alert("배송 시작일을 선택해주세요.")
            return false;
        }

        if (!subscribeStateInfo.addressNo) {
            alert("배송 주소를 입력해주세요.")
            return false;
        }

        if (!subscribeStateInfo.paymentNo) {
            alert("결제정보를 입력해주세요.")
            return false;
        }

        submitSubscribeRefetch()
    }


    // 카카오페이 모바일 리다이렉트 후 처리
    useEffect(() => {

        const tmp = JSON.parse(localStorage.getItem("tmpSubscribeInfo"));
        console.log('tmp', tmp)
        if (tmp) {
            setSubscribeState(tmp);
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
            // setPaymentListState((oldState) => {
            //     return {
            //         ...oldState,
            //         paymentNo: tmp["paymentNo"],
            //         paymentModal: false,
            //         addPayment: false,
            //     }
            // })
            setDeliveryDateState((oldState) => {
                return {
                    ...oldState,
                    deliveryDate: tmp["deliveryDate"]
                }
            })
        }

    }, [])


    useEffect(() => {
        // For reloading.
        window.onbeforeunload = (e) => {
            localStorage.removeItem("tmpSubscribeInfo")
            stateInitialize();
            return false;
        };

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
            localStorage.removeItem("tmpSubscribeInfo")
        };


        Router.events.on('routeChangeStart', routeChangeStart);
        return () => {
            Router.events.off('routeChangeStart', routeChangeStart);
            window.onbeforeunload = () => {
                // common.loginCheck();
            };
        };

    }, []);


    //가격 변경시 상태값 변경
    const sumTotalPrice = (productStateInfo) => {
        let totalPrice = 0;
        let amountDiscount = 0;
        if (subscribeStateInfo) {
            for (let i = 0; i < subscribeStateInfo.dows.length; i++) {
                const dow = subscribeStateInfo.dows[i];
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
            console.log('amountDiscount :>> ', amountDiscount);
            return { totalPrice: totalPrice, defaultDiscountPrice: totalPrice - (amountDiscount * 1000 * 4), amountDiscount: amountDiscount };
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
            setSubscribeState((oldState) => {
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


    //결제 수단 컴포넌트에서 상태값 변경시 
    useEffect(() => {
        console.log(paymentListStateInfo)
        setSubscribeState((oldState) => {
            return {
                ...oldState,
                paymentNo: paymentListStateInfo.paymentNo
            }
        })
    }, [paymentListStateInfo.paymentNo])


    //쿠폰, 마일리지 컴포넌트에서 상태값 변경시 
    useEffect(() => {
        if (subscribeStateInfo?.totalPrice < parseInt(milesStateInfo.milesAmount)) {
            setMilesState((oldState) => {
                return {
                    ...oldState,
                    milesAmount: subscribeStateInfo.totalPrice
                }
            })
            setSubscribeState((oldState) => {
                return {
                    ...oldState,
                    coupon: milesStateInfo.coupon,
                    milesAmount: subscribeStateInfo.totalPrice
                }
            })
        } else {
            setSubscribeState((oldState) => {
                return {
                    ...oldState,
                    coupon: milesStateInfo.coupon,
                    milesAmount: milesStateInfo.milesAmount
                }
            })
        }
    }, [milesStateInfo.coupon, milesStateInfo.milesAmount])



    useEffect(() => {
        setSubscribeState((oldState) => {
            return {
                ...oldState,
                deliveryDate: deliveryDateStateInfo.deliveryDate,
            }
        })
    }, [deliveryDateStateInfo.deliveryDate])


    useEffect(() => {
        console.log('subscribeStateInfo', subscribeStateInfo)
    }, [subscribeStateInfo])


    useEffect(() => {
        setSubscribeState((oldState) => {
            return {
                ...oldState,
                addressNo: addressStateInfo.addressNo
            }
        })
    }, [addressStateInfo.addressNo])



    return (
        <SubscribeContainer>
            <DeliveryDow stateKey={"subscribe"}></DeliveryDow>
            {
                selectedDowList && selectedDowList.list?.length >= 2 &&
                <>
                    <Product selectedDowList={selectedDowList.list} stateKey={"subscribe"}></Product>
                    <DeliveryDate stateKey={"subscribe"}></DeliveryDate>
                </>
            }
            {selectedDowList && selectedDowList.list?.length >= 2 && subscribeStateInfo?.deliveryDate != null && subscribeStateInfo?.length !== 0 &&
                <>
                    <SubscribeAddress stateKey={"subscribe"} ></SubscribeAddress>
                    <Payment
                        stateKey={"subscribe"}
                        selectedDowListLength={selectedDowList.length}
                        redirectUrl={"/subscribe"}
                        failRedirectUrl={"/subscribe"}
                    ></Payment>
                    <EarningMiles stateKey={"subscribe"}></EarningMiles>
                    <PaymentInfo paymentDetails={subscribeStateInfo}></PaymentInfo>
                    <SubscribeButtonContainer>
                        <SubscribeButton onClick={handleSubmitSubscribe}>구독 결제하기</SubscribeButton>
                    </SubscribeButtonContainer>
                </>
            }
        </SubscribeContainer >
    );
}

export default Subscribe;