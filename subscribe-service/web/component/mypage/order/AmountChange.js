import styled, { css } from "styled-components";
import { amountChangeState, amountChangeProductState } from "../../../state/mypage";
import { useQuery } from "react-query"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { device, fontWeight, Title } from "component/common/GlobalComponent";
import { useEffect, useState } from "react";
import { customAxios } from "public/js/customAxios";
import { isMobile } from "react-device-detect";
import { paymentListState } from "state/payment";
import { productState } from "state/subscribe";
import { addressState } from "state/address";
import { milesState } from "state/miles";
import Image from "next/image";
import Payment from "component/payment/Payment";
import Product from "component/subscribe/Product";
import MilesReg from "component/miles/MilesReg";
import PaymentInfo from "component/payment/PaymentInfo/PaymentInfo";
import OrderPaymentInfo from "component/payment/PaymentInfo/OrderPaymentInfo";
import { MypageButton } from "../CommonComponent";
import Router from "next/router";
import { common } from "public/js/common";
const AmountChangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }

`
const AmountChangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 596px;
  @media ${device.mobileL} {
   width: 100%;
   padding: 0 24px;
  }
  
`

const AmountChangeTitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  width  : 800px;
  @media ${device.mobileL} {
   width: 100%;
   padding: 0 24px;
  }
`
const AmountChangeTitle = styled.div`
  font-size: 28px;
  line-height: 56px;
  font-weight: ${fontWeight("medium")};
  @media ${device.mobileL} {
    font-size: 20px;
    font-weight: ${fontWeight("regular")};
  }
`
const BackwardIcon = styled(Image)`
  margin-right: 290px;
  cursor: pointer;
  @media ${device.mobileL} {
    width: 28px;
    height: 28px;
    margin-right: 81px;
  }
`

const DateLabel = styled.div`
  margin-bottom: 8px;
    @media ${device.mobileL} {
      margin-bottom: 0px;
  }
`


const AmountChangeNotice = styled.div`
  width: 800px;
  height: 159px;
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

const MilesContainer = styled.div`
  margin-bottom: 30px;
`
const AmoutChangeButtonContainer = styled.div`
  width: 100%;
  margin-top: 40px;
`

function AmountChange({ orderNo }) {

  const setAmountChangeState = useSetRecoilState(amountChangeState(orderNo));
  const amountChangeStateInfo = useRecoilValue(amountChangeState(orderNo));
  const productStateInfo = useRecoilValue(productState(orderNo));
  const paymentListStateInfo = useRecoilValue(paymentListState(orderNo))
  const milesStateInfo = useRecoilValue(milesState(orderNo));
  const setMilesState = useSetRecoilState(milesState(orderNo));
  const setPaymentListState = useSetRecoilState(paymentListState(orderNo));

  const [initialProductInfo, setInitialProductInfo] = useState(null);
  const setAddressState = useSetRecoilState(addressState(orderNo))
  const [mobile, setMobile] = useState(null);
  const [orderInfo, setOrderInfo] = useState({});


  const sumTotalPrice = (productStateInfo) => {
    let totalPrice = 0;
    let amountDiscount = 0;
    let dowProductPrice = 0;
    let totalAmount = 0;
    for (let n = 0; n < productStateInfo.length; n++) {
      const product = productStateInfo[n];
      totalAmount += product.amount;
      dowProductPrice += (parseInt(product["price"]) * product["amount"])
    }
    if (totalAmount >= 2) amountDiscount++;

    totalPrice += dowProductPrice;
    return { totalPrice: totalPrice, defaultDiscountPrice: totalPrice - (amountDiscount * 1000), amountDiscount: amountDiscount };
  }

  const getInitialProductInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        orderNo: orderNo,
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/initialproductinfo`,
    })
  }


  useQuery('getInitialProductInfo', getInitialProductInfo, {
    enabled: amountChangeStateInfo.dows != null,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data.data) {

          setInitialProductInfo((oldState) => {
            const { totalPrice, defaultDiscountPrice, amountDiscount } = sumTotalPrice(res.data.data);
            return {
              ...oldState,
              product: res.data.data,
              totalPrice: totalPrice,
              defaultDiscountPrice: defaultDiscountPrice,
              amountDiscount: amountDiscount
            }
          })

        }
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const getOrderInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        orderNo: orderNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/infowithorderno`,
    })
  }


  useQuery('getOrderInfo', getOrderInfo, {
    enabled: orderNo != null,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data.data[0];
      if (res.status === 200) {
        setOrderInfo(res.data.data[0]);
        setAmountChangeState((oldState) => {
          return {
            ...oldState,
            deliveryDate: new Date(response.deliveryDate),
            dows: [response.deliveryDow],
            addressNo: res.data.subscribeInfo.AddressNo,
            paymentNo: res.data.subscribeInfo.PaymentNo,
          }
        })
        setAddressState((oldState) => {
          return {
            ...oldState,
            addressNo: res.data.subscribeInfo.AddressNo
          }
        })
        setPaymentListState((oldState) => {
          return {
            ...oldState,
            paymentNo: res.data.subscribeInfo.PaymentNo,
            addPayment: false,
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  function compareProducts(before, after) {
    const result = [];
  
    // before 배열에서 after 배열에 없는 요소들을
    // result 배열에 push
    before.forEach((itemBefore) => {
      const itemAfter = after.find((item) => item.name === itemBefore.name);
      if (!itemAfter) {
        result.push({
          ...itemBefore,
          amount: -itemBefore.amount,
        });
      }
    });
  
    // after 배열에서 before 배열에 없는 요소들을
    // result 배열에 push
    after.forEach((itemAfter) => {
      const itemBefore = before.find((item) => item.name === itemAfter.name);
      if (!itemBefore) {
        result.push(itemAfter);
      } else {
        const diff = itemAfter.amount - itemBefore.amount;
        if (diff !== 0) {
          result.push({
            ...itemAfter,
            amount: diff,
          });
        }
      }
    });
  
    // name으로 그룹핑하여 증감에 따라 항목을 분류
    const grouped = result.reduce((acc, cur) => {
      const groupName = cur.name;
      const group = acc[groupName] || { name: groupName, inc: [], dec: [] };
  
      if (cur.amount > 0) {
        group.inc.push(cur);
      } else {
        group.dec.push({
          ...cur,
          amount: -cur.amount,
        });
      }
  
      acc[groupName] = group;
      return acc;
    }, {});
  
    // inc나 dec 배열이 있는 항목만 결과에 추가
    const filtered = Object.values(grouped).filter(
      (group) => group.inc.length > 0 || group.dec.length > 0
    );
  
    // 결과 반환
    return filtered.map((group) => ({
      name: group.name,
      inc: group.inc,
      dec: group.dec,
    }));
  }
  
  


  const sumitAmoutChange = async () => {
    const tmp = { ...amountChangeStateInfo }
    tmp["beforeTotalPrice"] = initialProductInfo.defaultDiscountPrice,
      tmp["beforeOrderNo"] = orderNo
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        orderInfo: tmp
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/amountchange2`,
    })
  }


  const { refetch: sumitAmoutChangeRefetch } = useQuery(`sumitAmoutChange${orderNo}`, sumitAmoutChange, {
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      alert("수량 변경이 정상적으로 완료되었습니다.");
      Router.replace("/mypage", undefined, { shallow: false });
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  useEffect(() => {
    setMobile(isMobile)
  }, [])


  //상품 변경시
  useEffect(() => {


    if (amountChangeStateInfo?.defaultDiscountPrice && initialProductInfo?.defaultDiscountPrice) {
      if ((amountChangeStateInfo.defaultDiscountPrice - initialProductInfo.defaultDiscountPrice) <= 0) {
        setMilesState((oldState) => {
          return {
            ...oldState,
            milesAmount: 0,
          }
        })
        setAmountChangeState((oldState) => {
          return {
            ...oldState,
            milesAmount: 0
          }
        })
      } else {
        setAmountChangeState((oldState) => {
          return {
            ...oldState,
            coupon: milesStateInfo.coupon,
            milesAmount: milesStateInfo.milesAmount
          }
        })
      }
    }

    setAmountChangeState((oldState) => {
      return {
        ...oldState,
        product: productStateInfo.list
      }
    })

    if (initialProductInfo?.product) {
      const diff = compareProducts(initialProductInfo.product, productStateInfo.list)
      setAmountChangeState((oldState) => {
        return {
          ...oldState,
          diff: diff
        }
      })
    }

  }, [productStateInfo.list]);


  //가격 상태값 변경

  useEffect(() => {
    if (productStateInfo.list.length !== 0) {
      const { totalPrice, defaultDiscountPrice, amountDiscount } = sumTotalPrice(productStateInfo.list);
      setAmountChangeState((oldState) => {
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



  // //쿠폰, 마일리지 컴포넌트에서 상태값 변경시 
  // useEffect(() => {
  //   setAmountChangeState((oldState) => {
  //     return {
  //       ...oldState,
  //       coupon: milesStateInfo.coupon,
  //       milesAmount: milesStateInfo.milesAmount
  //     }
  //   })
  // }, [milesStateInfo.coupon, milesStateInfo.milesAmount])

  //쿠폰, 마일리지 컴포넌트에서 상태값 변경시 
  useEffect(() => {
    if (amountChangeStateInfo?.defaultDiscountPrice && initialProductInfo?.defaultDiscountPrice) {

      if ((amountChangeStateInfo.defaultDiscountPrice - initialProductInfo.defaultDiscountPrice)  >0 && (amountChangeStateInfo.defaultDiscountPrice - initialProductInfo.defaultDiscountPrice) < parseInt(milesStateInfo.milesAmount)) {

        setMilesState((oldState) => {
          return {
            ...oldState,
            milesAmount: amountChangeStateInfo.defaultDiscountPrice - initialProductInfo.defaultDiscountPrice
          }
        })
        setAmountChangeState((oldState) => {
          return {
            ...oldState,
            coupon: milesStateInfo.coupon,
            milesAmount: amountChangeStateInfo.defaultDiscountPrice - initialProductInfo.defaultDiscountPrice
          }
        })
      } else {
        setAmountChangeState((oldState) => {
          return {
            ...oldState,
            coupon: milesStateInfo.coupon,
            milesAmount: milesStateInfo.milesAmount
          }
        })
      }
    }
  }, [milesStateInfo.coupon, milesStateInfo.milesAmount])





  const handleSubmitAmountChange = () => {

    if (amountChangeStateInfo.product.length === 0) {
      alert("수량은 선택해주세요.");
      return false;
    }

    if (checkAmount() === true) {
      alert("수량이 변경되지 않았습니다.");
      return false;
    }

    setAmountChangeState((oldState) => {
      return {
        ...oldState,
        beforeTotalPrice: initialProductInfo.defaultDiscountPrice,
        beforeOrderNo: orderNo
      }
    })
    sumitAmoutChangeRefetch();

  }

  const checkAmount = () => {
    if (amountChangeStateInfo && initialProductInfo) {
      let amoutChangeProduct = amountChangeStateInfo.product;
      let initialProduct = initialProductInfo.product;
      let same = false;
      if (amoutChangeProduct.length === initialProduct.length) {
        for (let i = 0; i < amoutChangeProduct.length; i++) {
          const amountProuct = amoutChangeProduct[i];
          for (let n = 0; n < initialProduct.length; n++) {
            const initProduct = initialProduct[n];
            if (amountProuct.key === initProduct.key) {
              if (amountProuct.amount === initProduct.amount) {
                same = true;
              } else {
                same = false;
                return same;
              }
            }
          }
        }
        return same;
      } else {
        return same;
      }
    }
  }
  

  useEffect(() => {
    console.log('amountChangeStateInfo', amountChangeStateInfo)
  }, [amountChangeStateInfo])


  return (
    <AmountChangeWrapper>
      {orderNo && orderInfo && orderInfo.deliveryDate &&
        <>
          <AmountChangeTitleContainer>
            <BackwardIcon src="/img/mypage/backward_icon.png" width={34} height={34} alt="뒤로가기 아이콘" onClick={() => { Router.push("/mypage") }}></BackwardIcon>
            <AmountChangeTitle>하루 수량 변경</AmountChangeTitle>
          </AmountChangeTitleContainer>
          <AmountChangeNotice>
            {mobile ?
              <p>- 수량 변경이 완료된 이후에는 주문 취소가 불가해요.</p>
              :
              <p>- 수량 변경이 완료된 이후에는 <span>주문 취소가 불가</span>하오니 신중하게 선택해주세요.</p>
            }
            <p>- 수량 변경으로 인한 주문취소는 현키 포인트로만 적립돼요.</p>
            <p>- 하루 전체 주문 취소는 불가하며 <span>하루 쉬어가기</span>만 가능해요.</p>
            <p>- 현키 포인트는 추가주문 및 정기구독 결제시에만 사용 가능해요.</p>
          </AmountChangeNotice>
          <AmountChangeContainer>
            <DateLabel>{new Date(orderInfo.deliveryDate).getDate()}일({orderInfo.deliveryDow}요일)</DateLabel>
            {initialProductInfo?.product &&
              <Product selectedDowList={[orderInfo.deliveryDow]} initialProductInfo={initialProductInfo?.product} stateKey={orderNo} title={false} closeBtn={false}></Product>
            }
            <Payment
              stateKey={`${orderNo}`}
              redirectUrl={`/order/${orderNo}`}
              failRedirectUrl={`/order/${orderNo}`}
            ></Payment>
            {(amountChangeStateInfo?.defaultDiscountPrice - initialProductInfo?.defaultDiscountPrice) <= 0 === false &&
              <MilesContainer>
                <Title>할인적용</Title>
                <MilesReg stateKey={orderNo}></MilesReg>
              </MilesContainer>
            }
            {initialProductInfo && amountChangeStateInfo &&
              <OrderPaymentInfo initialProductInfo={initialProductInfo} paymentDetails={amountChangeStateInfo}></OrderPaymentInfo>
            }
            <AmoutChangeButtonContainer>
              <MypageButton onClick={handleSubmitAmountChange}>하루수량 변경하기</MypageButton>
            </AmoutChangeButtonContainer>
          </AmountChangeContainer>
        </>
      }
    </AmountChangeWrapper >
  );
}

export default AmountChange;



