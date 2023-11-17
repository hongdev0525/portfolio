import styled from "styled-components";
import Image from "next/image";
import { useQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { pauseModalState, subscribeCalendarState } from "state/mypage";
import { fontWeight, device } from "component/common/GlobalComponent";
import { common } from "public/js/common";
import { customAxios } from "public/js/customAxios";
import { useEffect } from "react";
import Router from "next/router";
const PauseModalContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
`
const PauseModalBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 585px;
    height: 585px;
    background-color: #fefefe;
    border-radius: 5px;
    z-index: 10;
    margin-top: 300px;
    padding:15px;
    padding-bottom: 40px;
    p{
      font-size: 26px;
      font-weight: ${fontWeight("medium")};
      margin-bottom: 24px;
    }
    span{
      display: block;
      font-size: 22px;
      font-weight: ${fontWeight("regular")};
      color : #A9A9A8;
      margin-bottom:154px;
    }
    
  @media ${device.mobileL} {
      width: 300px;
      height: fit-content;
      font-size: 16px;
      margin-top: 256px;
      margin-bottom: 14px;
      p{
        font-size: 16px;
      }
      span{
        margin-bottom:35px;
        font-size: 14px;
      }
  }
  
`
const PauseModalBackground = styled.div`
  position: absolute;
  top:0;
  left:0;
  background-color: #232323;
  width: 100%;
  height: 100%;
  z-index: 5;
  opacity: .8;
`
const PauseCloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width:100%;
  
`

const PauseCloseButton = styled(Image)`
    cursor: pointer;
  @media ${device.mobileL} {
      width: 10px;
      height: 10px;
  }
`
const DateLabel = styled.div`
  font-size: 30px;
  font-weight: ${fontWeight("semiBold")};
  line-height: 57px;
  margin-top: 90px;
  @media ${device.mobileL} {
    font-size: 16px;
    line-height: 33px;
    margin-top: 0px;
  }
`

const PauseButton = styled.button`
  width: 363px;
  height: 86px;
  background-color: #fefefe;
  border:1px solid #DBDBDB;
  border-radius: 5px;
  font-size: 28px;
  font-weight: ${fontWeight("medium")};
  color:#767676;
  outline: none;
  cursor: pointer;
   @media ${device.mobileL} {
      width: 195px;
      height: 42px;
      font-size: 14px;
  }
`


function PauseModal() {
  const pauseModalStateInfo = useRecoilValue(pauseModalState);
  const setPauseModalState = useSetRecoilState(pauseModalState);
  const subscribeCalendarStateInfo = useRecoilValue(subscribeCalendarState(pauseModalStateInfo.subsNo));

  const pauseOrder = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        deliveryDate: subscribeCalendarStateInfo.selectedDate,
        subsNo: pauseModalStateInfo.subsNo,
        orderNo: subscribeCalendarStateInfo.orderInfo[0].orderNo,
        pauseDeliveryDate: pauseModalStateInfo.pauseDeliveryDate,

      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/pause`,
    })
  }
  const getPauseDate = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        deliveryDate: subscribeCalendarStateInfo.selectedDate,
        subsNo: pauseModalStateInfo.subsNo,
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/getpausedate`,
    })
  }

  const { refetch: pauseOrderRefetch } = useQuery(`pauseOrder${pauseModalStateInfo.deliveryDate}`, pauseOrder, {
    enabled: false,
    onSuccess: (res) => {
      if (res.data.status === "success") {
        alert("변경이 완료되었습니다.");
        setPauseModalState((oldState) => {
          return {
            ...oldState,
            modalActive: false,
          }
        });
        Router.push("/mypage", undefined, { shallow: false })
        // location.href = "/mypage";
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })
  useQuery(`getPauseDate${pauseModalStateInfo.subsNo}`, () => getPauseDate(), {
    onSuccess: (res) => {
      setPauseModalState((oldState) => {
        return {
          ...oldState,
          pauseDeliveryDate: res.data.data
        }
      });
    },
    onError: (error) => {

      console.error("Error Occured : ", error);
    }
  })

  const handlePauseOrder = () => {
    pauseOrderRefetch();
  }

  const handleCloseModal = () => {
    setPauseModalState((oldState) => {
      return {
        ...oldState,
        modalActive: false,
      }
    });
  }

  useEffect(() => {
    console.log('subscribeCalendarStateInfo', subscribeCalendarStateInfo)
  }, [subscribeCalendarStateInfo])


  return (
    <PauseModalContainer>
      <PauseModalBody>
        <PauseCloseButtonContainer>
          <PauseCloseButton src="/img/main/web/crossIcon.png" width={19} height={19} alt="닫기 아이콘" onClick={handleCloseModal}></PauseCloseButton>
        </PauseCloseButtonContainer>
        <DateLabel>{subscribeCalendarStateInfo.selectedDate?.getDate()}일({common.getDayOfWeek(subscribeCalendarStateInfo.selectedDate)})</DateLabel>
        <p>하루 쉬어가기를 하겠습니까?</p>
        <span>{subscribeCalendarStateInfo.selectedDate?.getDate()}일({common.getDayOfWeek(subscribeCalendarStateInfo.selectedDate)})
          배송은 {new Date(pauseModalStateInfo.pauseDeliveryDate).getMonth() + 1}월 {new Date(pauseModalStateInfo.pauseDeliveryDate).getDate()}일(화)에 배송이 됩니다.</span>
        <PauseButton type="button" onClick={handlePauseOrder}>쉬어가기</PauseButton>
      </PauseModalBody>
      <PauseModalBackground></PauseModalBackground>
    </PauseModalContainer>
  );
}

export default PauseModal;