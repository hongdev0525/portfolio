import styled from "styled-components";
import { DayContent, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ko from "date-fns/locale/ko";
import { format } from 'date-fns';
import { useQuery } from 'react-query'
import { customAxios } from "../../../public/js/customAxios";
import { useEffect, useState } from "react";
import { ShadowBox, device } from "../../common/GlobalComponent";
import { subscribeCalendarState } from "../../../state/mypage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { common } from "../../../public/js/common";
import Image from "next/image";
import { fontWeight } from "component/common/CommonComponent";
import { isMobile } from "react-device-detect";
import { v1 } from 'uuid'

const SubscribeCalendarWrapper = styled.div`
width: 414px;
@media ${device.mobileL} {
   width: 100%;
  }
`

const SubscribeCalendarContainer = styled(ShadowBox)`
  display: flex;
  justify-content: center;
  padding: 30px 16px;
  margin: 8px 0 4px;
  background-color: #fefefe;
  border: 1px solid #DBDBDB;
  @media ${device.mobileL} {
    border:none;
    padding: 0px;
    box-shadow: none;
    margin: 0;
  }
  `


const SubscribeCalendar = styled(DayPicker)`
  margin: 0;
  --rdp-cell-size: 55px;
  font-size: 17px;
  .rdp-caption_label{
  font-size: 16px;
  }
  .rdp-head_cell{
    font-size: 17px;
  }
  .rdp-button{
    border-radius: 0 !important;
  }
  .rdp-day_selected{
    border-radius: 5px !important;
    background-color:#F1F1F5;
  }
  .rdp-day{
  
  }
  .rdp-cell{
    vertical-align: middle;
  }
 
  @media ${device.mobileL} {
    --rdp-cell-size: 45px;
    font-size: 15px;

  }
`

const Day = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 0;
  width: 100%;
  height: 100%;

`

const DayLabelContainer = styled.div`
  width: 100%;
  display: flex;
`

const LabelContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 14px;
  @media ${device.mobileL} {
    font-size: 12px;
    margin-top: 6px;
    margin-bottom: 50px;
  }
`

const LabelGroup = styled.div``

const Label = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  font-size:14px;
  font-weight: ${fontWeight("regular")};
  p{
    margin-left: 2px;
  }
`

const DotsGroup = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`


const Dot = styled.span`
  display: inline-block;
  width: 8px;
  height:8px;
  border-radius: 50%;
  margin: 2px 1px;
  background-color: ${props => {
    return props.color ? props.color : "#232323"
  }};

@media ${device.mobileL} {
    width: 4px;
    height:4px;
  }
`


const DateLabelContainer = styled.div`
  min-height: 17px;
  @media ${device.mobileL} {
    min-height: 6px;

  }
  
`
const ProductDotContianer = styled.div`
  width: 100%;
  min-height: 17px;
  @media ${device.mobileL} {
    min-height: 6px;
  }
  
`

function SubscrbieCalendar({ subsNo, dows, nextDeliveryDate }) {
  const [orderList, setOrderList] = useState([]);
  const subscribeCalendarStateInfo = useRecoilValue(subscribeCalendarState(subsNo));
  const selectedDate = useRecoilValue(subscribeCalendarState(subsNo)).selectedDate;
  const setSubscribeCalendarState = useSetRecoilState(subscribeCalendarState(subsNo));
  const [mobile, setMobile] = useState(null);
  const [deliveryDows, setDeliveryDows] = useState(null);

  const getOrderInfo = async () => {

    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo,
        deliveryDate: common.DateFormatting(selectedDate).split(" ")[0]
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/info`,
    })
  }

  const { refetch: getOrderInfoRefetch } = useQuery([`getOrderInfo${subsNo}`, selectedDate], getOrderInfo, {
    enabled: selectedDate != null,
    onSuccess: (res) => {
      const response = res.data;
      setSubscribeCalendarState((oldState) => {
        return {
          ...oldState,
          selectedDate: oldState.selectedDate,
          orderInfo: response.data,
          statusCodes: response.statusCodes,
          subscribeInfo: response.subscribeInfo
        }
      })
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  const getOrderList = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/productkind`,
    })
  }


  useQuery([`getOrderList${selectedDate}`, subsNo], () => getOrderList(), {
    enabled: subsNo != null && selectedDate != null,
    onSuccess: (res) => {
      const response = res.data;
      setOrderList(response.data);
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })




  const getMenu = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        deliveryDate: selectedDate
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/menuofdeliverydate`,
    })
  }


  const { refetch: getMenuRefetch } = useQuery(`getMenu${selectedDate}`, () => getMenu(), {
    enabled: selectedDate != null,
    onSuccess: (res) => {
      const response = res.data;
      setSubscribeCalendarState((oldState) => {
        return {
          ...oldState,
          menuList: response.data
        }
      })
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })



  const ColorDots = ({ productList, dots }) => {

    productList.forEach((product, usedLabelCodes, index) => {
      const label = product.replace(/[0-9\-]/g, '');
      console.log('product', product)
      console.log('usedLabelCodes', usedLabelCodes)
      if (!usedLabelCodes.includes(label)) {
        let color = "";
        if (label === "반찬") {
          color = "#E0633B"
        }
        else if (label === "국") {
          color = "#26486F";
        }
        else if (label === "샐러드") {
          color = "#295632";
        }
        else {
          color = "#232323"
        };
        dots.push(<Dot key={`dot${index}`} color={color}></Dot>);
        usedLabelCodes.push(label);
      }
    })
    return <DotsGroup>{dots}</DotsGroup>
  }


  function getProductQuantities(dateTime, data) {
    const productQuantities = {};

    data.forEach(record => {
      if (dateTime === format(new Date(record.deliveryDate), 'yyyy-MM-dd') && (record.statusCode === "기존주문" || record.statusCode === "수량추가")) {
        const products = record.product.split(",");
        products.forEach(product => {
          const [name, quantity] = product.split("-");
          if (productQuantities[name]) {
            productQuantities[name] += parseInt(quantity);
          } else {
            productQuantities[name] = parseInt(quantity);
          }
        });
      } else if (dateTime === format(new Date(record.deliveryDate), 'yyyy-MM-dd') && record.statusCode === "취소수량") {
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

    return productQuantities;
  }

  const ProductDot = ({ dateTime }) => {
    const usedLabelCodes = [];
    const dots = [];

    const productList = getProductQuantities(dateTime, orderList);
    console.log('productList', Object.keys(productList).length)
    if (Object.keys(productList).length !== 0) {
      console.log("orderList ", dateTime, productList);
    }
    Object.keys(productList).forEach(key => {
      const label = key;
      console.log('key', key)
      if (productList[label] !== 0) {
        console.log('productList[label]', productList[label])
        let color = "";
        if (label === "반찬") {
          color = "#E0633B"
        }
        else if (label === "국") {
          color = "#26486F";
        }
        else if (label === "샐러드") {
          color = "#295632";
        }
        else {
          color = "#232323"
        };
        dots.push(<Dot key={`dot${v1()}_${label}`} color={color}></Dot>);
      }
    })


    // orderList.forEach((order, index) => {
    //   if (dateTime === format(new Date(order.deliveryDate), 'yyyy-MM-dd') && order.statusCode !== "쉬어가기" && order.statusCode !== "취소수량" && order.statusCode !== "구독변경") {
    //     const productList = order.product.split(",");
    //     productList.forEach((product) => {
    //       const label = product.replace(/[0-9\-]/g, '');
    //       if (!usedLabelCodes.includes(label)) {
    //         let color = "";
    //         if (label === "반찬") {
    //           color = "#E0633B"
    //         }
    //         else if (label === "국") {
    //           color = "#26486F";
    //         }
    //         else if (label === "샐러드") {
    //           color = "#295632";
    //         }
    //         else {
    //           color = "#232323"
    //         };
    //         dots.push(<Dot key={`dot${order.orderNo}_${label}`} color={color}></Dot>);
    //         usedLabelCodes.push(label);
    //       }
    //     })
    //   }
    // })
    return <LabelGroup key={`productCalendar${subsNo}`}>{dots}</LabelGroup>

  }

  const DateLabel = ({ dateTime }) => {
    let tmp = [];
    const usedStatusCodes = []; // 중복된 status code를 저장하는 배열
    orderList.forEach((order, index) => {
      if (
        dateTime === format(new Date(order.deliveryDate), 'yyyy-MM-dd') &&
        !usedStatusCodes.includes(order.statusCode) // 중복된 status code를 체크
      ) {
        // 중복되지 않은 status code를 tmp 배열에 추가
        if (order.statusCode === "쉬어가기") {
          tmp.push(
            <Image key={`datelabelimg${index}`} src="/img/mypage/pause_icon.png" width={8} height={8} alt="쉬어가기 아이콘"></Image>
          );
          usedStatusCodes.push(order.statusCode); // 사용된 status code를 usedStatusCodes 배열에 추가
        } else if (order.statusCode === "수량변경") {
          tmp.push(
            <Image key={`datelabelimg${index}`} src="/img/mypage/countchange_icon.png" width={8} height={8} alt="수량변경 아이콘"></Image>
          );
          usedStatusCodes.push(order.statusCode); // 사용된 status code를 usedStatusCodes 배열에 추가
        }
      }
    });

    return tmp;
  };

  // const DateLabel = ({ dateTime }) => {
  //   let tmp = [];
  //   orderList.forEach((order, index) => {
  //     if (dateTime === format(new Date(order.deliveryDate), 'yyyy-MM-dd')) {
  //       if (order.statusCode === "쉬어가기") {
  //         tmp.push(
  //           <Image key={`datelabelimg${index}`} src="/img/mypage/pause_icon.png" width={8} height={8} alt="쉬어가기 아이콘"></Image>
  //         )
  //       } else if (order.statusCode === "수량변경") {
  //         tmp.push(
  //           <Image key={`datelabelimg${index}`} src="/img/mypage/countchange_icon.png" width={8} height={8} alt="수량변경 아이콘"></Image>
  //         )
  //       }
  //     }
  //   })
  //   return tmp
  // }

  const handleDaypicker = (date) => {
    setSubscribeCalendarState((oldState) => {
      return {
        ...oldState,
        selectedDate: date
      }
    })
  }



  useEffect(() => {
    setMobile(isMobile);
  }, [])

  useEffect(() => {
    getOrderInfoRefetch();
    getMenuRefetch();
  }, [selectedDate])


  useEffect(() => {

    console.log('subscribeCalendarStateInfo', subscribeCalendarStateInfo)
  }, [subscribeCalendarStateInfo])

  const DateTime = (props) => {
    const dateTime = format(props.date, 'yyyy-MM-dd');
    return (
      <Day>
        <DateLabelContainer>
          <DateLabel dateTime={dateTime}></DateLabel>
        </DateLabelContainer>
        <time dateTime={dateTime}>
          <DayContent {...props} />
        </time>
        <ProductDotContianer>
          {
            orderList
            &&
            <ProductDot dateTime={dateTime}></ProductDot>
          }
        </ProductDotContianer>
      </Day>
    );
  }

  return (
    <SubscribeCalendarWrapper>
      <DayLabelContainer>
        <Label>
          <Image src="/img/mypage/payday_icon.png" width={8} height={8} alt="정기결제일 아이콘"></Image>
          <p>{mobile ? "결제일" : "정기 결제일"}</p>
        </Label>
        <Label>
          <Image src="/img/mypage/subschange_icon.png" width={8} height={8} alt="구독변경일 아이콘"></Image>
          <p>{mobile ? "구독변경" : "구독 변경일"}</p>
        </Label>
        <Label>
          <Image src="/img/mypage/pause_icon.png" width={8} height={8} alt="쉬어가기 아이콘"></Image>
          <p>쉬어가기</p>
        </Label>
        <Label>
          <Image src="/img/mypage/countchange_icon.png" width={8} height={8} alt="수량변경 아이콘"></Image>
          <p>수량 변경</p>
        </Label>
      </DayLabelContainer>
      {mobile &&
        <LabelContainer>
          <Label>
            <Dot color="#E0633B"></Dot>
            <p>반찬</p>
          </Label>
          <Label>
            <Dot color="#26486F"></Dot>
            <p>국</p>
          </Label>
          <Label>
            <Dot color="#295632"></Dot>
            <p>샐러드</p>
          </Label>
        </LabelContainer>
      }
      <SubscribeCalendarContainer>
        <SubscribeCalendar
          mode="single"
          required
          locale={ko}
          disabled={
            [
              { dayOfWeek: [0, 6] },
            ]
          }
          components={{ DayContent: DateTime }}
          selected={(new Date(selectedDate))}
          defaultSelected={new Date(nextDeliveryDate)}
          onSelect={(e) => handleDaypicker(e)}
        />

      </SubscribeCalendarContainer>
      {!mobile &&
        <LabelContainer>
          <Label>
            <Dot color="#E0633B"></Dot>
            <p>반찬</p>
          </Label>
          <Label>
            <Dot color="#26486F"></Dot>
            <p>국</p>
          </Label>
          <Label>
            <Dot color="#295632"></Dot>
            <p>샐러드</p>
          </Label>
        </LabelContainer>
      }
    </SubscribeCalendarWrapper>
  );
}

export default SubscrbieCalendar;