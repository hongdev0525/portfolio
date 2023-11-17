import styled from "styled-components";
import Image from "next/image";
import { fontWeight } from "component/common/CommonComponent";
import { device } from "component/common/GlobalComponent";
import { useState } from "react";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF9F5;
  padding: 90px 0 191px;
  @media ${device.mobileL} {
    padding: 35px 29px 110px;
    justify-content: flex-start;
  }
`
const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  @media ${device.mobileL} {
    width: 100%;
    align-items: flex-start;
  }
`
const IconLinkGroupContainer = styled.div`
  width: 302px;
  margin-bottom:84px;
  @media ${device.mobileL} {
    width: 178px;
    margin-bottom:38px;
  }
`
const IconLinkGroup = styled.ul`
  display: flex;
  justify-content: space-between;
`
const IcoonLink = styled.li`
 @media ${device.mobileL} {
    & > img{
      width: 22px;
      height: 22px;
    }
  }
`

const ContactInfoContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 68px;
  @media ${device.mobileL} {
    align-items: flex-start;
    margin-bottom: 27px;

  }

`
const ContactInfoLogo = styled.div`
  font-size: 28px;
  margin-bottom: 32px;
  @media ${device.mobileL} {
    font-size: 11px;
    margin-bottom: 20px;
    & img{
      width: 68px;
      height: 23px;
    }
  }

`
const ContactInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 354px;
  margin-bottom: 12px;
 &>p{
  font-size: 24px ;
  font-weight: ${fontWeight("medium")}
 }
 &>span{
  font-size: 24px ;
  font-weight: ${fontWeight("bold")}
 }
 @media ${device.mobileL} {
    width: 149px;
    margin-bottom: 5px;
    &>img{
        width: 15px;
        height: 15px;
    }
      &>p{
      font-size: 10px ;
      line-height: 16.5px;
    }
    &>span{
      font-size: 10px ;
      font-weight: ${fontWeight("medium")};
      line-height: 16.5px;
    }
  }
`

const CompanyInfoContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 40px;
    @media ${device.mobileL} {
    align-items: flex-start;
    margin-bottom: 32px;
  }
`
const CompanyName = styled.h2`
  font-size: 20px ;
  font-weight: ${fontWeight("semiBold")};
  line-height:28px;
  margin-bottom: 9px;
  @media ${device.mobileL} {
    font-size: 14px ;
    font-weight: ${fontWeight("medium")};
    line-height:25px;
  }
`
const CompanyInfo = styled.p`
  font-size: 16px ;
  font-weight: ${fontWeight("medium")};
  line-height:24px;
  color:#4D4D4D;
  @media ${device.mobileL} {
    font-size: 10px ;
    font-weight: ${fontWeight("regular")};
    line-height:16.5px;
  }
`

const EtcGroupContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  @media ${device.mobileL} {
    margin-bottom: 5px;
  }

`
const EtcGroup = styled.ul`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 533px;
    @media ${device.mobileL} {
      width: 309px;
  }
`
const Etc = styled.li`
  font-size: 16px ;
  font-weight: ${fontWeight("bold")};
  line-height:17px;
  @media ${device.mobileL} {
    font-size: 10px ;
    line-height:16.5px;
  }
`

const CopyRightText = styled.p`
  font-size: 16px ;
  font-weight: ${fontWeight("medium")};
  line-height:17px;
  @media ${device.mobileL} {
    font-size: 10px ;
    font-weight: ${fontWeight("regular")};
    line-height:16.5px;
  }
`

function Footer() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(isMobile);
  }, [])
  return (
    <FooterWrapper>
      <FooterContainer>
        <IconLinkGroupContainer>
          <IconLinkGroup>
            <IcoonLink><a href="https://blog.naver.com/doorkitchen_"><Image quality={100} src="/img/main/web/footerBlogIcon.png" width={44} height={44} alt="블로그 아이콘"></Image></a></IcoonLink>
            <IcoonLink><a href="https://www.instagram.com/doorkitchen_/"><Image quality={100} src="/img/main/web/footerInstaIcon.png" width={44} height={44} alt="인스타 아이콘"></Image></a></IcoonLink>
            <IcoonLink><a href="http://pf.kakao.com/_xkxgUcxb"><Image quality={100} src="/img/main/web/footerKatalkIcon.png" width={44} height={44} alt="카카오톡 아이콘"></Image></a></IcoonLink>
            <IcoonLink><a href="https://www.youtube.com/channel/UCsDF7s2WSY7ZFxBtaRUJ48w"><Image quality={100} src="/img/main/web/footerUtubeIcon.png" width={44} height={44} alt="유튜브 아이콘"></Image></a></IcoonLink>
          </IconLinkGroup>
        </IconLinkGroupContainer>
        <ContactInfoContainer>
          <ContactInfoLogo>
            <Image quality={100} src="/img/main/web/footer_logo.png" width={172} height={58} alt="현관앞키친 아이콘"></Image>
          </ContactInfoLogo>
          <ContactInfo>
            <Image quality={100} src="/img/main/web/footerPhoneIcon.png" width={30} height={30} alt="고객센터 아이콘"></Image>
            <p>고객센터</p>
            <span>070 - 8648 - 2113</span>
          </ContactInfo>
          <ContactInfo>
            <Image quality={100} src="/img/main/web/footerChannelIcon.png" width={30} height={32} alt="고객센터 아이콘"></Image>
            <p>카카오톡 플러스친구</p>
            <span>현관앞키친</span>
          </ContactInfo>
          <ContactInfo></ContactInfo>
        </ContactInfoContainer>
        <CompanyInfoContainer>
          <CompanyName>(주)현관앞마켓</CompanyName>
          {mobile === false &&
            <>
              <CompanyInfo>대표이사 김승준  ｜  개인정보관리책임자 김설지  ｜  Office/Kitchen : 진주시 정촌면 삼일로95번길 50-35</CompanyInfo>
              <CompanyInfo>사업자 등록번호  :  349-81-02289   ｜  통신판매업 신고  :  제 2022-경남진주-0038  ｜  이메일  :  cs@doormarket.info</CompanyInfo>
            </>

          }
          {mobile === true &&
            <>
              <CompanyInfo>대표이사 김승준    </CompanyInfo>
              <CompanyInfo>개인정보관리책임자 김설지    </CompanyInfo>
              <CompanyInfo>Office/Kitchen : 진주시 정촌면 삼일로95번길 50-35   </CompanyInfo>
              <CompanyInfo>사업자 등록번호  :  349-81-02289     </CompanyInfo>
              <CompanyInfo>통신판매업 신고  :  제 2022-경남진주-0038    </CompanyInfo>
              <CompanyInfo>이메일  :  cs@doormarket.info   </CompanyInfo>
            </>
          }
        </CompanyInfoContainer>
        <EtcGroupContainer>
          <EtcGroup>
            <Etc>이용약관</Etc>
            <Etc>개인정보처리방침</Etc>
            <Etc>사업자정보</Etc>
            <Etc>기업제휴문의</Etc>
            <Etc>현관앞파트너스</Etc>
          </EtcGroup>
        </EtcGroupContainer>
        <CopyRightText>COPYRIGHT @ DOOR.MARKET.ALL RIGHTS RESERVED.</CopyRightText>
      </FooterContainer>
    </FooterWrapper>
  );
}

export default Footer;