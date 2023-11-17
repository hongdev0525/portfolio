import styled from "styled-components";
import ProductSlide from "./ProductSlide";
import { fontWeight } from "../common/CommonComponent";
import { device } from "component/common/GlobalComponent";
import { common } from "public/js/common";
import Image from "next/image";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

const MainProductWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 250px 0 150px 0;
  @media ${device.mobileL} {
    padding: 167px 0 74px 0;
  }
  
`
const MainProductContainer = styled.div`
  position: relative;
`

const ProductInfo = styled.div`
  
  @media ${device.mobileL} {
    display: flex;
    padding: 0 24px;
  }
`

const BanchanInfo = styled(ProductInfo)`
  display: flex;
  justify-content: flex-end;
  width: 50%;
  margin-top: 50px;
  margin-bottom: 110px;
  @media ${device.mobileL} {
    width: 100%;
    margin :  56px 0 180px;
    justify-content: space-between;

  }
 
`;

const SoupInfo = styled(ProductInfo)`
display: flex;
justify-content: flex-start;
width: 50%;
margin-left:auto;
margin-top:130px;
margin-bottom: 110px;
@media ${device.mobileL} {
    width: 100%;
    justify-content: space-between;

  }

`;
const SaladInfo = styled(ProductInfo)`
display: flex;
justify-content: center;
width: 50%;
margin: 0 auto;
margin-top:114px;
@media ${device.mobileL} {
    width: 100%;
    justify-content: space-between;
    margin-top:41px;

  }
`;


const ProductInfoContainer = styled.div`
  margin-right: 84px;
  @media ${device.mobileL} {
    margin-right: 0px;
  }
`
const ProductSubtitle = styled.div`
  font-size: 36px;
  font-weight: ${fontWeight("semiBold")};
  line-height: 47px;
  color:#A9A9A8;
  margin-bottom: 4px;

  @media ${device.mobileL} {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 7px;
  }

`
const ProductTitle = styled.div`
  font-size: 72px;
  font-weight: ${fontWeight("bold")};
  line-height: 74px;
  margin-bottom: 24px;
  @media ${device.mobileL} {
    font-size: 40px;
    line-height: 56px;
    margin-bottom: 12px;
    }
  `
const ProductContext = styled.div`
    font-size: 24px;
    font-weight: ${fontWeight("bold")};
    line-height: 33px;
    white-space: pre-wrap;
    @media ${device.mobileL} {
    font-size: 14px;
    line-height: 19px;
    }
`
const ProductPriceContainer = styled.div`
  display: flex;
  flex-direction:column;
  justify-content: flex-end;
  &>span{
    display: block;
    font-size: 36px;
    font-weight: ${fontWeight("semiBold")};
    line-height: 47px;
    color:#A9A9A8;
    margin-bottom: 8px;
    text-decoration: line-through;
  }
  &>p{
    font-size: 72px;
    font-weight: ${fontWeight("bold")};
    line-height: 74px;
    color:#DC5F00;

  }
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 19px;
        &>span{
        font-size: 18px;
        line-height: 23.5px;
        margin-bottom: 4px;
        text-align: right;
      }
      &>p{
        font-size: 36px;
        line-height: 48px;
      }
    }
`


const ChopStick = styled(Image)`
  position: absolute;
  top :-50px;
  left:50%;
  transform: translate(-60%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 225px;
    height: 47px;
    top: 0px;
    left: 45%;
  }
`
const BanchanBlink = styled(Image)`
  position: absolute;
  top :-80px;
  left:55%;
  transform: translate(70%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 60px;
    height: 90px;
    top: 10px;
    left: 60%;
  }
`
const Spoon = styled(Image)`
  position: absolute;
  bottom : 340px;
  left:50%;
  transform: translate(-50%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 215px;
    height: 45px;
    bottom: 47%;
    left: 50%;
  }
`
const SoupBlink = styled(Image)`
  position: absolute;
  top :30px;
  left:35%;
  transform: translate(-80%,0%);
  z-index: 10;
  
`

const BorderImg = styled(Image)`
  position: absolute;
  top : -9px;
  left:50%;
  transform: translate(-50%,10%);
  z-index: 1;
  @media ${device.mobileL} {
    width: 287px;
    height: 199px;
    top:14%
  }
`
const Fork = styled(Image)`
  position: absolute;
  top : 0px;
  right:50%;
  transform: translate(80%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 184px;
    height: 162px;
    right: 48%;
    top:9%
  }
`
const SaladBlink = styled(Image)`
  position: absolute;
  top :160px;
  left:43%;
  transform: translate(-80%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 140px;
    height: 82px;
    left: 40%;
    top:15%
  }
`
const ChopstickBlink = styled(Image)`
  position: absolute;
  top :160px;
  left:43%;
  transform: translate(-80%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 327px;
    height: 104px;
    top:1%;
    left:80%
  }
`

const SpoonBorder = styled(Image)`
  position: absolute;
  top :160px;
  left:43%;
  transform: translate(-80%,0%);
  z-index: 1;
  @media ${device.mobileL} {
    width: 270px;
    height: 250px;
    top:13%;
    left:68%
  }
`
const ForkBlink = styled(Image)`
  position: absolute;
  top :160px;
  left:43%;
  transform: translate(-80%,0%);
  z-index: 10;
  @media ${device.mobileL} {
    width: 327px;
    height: 157px;
    top:3%;
    left:75%
  }
`

function MainProduct() {
  const [mobile, setMobile] = useState(null);

  const productInfo = [{
    type: "banchan",
    imgCount: 10,
    title: "수제 반찬",
    subtitle: "매일 다른 5가지",
    context: `받아보면 놀라실걸요?
어마어마하고 푸짐한 양과 맛!`,
    price: 9900,
    discountPrice: 8500
  },
  {
    type: "soup",
    imgCount: 10,
    title: "수제국",
    subtitle: "입맛에 따라 골라먹는",
    context: `식탁에 빠질 수 없는! 
현키가 자부하는 맛!`,
    price: 9900,
    discountPrice: 8500
  },
  {
    type: "salad",
    imgCount: 10,
    title: "샐러드",
    subtitle: "매일 다른 토핑",
    context: `365일 질리지 않게
매일 다른 맛으로 다이어트하기!`,
    price: 8900,
    discountPrice: 7500
  }]

  useEffect(() => {
    setMobile(isMobile)
  }, [])
  return (
    <MainProductWrapper>
      <MainProductContainer>
        {
          !mobile ?
            <>
              <ChopStick src="/img/main/web/chopstick.png" width={488} height={116} alt="젖가락 그림"></ChopStick>
              <BanchanBlink src="/img/main/web/banchanBlink.png" width={156} height={264} alt="반짝 그림"></BanchanBlink>
            </>
            : <ChopstickBlink src="/img/main/web/chopstick_blink.png" width={327} height={104} alt="반짝 그림"></ChopstickBlink>
        }

        {mobile != null &&
          <ProductSlide productType={productInfo[0].type} count={productInfo[0].imgCount} imgSize={mobile ? [178, 178] : [400, 400]} centerSize={mobile ? [240, 240] : [550, 550]} reverseDir={false}></ProductSlide>
        }
        <BanchanInfo>
          <ProductInfoContainer>
            <ProductSubtitle> {productInfo[0].subtitle}</ProductSubtitle>
            <ProductTitle>{productInfo[0].title}</ProductTitle>
            <ProductContext>{productInfo[0].context}</ProductContext>
          </ProductInfoContainer>
          <ProductPriceContainer>
            <span>{common.numberCommaFormat(productInfo[0].price)}원</span>
            <p>{common.numberCommaFormat(productInfo[0].discountPrice)}원</p>
          </ProductPriceContainer>
        </BanchanInfo>
      </MainProductContainer>
      <MainProductContainer>
        {
          !mobile ?
            <>
              <Spoon src="/img/main/web/spoon.png" width={488} height={116} alt="숟가락 그림"></Spoon>
              <BorderImg src="/img/main/web/soupBorder.png" width={730} height={580} alt="테두리 그림"></BorderImg>
            </>
            :
            <SpoonBorder src="/img/main/web/spoon_border.png" width={730} height={580} alt="테두리 그림"></SpoonBorder>
        }


        {!mobile &&
          <SoupBlink src="/img/main/web/soupBlink.png" width={200} height={150} alt="반짝 그림"></SoupBlink>
        }
        {mobile != null &&
          <ProductSlide productType={productInfo[1].type} count={productInfo[1].imgCount} imgSize={mobile ? [178, 130] : [450, 330]} centerSize={mobile ? [255, 195] : [600, 500]} reverseDir={true}></ProductSlide>
        }
        <SoupInfo>
          <ProductInfoContainer>
            <ProductSubtitle> {productInfo[1].subtitle}</ProductSubtitle>
            <ProductTitle>{productInfo[1].title}</ProductTitle>
            <ProductContext>{productInfo[1].context}</ProductContext>
          </ProductInfoContainer>
          <ProductPriceContainer>
            <span>{common.numberCommaFormat(productInfo[1].price)}원</span>
            <p>{common.numberCommaFormat(productInfo[1].discountPrice)}원</p>
          </ProductPriceContainer>
        </SoupInfo>
      </MainProductContainer>
      <MainProductContainer>
        {!mobile ?
          <>
            <Fork src="/img/main/web/fork.png" width={472} height={380} alt="포크 그림"></Fork>
            <SaladBlink src="/img/main/web/saladBlink.png" width={200} height={150} alt="반짝 그림"></SaladBlink>
          </>
          :
          <ForkBlink src="/img/main/web/fork_blink.png" width={327} height={157} alt="반짝 그림"></ForkBlink>
        }

        {mobile != null &&
          <ProductSlide productType={productInfo[2].type} count={productInfo[2].imgCount} imgSize={mobile ? [178, 104] : [450, 264]} centerSize={mobile ? [225, 152] : [600, 352]} reverseDir={false}></ProductSlide>
        }
        <SaladInfo>
          <ProductInfoContainer>
            <ProductSubtitle> {productInfo[2].subtitle}</ProductSubtitle>
            <ProductTitle>{productInfo[2].title}</ProductTitle>
            <ProductContext>{productInfo[2].context}</ProductContext>
          </ProductInfoContainer>
          <ProductPriceContainer>
            <span>{common.numberCommaFormat(productInfo[2].price)}원</span>
            <p>{common.numberCommaFormat(productInfo[2].discountPrice)}원</p>
          </ProductPriceContainer>
        </SaladInfo>
      </MainProductContainer>
    </MainProductWrapper>
  );
}

export default MainProduct;