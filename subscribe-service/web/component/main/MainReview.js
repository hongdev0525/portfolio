import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FeatureBtn } from "./CommonComponent";
import { fontWeight } from "component/common/GlobalComponent";
import { useRef } from "react";
import Router from "next/router";
import { device } from "component/common/GlobalComponent";



const MainReviewWrapper = styled.div`
  margin : 156px 0 157px;
  @media ${device.mobileL} {
    margin-bottom: 58px;
    margin: 110px 0;
  }
`
const MainReviewContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`
const ReviewTitle = styled.div`
  margin-bottom: 124px;
  text-align: center;
  @media ${device.mobileL} {
    margin-bottom: 58px;
  }
`
const Title = styled.div`
  font-size: 56px;
  line-height: 62.4px;
  font-weight: ${fontWeight("bold")};
  margin-bottom: 24px;
  @media ${device.mobileL} {
    font-size: 25px;
    line-height: 35px;
    margin-bottom: 4px;
  }
`

const SubTitle = styled.div`
  font-size: 24px;
  line-height: 31.2px;
  font-weight: ${fontWeight("medium")};
  color:#B0B0B0;
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 25px;
  }
`
const ReviewSwiperContainer = styled.div`
  position: relative;

`
const ReviewSwiper = styled(Swiper)`

  width: 1232px;
  padding: 0 15px 106px;
  
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #fcfcfc;
    border-radius: 20px;
    padding: 34px 32px;
    width: 344px;
    box-shadow: 3px 3px 20px rgba(0,0,0,0.1);
  }
  @media ${device.mobileL} {
    width: 280px;
    height: 100%;
    padding-bottom:45px;
  .swiper-slide {
    padding: 22px 0;
    width: 255px;
    box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  }
  }
`

const ReviewImgContainer = styled.div`
  border-radius: 10px;
  margin-bottom: 20px;
  @media ${device.mobileL} {
    display: flex ;
    justify-content: center;
    margin-bottom: 15px;
    &>img{
        width: 207px;
        height: 207px;
    }
  }
`

const ContentContainer = styled.div`
  width: 280px;
  @media ${device.mobileL} {
    width: 207px;
  }
`
const ReviewText = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: ${fontWeight("regular")};
  margin-bottom: 8px;
  white-space: pre-wrap;
  @media ${device.mobileL} {
    margin-bottom: 2px;
  }
`
const ReviewDate = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: ${fontWeight("semiBold")};
  color:#A9A9A8;
  text-align: right;
  @media ${device.mobileL} {
    font-size: 12px;
    line-height: 16.5px;
  }
`
const ReviewScoreContainer = styled.div`
  text-align: center;
  & > span{
    font-size: 14px;
    line-height: 20px;
    font-weight: ${fontWeight("semiBold")};
    color:#A9A9A8;
  }
  @media ${device.mobileL} {
    & > span{
      font-size: 12px;
      line-height: 16.5px;
    }
  }
`
const ReviewScore = styled.div``

const NavigationContainer = styled.div`
  width: 110%;
    display: flex;
    justify-content: space-between;
  `
const NavigationNext = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  right: -60px;
  background-repeat: no-repeat;
  background-image: url("/img/main/web/right_arrow.png");
  cursor: pointer;
  @media ${device.mobileL} {
   right: -30px;
   & img{
      width: 20px;
      height: 20px;
   }
  }
`

const NavigationPrev = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  left: -60px;
  background-repeat: no-repeat;
  background-image: url("/img/main/web/right_arrow.png");
  cursor: pointer;
  @media ${device.mobileL} {
    left: -30px;
    & img{
      width: 20px;
      height: 20px;
   }
  }
  `

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
`

function MainReview() {
  const reviewSwiperRef = useRef();
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);


  return (
    <MainReviewWrapper>
      <MainReviewContainer>
        <ReviewTitle>
          <Title>고객후기</Title>
          <SubTitle>현키를 찐으로 즐기는 다른 구독자님의 이야기를 들어보세요 </SubTitle>
        </ReviewTitle>
        <ReviewSwiperContainer>
          <ReviewSwiper
            slidesPerView="auto"
            breakpoints={{
              475: {
                slidesPerView: 3,
                spaceBetween: 28
              }
            }}
            spaceBetween={25}
            speed={1000}
            loop={true}
            loopFillGroupWithBlank={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: navigationPrevRef,
              nextEl: navigationNextRef,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            centeredSlides={true}
            onBeforeInit={(swiper) => {
              reviewSwiperRef.current = swiper;
              // // Delay execution for the refs to be defined
              // // Override prevEl & nextEl now that refs are defined
              // swiper.params.navigation.prevEl = navigationPrevRef.current
              // swiper.params.navigation.nextEl = navigationNextRef.current

              // // Re-init navigation
              // swiper.navigation.destroy()
              // swiper.navigation.init()
              // swiper.navigation.update()
            }}
          >
            <SwiperSlide>
              <ContentContainer>
                <ReviewImgContainer>
                  <Image src="/img/main/web/reviewImgTmp.png" width={280} height={280} alt="리뷰 이미지"></Image>
                </ReviewImgContainer>
                <ReviewText>
                  1) 반찬가게보다 다양한 메뉴를 저렴한 금액으로 구매가능해요.
                  2) 1~2인 가구에 적합한 양으로 구성되어있어요
                  3) 이른아침부터 배송을 해주셔서 출근 전 먹어볼수있다.(한번도 늦은적이없어요..♥ 4) 무엇보다..맛이 있어요..*__*!!
                </ReviewText>
                <ReviewDate>2023.01.14</ReviewDate>
                <ReviewScoreContainer>
                  <span>반찬 월간 정기구독</span>
                  <ReviewScore>
                  </ReviewScore>
                </ReviewScoreContainer>
              </ContentContainer>
            </SwiperSlide>
            <SwiperSlide>
              <ContentContainer>
                <ReviewImgContainer>
                  <Image src="/img/main/web/reviewImgTmp.png" width={280} height={280} alt="리뷰 이미지"></Image>
                </ReviewImgContainer>
                <ReviewText>
                  1) 반찬가게보다 다양한 메뉴를 저렴한 금액으로 구매가능해요.
                  2) 1~2인 가구에 적합한 양으로 구성되어있어요
                  3) 이른아침부터 배송을 해주셔서 출근 전 먹어볼수있다.(한번도 늦은적이없어요..♥ 4) 무엇보다..맛이 있어요..*__*!!
                </ReviewText>
                <ReviewDate>2023.01.14</ReviewDate>
                <ReviewScoreContainer>
                  <span>반찬 월간 정기구독</span>
                  <ReviewScore>
                  </ReviewScore>
                </ReviewScoreContainer>
              </ContentContainer>
            </SwiperSlide>
            <SwiperSlide>
              <ContentContainer>
                <ReviewImgContainer>
                  <Image src="/img/main/web/reviewImgTmp.png" width={280} height={280} alt="리뷰 이미지"></Image>
                </ReviewImgContainer>
                <ReviewText>
                  1) 반찬가게보다 다양한 메뉴를 저렴한 금액으로 구매가능해요.
                  2) 1~2인 가구에 적합한 양으로 구성되어있어요
                  3) 이른아침부터 배송을 해주셔서 출근 전 먹어볼수있다.(한번도 늦은적이없어요..♥ 4) 무엇보다..맛이 있어요..*__*!!
                </ReviewText>
                <ReviewDate>2023.01.14</ReviewDate>
                <ReviewScoreContainer>
                  <span>반찬 월간 정기구독</span>
                  <ReviewScore>
                  </ReviewScore>
                </ReviewScoreContainer>
              </ContentContainer>
            </SwiperSlide>
            <SwiperSlide>
              <ContentContainer>
                <ReviewImgContainer>
                  <Image src="/img/main/web/reviewImgTmp.png" width={280} height={280} alt="리뷰 이미지"></Image>
                </ReviewImgContainer>
                <ReviewText>
                  1) 반찬가게보다 다양한 메뉴를 저렴한 금액으로 구매가능해요.
                  2) 1~2인 가구에 적합한 양으로 구성되어있어요
                  3) 이른아침부터 배송을 해주셔서 출근 전 먹어볼수있다.(한번도 늦은적이없어요..♥ 4) 무엇보다..맛이 있어요..*__*!!
                </ReviewText>
                <ReviewDate>2023.01.14</ReviewDate>
                <ReviewScoreContainer>
                  <span>반찬 월간 정기구독</span>
                  <ReviewScore>
                  </ReviewScore>
                </ReviewScoreContainer>
              </ContentContainer>
            </SwiperSlide>
            <SwiperSlide>
              <ContentContainer>
                <ReviewImgContainer>
                  <Image src="/img/main/web/reviewImgTmp.png" width={280} height={280} alt="리뷰 이미지"></Image>
                </ReviewImgContainer>
                <ReviewText>
                  1) 반찬가게보다 다양한 메뉴를 저렴한 금액으로 구매가능해요.
                  2) 1~2인 가구에 적합한 양으로 구성되어있어요
                  3) 이른아침부터 배송을 해주셔서 출근 전 먹어볼수있다.(한번도 늦은적이없어요..♥ 4) 무엇보다..맛이 있어요..*__*!!
                </ReviewText>
                <ReviewDate>2023.01.14</ReviewDate>
                <ReviewScoreContainer>
                  <span>반찬 월간 정기구독</span>
                  <ReviewScore>
                  </ReviewScore>
                </ReviewScoreContainer>
              </ContentContainer>
            </SwiperSlide>
          </ReviewSwiper>
          <NavigationContainer>
            <NavigationPrev onClick={() => reviewSwiperRef.current?.slidePrev()}>
              <Image src="/img/main/web/left_arrow.png" width={24} height={24} alt="화살표 이미지"></Image>
            </NavigationPrev>
            <NavigationNext onClick={() => reviewSwiperRef.current?.slideNext()}>
              <Image src="/img/main/web/right_arrow.png" width={24} height={24} alt="화살표 이미지"></Image>
            </NavigationNext>
          </NavigationContainer>
        </ReviewSwiperContainer>
      </MainReviewContainer>
      <BtnContainer>
        <FeatureBtn type="button" onClick={() => Router.push("/subscribe")}>구독하기</FeatureBtn>
      </BtnContainer>
    </MainReviewWrapper >
  );
}

export default MainReview;