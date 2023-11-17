import styled from "styled-components";
import Image from "next/image";
import { device,fontWeight } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { useEffect } from "react";
const ProductImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  @media ${device.mobileL} {
   padding: 0 24px 131px;
  }
`

const ProductImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 1532px;
  margin-bottom: 134px;
  @media ${device.mobileL} {
   width: 100%;
   margin-bottom: 28px;
  }
`

const ImgContainer = styled.div`
position: relative;
  width: 636px;
  @media ${device.mobileL} {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction:column;
    width: 100%;
    margin: 0 auto;
  }
`

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media ${device.mobileL} {
      margin-top : 12px;
  }
`

const Img = styled(Image)`
  border-radius: ${props => {
    return `${props.borderradius}px`
  }};

`
const Label = styled.p`
  font-size: 40px;
  line-height: 70px;
  color: #a9a9a8;
  opacity: .5;
  font-weight: ${fontWeight("medium")};
  @media ${device.mobileL} {
    font-size: 12px;
    line-height: 15px;
    opacity: .5;
  }
`

const SideLabel = styled.p`
 font-size: 40px;
  line-height: 70px;
  color: #DC5F00;
  opacity: .5;
  position: absolute;
  right: -70px;
  top:0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
`

const SideImg = styled(Img)`
  position: absolute;
  top:50%;
  left:0;
  transform: translate(0,-50%);
`

const ProductImgContainer02 = styled(ProductImgContainer)`
  justify-content: flex-end;
`

const MobileProductImgContainer02 = styled(ProductImgContainer02)`
  height:360px;
`

const SideLabel02 = styled.p`
  font-size: 40px;
  line-height: 70px;
  color: #a9a9a8;
  opacity: .5;
  position: absolute;
  left:-140px;
  bottom:240px;
  color: #DC5F00;
  transform: rotate(-90deg);
  @media ${device.mobileL} {
    bottom:7px;
    left:22px;
    transform: rotate(0deg);
    font-size:12px;
    line-height:16.5px;
  }
`


const MobileImgContainer02 = styled(ImgContainer)`
      position:absolute;
      top:0;
      left:0;
      display: flex;
      width: 220px;
      height: 250px;
      background-color: rgba(220,95,0,.2);
      &>img{
        position:absolute;
        top:-3px;
        left:22px;
        z-index: 10;
      }
`
const MobileImgContainer03 = styled(ImgContainer)`
     position:absolute;
      bottom:0;
      right:0;
`

function ProductImg() {

  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile)
  }, [])
  return (
    <ProductImgWrapper>
      {!mobile &&
        <>
          <ProductImgContainer>
            <ImgContainer>
              <Img borderradius={20} quality={100} width={636} height={944} src="/img/main/web/productImg01.png" alt="상품 사진"></Img>
              <LabelGroup>
                <Label>sidedishes</Label>
                <Label>soup</Label>
                <Label>salad</Label>
              </LabelGroup>
            </ImgContainer>
            <Img borderradius={20} quality={100} width={766} height={1148} src="/img/main/web/productImg02.png" alt="상품 사진"></Img>
            <SideLabel>DOORKITCHEN</SideLabel>
          </ProductImgContainer>
          <ProductImgContainer02>
            <ImgContainer>
              <SideLabel02>With Family</SideLabel02>
              <SideImg borderradius={20} quality={100} width={636} height={952} src="/img/main/web/productImg03.png" alt="상품 사진"></SideImg>
            </ImgContainer>
            <Img borderradius={20} quality={100} width={1214} height={1282} src="/img/main/web/productImg04.png" alt="상품 사진"></Img>
          </ProductImgContainer02>
        </>
      }
      {
        mobile &&
        <>
          <ProductImgContainer>
            <ImgContainer>
              <Img borderradius={0} quality={100} width={327} height={217} src="/img/main/web/m_productImg01.png" alt="상품 사진"></Img>
              <LabelGroup>
                <Label>sidedishes</Label>
                <Label>soup</Label>
                <Label>salad</Label>
              </LabelGroup>
            </ImgContainer>
          </ProductImgContainer>
          <MobileProductImgContainer02>
            <MobileImgContainer02>
              <Img borderradius={0} quality={100} width={125} height={186} src="/img/main/web/m_productImg03.png" alt="상품 사진"></Img>
              <SideLabel02>With Family</SideLabel02>
            </MobileImgContainer02>
            <MobileImgContainer03>
              <Img borderradius={0} quality={100} width={225} height={250} src="/img/main/web/m_productImg04.png" alt="상품 사진"></Img>
            </MobileImgContainer03>
          </MobileProductImgContainer02>
        </>
      }
    </ProductImgWrapper>
  );
}

export default ProductImg;