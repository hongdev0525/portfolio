import styled from "styled-components";
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper";
import Image from "next/image";
import { device } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
import { useState, useEffect } from "react";

const SwiperWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const SwiperContainer = styled(Swiper)`
  width: 100%;
  box-sizing: border-box;
  .swiper-wrapper{
    min-height: 600px;
    align-items: flex-end;

  }
  .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          & >img{
           transition: all .5s ease !important;
          }
      }
  @media ${device.mobileL} {
      .swiper-wrapper{
        min-height: 290px;
        align-items: flex-end;
      }
      .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          & >img{
           transition: all .5s ease !important;
          }
      }
  }
  `
const ProductImage = styled(Image)`
`


function ProductSlide({ productType, count, imgSize, centerSize, reverseDir }) {
  const [mobile, setMobile] = useState(false);
  const imgWidth = imgSize[0];
  const imgHeight = imgSize[1]

  const handleSwiperSlideEnd = (swiper) => {
    const slideIndex = swiper.activeIndex;
    swiper.slides.map((slide, index) => {
      const imgTag = slide.childNodes[0];

      if (index === slideIndex) {
        imgTag.style.width = centerSize[0] + "px";
        imgTag.style.height = centerSize[1] + "px";
      } else {
        imgTag.style.width = imgSize[0] + "px";
        imgTag.style.height = imgSize[1] + "px";
      }
    })
  }
  const handleSwiperSlideStart = (swiper) => {
    swiper.slides.map((slide) => {
      const imgTag = slide.childNodes[0];
      imgTag.style.border = "none"
      imgTag.style.width = imgSize[0] + "px";
      imgTag.style.height = imgSize[1] + "px";
    });
  }

  useEffect(() => {
    setMobile(isMobile)
  }, [])
  return (
    <SwiperWrapper>
      <SwiperContainer
        speed={1500}
        slidesPerView={mobile ? 2.2 : 4.2}
        spaceBetween={mobile ? 40 : 100}
        loop={true}
        loopFillGroupWithBlank={true}
        grabCursor={true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
          reverseDirection: reverseDir
        }}
        modules={[Autoplay, Pagination]}
        centeredSlides={true}
        onSlideChangeTransitionEnd={(swiper) => handleSwiperSlideEnd(swiper)}
        onSlideChangeTransitionStart={(swiper) => handleSwiperSlideStart(swiper)}
      >
        {
          [...Array(count)].map((product, index) => {
            return (<SwiperSlide key={`productSlide - ${productType}${index} `}>
              <ProductImage quality={100} src={`/img/main/web/${productType}${index + 1}.png`} width={imgWidth} height={imgHeight} alt={`productType`}></ProductImage>
            </SwiperSlide>
            )
          })
        }
      </SwiperContainer>

    </SwiperWrapper>
  );
}
export default ProductSlide;