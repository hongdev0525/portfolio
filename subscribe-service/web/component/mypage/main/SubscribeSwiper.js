import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import MainCalendar from "./MainCalendar";
import OrderCount from "./OrderCount";
import DateInfo from "./DateInfo";
import SlideHeader from "./SlideHeader";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { fontWeight, device } from "component/common/GlobalComponent";
import { useEffect, useState } from "react";
const SubscribeSwiperWrapper = styled.div`
height: 100%;
padding-top: 20px;
  
`
const SubscribeSwiperContainer = styled.div`
  
`
const SubscribeInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media ${device.mobileL} {
   flex-direction: column;
  }
 
`

const SubscribeInfoSwiper = styled(Swiper)`
  .swiper-slide{
    padding-bottom: 10px;
  }
`


const TestSwiper = styled(Swiper)`
  .swiper-slide{
    width: 500px;
    height: 500px;
    background-color: beige;

}
`
const SwiperPagination = styled.div`
    display: flex;
    justify-content: flex-end;
    top:0;
    right: 0;
    height: 20px;
    span{
      display: block;
      width: 15px;
      height: 15px;
      background-color: #F1F1F5;
      opacity: 1;
      cursor: pointer;
      margin-left: 10px;
    }
    .swiper-pagination-bullet-active{
      display: block;
      width: 15px;
      height: 15px;
      background-color: #DC5F00;
    }
`

function SubscribeSwiper() {
  const [subscribeList, setSubscribeList] = useState();
  SwiperCore.use([Pagination]);

  const getSubscribeList = async () => {
    return await customAxios({
      method: "get",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/list`,
    })

  }
  useQuery('getSubscribeList', getSubscribeList, {
    onSuccess: (res) => {
      setSubscribeList(res.data.data);
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })

  useEffect(() => {
    console.log('subscribeList', subscribeList)

  }, [subscribeList])

  SwiperCore.use([Pagination]);

  return (
    <SubscribeSwiperWrapper>
      {/* {subscribeList && subscribeList.length !== 0 && */}
      <SubscribeSwiperContainer>
        <SubscribeInfoSwiper
          slidesPerView={1}
          spaceBetween={25}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
            renderCustom: function (index, className) {
              return '<span className="' + className + '">' + (index + 1) + '</span>';
            }
          }}
        >
          <SwiperPagination className="swiper-pagination"></SwiperPagination>
          {/* <SwiperPagination className="swiper-pagination"></SwiperPagination> */}
          {subscribeList && subscribeList.map((subscribe, index) => {
            console.log("subscribeList", subscribeList);
            if (subscribe.subsType === "subscribe") {
              return (
                <SwiperSlide key={`slide${subscribe.subsNo}`} >
                  <div key={`slide${subscribe.subsNo}`}>
                    <SlideHeader subsNo={subscribe.subsNo} statusCode={subscribe.statusCode} regDate={subscribe.regDate}></SlideHeader>
                    <MainCalendar subsNo={subscribe.subsNo} dows={subscribe.dows} key={`calendar${subscribe.subsNo}`} nextDeliveryDate={subscribe.nextDeliveryDate}></MainCalendar>
                    <SubscribeInfoContainer>
                      <OrderCount subscribeInfo={subscribe}></OrderCount>
                      <DateInfo subscribeInfo={subscribe}></DateInfo>
                    </SubscribeInfoContainer>
                  </div>
                </SwiperSlide>
              )
            }
          })}
          {
            (subscribeList?.length === 0 || subscribeList == null) &&
            <SwiperSlide >
              <div>
                <SlideHeader ></SlideHeader>
                <MainCalendar ></MainCalendar>
              </div>
            </SwiperSlide>
          }
        </SubscribeInfoSwiper>
      </SubscribeSwiperContainer>
      {/* } */}

    </SubscribeSwiperWrapper >
  );
}

export default SubscribeSwiper;