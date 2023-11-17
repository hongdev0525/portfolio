import { use, useEffect } from "react";
import styled from "styled-components";
import { pauseModalState, subscribeCalendarState } from "../../../state/mypage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fontWeight } from "component/common/CommonComponent";
import { common } from "public/js/common";
import Image from "next/image";
import { useState } from "react";
import MenuListOfDay from "./MenuListOfDay";
import Router from "next/router";
import { device } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
const DailyOrderInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin: 22px  0 18px 30px;
  @media ${device.mobileL} {
      margin: 0;
      margin-top: 60px;

  }
`
const DailyOrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  @media ${device.mobileL} {
      margin: 28px 0 24px;
  }
`;

const DayilyProductContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  @media ${device.mobileL} {
      margin-bottom: 24px;
  }
`
const DayilyProductInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  @media ${device.mobileL} {
      margin-bottom: 24px;
  }
`

const DayilyProduct = styled.div`
  text-align: center;
  p{
    margin-top: 13px;
  }
  @media ${device.mobileL} {
     p{
      font-size: 14px;
      font-weight: ${fontWeight("regular")};
     }
  }
`;
const DateLabel = styled.div`
  font-size: 16px;
  font-weight: ${fontWeight("semiBold")};
  margin-bottom: 10px;
`

const DailyOrderButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  @media ${device.mobileL} {
    margin-top: 40px;
  }
`
const DailyOrderButton = styled.button`
   width: 128px;
  height: 43px;
  background-color: #fefefe;
  color:#767676;
  font-size: 16px;
  font-weight: ${fontWeight("regular")};
  border: 1px solid #DBDBDB;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
  @media ${device.mobileL} {
    width: 114px;
    font-size: 14px;
    
  }
`
const AmountChangeButton = styled(DailyOrderButton)`
  color:#DC5F00;
  border: 1px solid #DC5F00;
  margin-left:20px;
  @media ${device.mobileL} {
    width: 140px;
    margin-top: 0;
  }
`

const SubscribeButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const SubscribeButton = styled(AmountChangeButton)`

`

const StatusLabel = styled.div`
display: flex;
align-items: center;
  p{
    font-size: 16px;
    font-weight:${fontWeight("medium")};
    color:#DC5F00;
    margin-left: 3px;
  }
`


function DailyOrderInfo({ subsNo }) {

  const subscribeCalendarStateInfo = useRecoilValue(subscribeCalendarState(subsNo));
  const [productAmount, setProductAmount] = useState({});
  const setPauseModalState = useSetRecoilState(pauseModalState);
  const [mobile, setMobile] = useState(null);
  const [changeAvailable, setChangeAvailable] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  function getProductQuantities(data) {
    const productQuantities = {};
  
    data.forEach(record => {
      if (record.statusCode === "기존주문" || record.statusCode === "수량추가") {
        const products = record.product.split(",");
        products.forEach(product => {
          const [name, quantity] = product.split("-");
          if (productQuantities[name]) {
            productQuantities[name] += parseInt(quantity);
          } else {
            productQuantities[name] = parseInt(quantity);
          }
        });
      } else if (record.statusCode === "취소수량") {
        const products = record.product.split(",");
        products.forEach(product => {
          const [name, quantity] = product.split("-");
          if (productQuantities[name]) {
            productQuantities[name] -= parseInt(quantity);
          } else {
            productQuantities[name] = -parseInt(quantity);
          }
        });
      }
    });
    const orderInfo = subscribeCalendarStateInfo.orderInfo;
    let productList = "";

    if (orderInfo.length !== 0) {
      const completedOrders = orderInfo.filter(order => order.statusCode === "기존주문");
      console.log("completedOrders", completedOrders);
      if (completedOrders.length !== 0) {
        productList = completedOrders[0].product.split(",");
        setSelectedOrderNo(completedOrders[0].orderNo)
      }
    }

    setProductAmount(productQuantities);
  
    return productQuantities;
  }
  

  const countProductAmount = () => {
    let productList = "";
    const orderInfo = subscribeCalendarStateInfo.orderInfo;
    if (orderInfo.length !== 0) {
      const completedOrders = orderInfo.filter(order => order.statusCode === "기존주문");
      console.log("completedOrders", completedOrders);
      if (completedOrders.length !== 0) {
        productList = completedOrders[0].product.split(",");
        setSelectedOrderNo(completedOrders[0].orderNo)
      }
    }
    const tmp = {};
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i].split("-");
      tmp[product[0]] = product[1];
    }
    setProductAmount(tmp);
  };


  // const countProductAmount = () => {
  //   const productList = subscribeCalendarStateInfo.orderInfo.length !== 0 ? subscribeCalendarStateInfo.orderInfo[0].product.split(",") : "";
  //   const tmp = {};
  //   for (let i = 0; i < productList.length; i++) {
  //     const product = productList[i].split("-");
  //     tmp[product[0]] = product[1];
  //   }
  //   setProductAmount(tmp);
  // }

  const handlePauseModal = () => {
    setPauseModalState((oldState) => {
      return {
        ...oldState,
        modalActive: true,
        subsNo: subsNo
      }
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }
  const deliveryAvailableCheck = () => {
    /**
     * 조건
     * 1. 일수 차이가 이틀이상의 주문
     * 2. 오늘 시간이 16:00이전
     * 3. 일수만 따지면 안되고 월도 따져야한다. 
     */
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const selectedDate = new Date(subscribeCalendarStateInfo.selectedDate);
    const limitMonth = selectedDate.getMonth() + 1;
    const limitHours = today.getHours();
    const dayDiff = selectedDate.getDate() - today.getDate();
    if (limitMonth >= thisMonth) {
      if (dayDiff > 2) {
        setChangeAvailable(true);
        return true;
      } else if (dayDiff === 2) {
        if (limitHours < 16) {
          return true
        } else {
          return false;

        }
      } else {
        return false;

      }
    } else {
      return false;
    }

  }

  useEffect(() => {
    // countProductAmount();
    console.log("dafadsfsaf", getProductQuantities(subscribeCalendarStateInfo.orderInfo));
  }, [subscribeCalendarStateInfo])

  useEffect(() => {
    setChangeAvailable(common.deliveryAvailableCheck(subscribeCalendarStateInfo.selectedDate));
    setMobile(isMobile);
  }, [])

  useEffect(() => {
    if (subscribeCalendarStateInfo?.selectedDate != null) {
      setChangeAvailable(common.deliveryAvailableCheck(subscribeCalendarStateInfo.selectedDate));
    }
  }, [subscribeCalendarStateInfo.selectedDate])

  useEffect(() => {
    // console.log('productAmount', productAmount)
  }, [productAmount])

  useEffect(() => {
    console.log('changeAvailable', changeAvailable)
  }, [])

  const DateLabeling = ({ dateTime }) => {
    const uniqueStatusCodes = [...new Set(subscribeCalendarStateInfo.statusCodes)];

    const tmp = uniqueStatusCodes.map((statusCode, index) => {
      if (statusCode === "쉬어가기") {
        return (
          <StatusLabel key={index}>
            <Image key={`datelabelimg${index}`} src="/img/mypage/pause_icon.png" width={8} height={8} alt="쉬어가기 아이콘"></Image>
            <p>쉬어가기</p>
          </StatusLabel>
        );
      } else if (statusCode === "수량변경") {
        return (
          <StatusLabel key={index}>
            <Image key={`datelabelimg${index}`} src="/img/mypage/countchange_icon.png" width={8} height={8} alt="수량변경 아이콘"></Image>
            <p>수량변경</p>
          </StatusLabel>
        );
      }
      return null;
    });

    return tmp;
  };
  // const DateLabeling = ({ dateTime }) => {
  //   let tmp = [];
  //   subscribeCalendarStateInfo.statusCodes.forEach((statusCode, index) => {
  //     // 중복되지 않은 status code를 tmp 배열에 추가
  //     if (statusCode === "쉬어가기") {
  //       tmp.push(
  //         <StatusLabel key={index}>
  //           <Image key={`datelabelimg${index}`} src="/img/mypage/pause_icon.png" width={8} height={8} alt="쉬어가기 아이콘"></Image>
  //           <p>쉬어가기</p>
  //         </StatusLabel>
  //       );
  //     } else if (statusCode === "수량변경") {
  //       tmp.push(
  //         <StatusLabel>
  //           <Image key={`datelabelimg${index}`} src="/img/mypage/countchange_icon.png" width={8} height={8} alt="수량변경 아이콘"></Image>
  //           <p>수량변경</p>
  //         </StatusLabel>
  //       );
  //     }
  //   });
  //   return tmp;
  // };

  useEffect(() => {
    console.log('subscribeCalendarStateInfo', subscribeCalendarStateInfo)
  }, [subscribeCalendarStateInfo])

  return (
    <DailyOrderInfoWrapper>
      <DateLabel>{subscribeCalendarStateInfo.selectedDate?.getDate()}일({common.getDayOfWeek(subscribeCalendarStateInfo.selectedDate)})</DateLabel>
      {subscribeCalendarStateInfo.statusCodes &&
        <DateLabeling></DateLabeling>
      }
      <DailyOrderInfoContainer >
        <DayilyProductInfoContainer>
          {subscribeCalendarStateInfo.orderInfo.length !== 0 ?
            <DayilyProductContainer>
              <DayilyProduct>
                <Image src="/img/mypage/banchan_icon.png" width={60} height={39} alt="반찬 아이콘"></Image>
                <p>반찬{productAmount["반찬"] ? productAmount["반찬"] : 0}개</p>
              </DayilyProduct>
              <DayilyProduct>
                <Image src="/img/mypage/soup_icon.png" width={60} height={60} alt="국 아이콘"></Image>
                <p>국{productAmount["국"] ? productAmount["국"] : 0}개</p>
              </DayilyProduct>
              <DayilyProduct>
                <Image src="/img/mypage/salad_icon.png" width={60} height={60} alt="샐러드 아이콘"></Image>
                <p>샐러드{productAmount["샐러드"] ? productAmount["샐러드"] : 0}개</p>
              </DayilyProduct>
            </DayilyProductContainer>
            :
            <DayilyProductContainer>
              <DayilyProduct>
                <Image src="/img/mypage/banchan_icon.png" width={60} height={39} alt="반찬 아이콘"></Image>
                <p>반찬 0개</p>
              </DayilyProduct>
              <DayilyProduct>
                <Image src="/img/mypage/soup_icon.png" width={60} height={60} alt="국 아이콘"></Image>
                <p>국 0개</p>
              </DayilyProduct>
              <DayilyProduct>
                <Image src="/img/mypage/salad_icon.png" width={60} height={60} alt="샐러드 아이콘"></Image>
                <p>샐러드 0개</p>
              </DayilyProduct>
            </DayilyProductContainer>
          }
          <MenuListOfDay subsNo={subsNo}></MenuListOfDay>
        </DayilyProductInfoContainer>
        {subscribeCalendarStateInfo.orderInfo && subscribeCalendarStateInfo.orderInfo.length !== 0 && changeAvailable === true && subscribeCalendarStateInfo?.subscribeInfo?.StatusCode == "normal" &&
          <DailyOrderButtonGroup >
            <DailyOrderButton type="button" onClick={handlePauseModal}>하루 쉬어가기</DailyOrderButton>
            <AmountChangeButton type="button" onClick={() => {
              Router.push(`/mypage/order/${selectedOrderNo}`)
            }}> {mobile ? "하루 수량 변경하기" : "하루 수량 변경"}</AmountChangeButton>
          </DailyOrderButtonGroup>
        }
        {!subsNo &&
          <SubscribeButtonContainer>
            <SubscribeButton type="button" onClick={() => {
              Router.push("/subscribe")
            }}>구독하기</SubscribeButton>
          </SubscribeButtonContainer>

        }
        {
          subscribeCalendarStateInfo?.subscribeInfo?.StatusCode == "cancel" &&

          <SubscribeButtonContainer>
            <SubscribeButton type="button" onClick={() => {
              Router.push("/subscribe")
            }}>다시 배송받기</SubscribeButton>
          </SubscribeButtonContainer>
        }

      </DailyOrderInfoContainer>
    </DailyOrderInfoWrapper >
  );
}

export default DailyOrderInfo;