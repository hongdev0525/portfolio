import styled from "styled-components";
import Router from "next/router";
import Image from "next/image";
import { device, fontWeight } from "component/common/GlobalComponent";
import { useEffect } from "react";

const MypageTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 67px;
  border-bottom: 1px solid #232323;
  @media ${device.mobileL} {
    border-bottom:none;
    padding-bottom: 0;
    margin-bottom: 40px;
  }
`
const MypageTitleContainer = styled.div`
  text-align: center;
  width: 100%;
`
const MypageTitleText = styled.div`
    font-size: 28px;
    line-height: 33px;
    font-weight: ${fontWeight("medium")};
    margin-bottom: 12px;
    @media ${device.mobileL} {
      font-size: 20px;
      font-weight: ${fontWeight("regular")};
  }
`


const BackwardImageContainer = styled.div`
  position: absolute;
  left:0;
  top:17px;
  transform: translate(0%,-50%);
  img{
    cursor: pointer;
  }
  @media ${device.mobileL} {
    img{
      width: 28px;
      height: 28px;
    } 
  }
`



function MypageTitle({ url, title, backward = true }) {


  const handleRouter = (url) => {
    location.href = url
  }

  return (
    <MypageTitleWrapper>
      {backward === true &&
        <BackwardImageContainer>
          <Image
            src={"/img/mypage/backward_icon.png"}
            width={34} height={34}
            alt="뒤로가기 아이콘"
            // onClick={() => { Router.push(url, undefined, { shallow: true }) }}
            onClick={()=>handleRouter(url)}
          ></Image>
        </BackwardImageContainer>
      }
      <MypageTitleContainer>
        <MypageTitleText>{title}</MypageTitleText>
      </MypageTitleContainer>
    </MypageTitleWrapper>

  );
}

export default MypageTitle;