import styled from "styled-components";
import { fontWeight } from "../common/CommonComponent";
import Image from "next/image";
import DaumPostcode from "react-daum-postcode";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import Router from "next/router";
import { device } from "component/common/GlobalComponent";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";

const DeliveryAvailableWrapper = styled.div`
  /* position: relative; */
  display: flex;
  justify-content:center;
  align-items: center;
  flex-direction: column;
  background-color: #fcfcfc;
  padding: 170px 0 186px;
  @media ${device.mobileL} {
    padding: 50px 0 63px;
  }
`

const TitleGroup = styled.div`
  text-align: center;
  margin-bottom: 72px;
  @media ${device.mobileL} {
  margin-bottom: 12px;
  }
`
const Title = styled.h2`
  font-size: 48px;
  font-weight: ${fontWeight("bold")};
  line-height: 62px;
  @media ${device.mobileL} {
    font-size: 20px;
    font-weight: ${fontWeight("semiBold")};
    line-height: 28px;
  }
`
const Subtitle = styled(Title)`
  font-weight: ${fontWeight("medium")};
  
`
const ImgContainer = styled.div`
  cursor: pointer;
  @media ${device.mobileL} {
    &>img{
        width: 255px;
        height: 33px;
    }
  }
`

const DaumPostContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 900;
`

const DaumPostBackground = styled.div`
  position: absolute;
  width: 100%;
  height:100%;
  z-index: 800;
  background-color: rgba(0,0,0,.3);
`

const AvailableContainer = styled(DaumPostContainer)`
   @media ${device.mobileL} {
      margin-top: 32px;
  }
`
const Available = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
  height: 500px;
  z-index: 900;
  margin-bottom: 24px;
  background-color: #fcfcfc;
  border-radius: 10px;
  border: 4px solid #DC5F00;
  @media ${device.mobileL} {
      width: 90%;
      height: 50% !important;
      padding: 15px;
      margin: 8px 24px;
      &>img{
        width: 120px;
        height: 160px;
        object-fit: contain;
      }
  }
`

const AvailableBackground = styled(DaumPostBackground)`
`

const AvailableText = styled.div`
  text-align: center;
  margin: 24px 0;
  font-size:24px;
  line-height: 27px;
  font-weight: ${fontWeight("medium")};
  & p{
    &>span{
      color:#DC5F00;
      font-size: 40px;
      line-height: 56px;
      font-weight: ${fontWeight("bold")};

    }
  }
  @media ${device.mobileL} {
      font-size:18px;
      & p{
        &>span{
          font-size: 28px;
          line-height: 28px;
        }
      }
  }

`

const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  @media ${device.mobileL} {
      margin-bottom: 24px;
  }
`


const CloseIcon = styled(MdClose)`
  width: 30px;
  height: 30px;
  z-index: 500;
  filter: brightness(0) invert(1);
`

const DaumPost = styled(DaumPostcode)`
  width: 50% !important;
  height: 50% !important;
  z-index: 900;
  margin-bottom: 16px;
  /* padding: 0 24px; */
  @media ${device.mobileL} {
      width: 100% !important;
      height: 400px !important;
  }
`;


const AvailableButton = styled.button`
  width: fit-content;
  height: fit-content;
  font-size: 24px;
  font-weight: ${fontWeight("medium")};
  padding: 10px 20px;
  border: none;
  background-color: #DC5F00;
  color:#fcfcfc;
  border-radius: 10px;
  cursor: pointer;
`




function DeliveryAvailable() {
  const [addressModal, setAddressModal] = useState(false);
  const [availableModal, setAvailableModal] = useState(false);
  const [searchAddress, setSearchAddress] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [available, setAvailable] = useState(null);
  const isAvailableAddress = async () => {
    return await customAxios({
      method: "GET",
      params: { roadAddress: searchAddress },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/main/addressavailable`,
    })
  }

  useQuery(['isAvailableAddress', searchAddress], isAvailableAddress,
    {
      enabled: searchAddress != null,
      retry: false,
      onSuccess: (res) => {
        const response = res.data;
        setAvailableModal(true);
        if (response.status === "unavailable") {
          setAvailable(false);
        } else {
          setAvailable(true);
        }
      },
      onError: (error) => {
        console.error(error);
      }
    })



  const handlePostModal = () => {
    setAddressModal(true);
  }

  const handleModalClose = () => {
    setAddressModal(false);
  }
  const handleAvailableModalClose = () => {
    setSearchAddress(null);
    setAvailableModal(false);
  }

  const handlePostComplete = (data) => {
    setSearchAddress(data.roadAddress);
    setAddressModal(false);
  }

  useEffect(()=>{
    setMobile(isMobile);
  },[])

  return (
    <DeliveryAvailableWrapper>
      <TitleGroup>
        <Title>우리 아파트가 배송가능 지역인지</Title>
        <Subtitle>확인해보세요</Subtitle>
      </TitleGroup>
      <ImgContainer onClick={handlePostModal}>
        <Image quality={100} src={`/img/main/web/${mobile==true?"m_":""}deliveryAvailable.png`} width={780} height={108} alt="배송가능지역 이미지"></Image>
      </ImgContainer>
      {addressModal == true &&
        <DaumPostContainer>
          <DaumPost onComplete={handlePostComplete}></DaumPost>
          <CloseButton onClick={handleModalClose}><CloseIcon color="white"></CloseIcon></CloseButton>
          <DaumPostBackground onClick={handleModalClose}></DaumPostBackground>
        </DaumPostContainer>
      }
      {availableModal == true &&
        <AvailableContainer>
          <Available>
            {available === false ?
              <>
                <Image quality={100} src="/img/main/web/sad.png" width={180} height={240} alt="배송지역확인 사진"></Image>
                <AvailableText>
                  <p>이 주소는 <span>배송불가</span> 지역입니다.</p>
                  <p>최대한 빨리 배송 가능하도록 노력할게요!</p>
                </AvailableText>
                <AvailableButton type="button" onClick={() => Router.push("https://doorkitchen.info/dooropen")}>현세권 신청하기</AvailableButton>
              </>
              :
              <>
                <Image quality={100} src="/img/main/web/boo.png" width={180} height={210} alt="배송지역확인 사진"></Image>
                <AvailableText>
                  <p>이 주소는 <span>배송가능</span> 지역입니다!</p>
                  <p>바로 맛있는 식사를 즐겨볼까요?</p>
                </AvailableText>
                <AvailableButton type="button" onClick={() => Router.push("/subscribe")}>구독하러하기</AvailableButton>
              </>
            }
          </Available>
          <CloseButton onClick={handleAvailableModalClose}><CloseIcon color="white"></CloseIcon></CloseButton>
          <AvailableBackground onClick={handleAvailableModalClose}></AvailableBackground>
        </AvailableContainer >
      }
    </DeliveryAvailableWrapper>
  );
}

export default DeliveryAvailable;