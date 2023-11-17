import AddAddress from "component/address/AddAddress";
import styled, { css } from "styled-components";
import { Button, fontWeight, InputGroup, Title, device } from "component/common/GlobalComponent";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { addressState, addressInputState } from '../../state/address';
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useEffect, useState } from "react";
import { common } from "public/js/common";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import Router from "next/router";
const SimpleSignupWrapper = styled.div`
  margin:80px 0;
  @media ${device.mobileL} {
    /* margin:40px 0; */
  }
`
const SimpleSignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 596px;
  margin-bottom: 60px;  
  @media ${device.mobileL} {
    box-shadow: none;
    width: auto;
    margin: 0 24px;
  }
`

const SimpleSignupTitle = styled(Title)`

`
const FunnelTitle = styled(Title)`
    font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  margin-bottom: 10px;
  @media ${device.mobileL} {
   font-size:20px;
   line-height: 28px;
   padding:0;
  }
`
const FunnelContainer = styled.div`
  width: 100%;
  padding: 30px 0 ;
  border-bottom: 1px solid #232323;
  margin-bottom: 30px;
  @media ${device.mobileL} {
    padding: 30px 0 ;
    margin-bottom: 30px;
  }
`
const FunnelList = styled.ul`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
const FunnelInfoGroup = styled.li`
  flex-basis:49%;
  @media ${device.mobileL} {
    flex-basis: 50%;
    margin: 6px 0;
  }
`
const FunnelInfo = styled.div`
  display: flex;
  align-items: center;
`

const FunnelRadioContainer = styled.div`
  position:relative;
  height: 25px;
  width: 25px;
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
  }
`
const FunnelRadio = styled.input`
  position: absolute;
  opacity: 0;
  height: 25px;
  width: 25px;
  border:1px solid #DC5F00;
  z-index: 10;
  cursor: pointer;
  :checked ~ span{
    background-color: #DC5F00;
  }
  :checked ~ span:after{
    display: block;
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
    :checked ~ span:after{
      left: 6px;
      top: 2px;
    }
  }
`
const CheckMark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  transition: all .4s ease;
  border-radius: 5px;
  :after{
    content: "";
    position: absolute;
    display: none;
  }
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
  }
`

const FunnelRadioLable = styled.label`
  font-size: 18px;
  line-height: 36px;
  font-weight: ${fontWeight("regular")};
  margin-left: 16px;
  cursor: pointer;
  @media ${device.mobileL} {
   font-size:14px;
   line-height: 18px;
   margin-left: 8px;
  }
`

const SaveSimpleSignup = styled(Button)`
  width:100%;
  height: 56px;
  border-radius: 10px;
  font-size: 18px;
  line-height: 38px;
  font-weight: ${fontWeight("bold")};
  @media ${device.mobileL} {
    width:100%;
    height: 36px;
    font-size: 14px;
    line-height: 15px;
    font-weight: ${fontWeight("semiBold")};
    margin: 0 24px;
  }
`
const RecommnedCodeInputGroupContainer = styled.div`
  border-bottom: 1px solid #232323;
  padding-bottom: 60px;
  width: 100%;
  margin-bottom: 30px;
  @media ${device.mobileL} {
  padding-bottom: 30px;
    margin-bottom: 20px;
  }
`

const RecommnedCodeInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  @media ${device.mobileL} {
   flex-direction: column;
  }
`

const RecommnedCodeInputLabelContainer = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  @media ${device.mobileL} {
    height: 100%;
    margin-bottom: 8px;
  }
`

const RecommnedCodeInputLabel = styled.label`
  font-size: 16px;
  line-height: 22px;
  font-weight: ${fontWeight("semiBold")};
  width: 142px;
  span{
    color:#DC5F00;
  }
  @media ${device.mobileL} {
    font-size: 14px;
    font-weight: ${fontWeight("regular")};
  }
`

const RecommnedCodeInputWrapper = styled.div`
  width: 100%;
  
`
const RecommnedCodeInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  @media ${device.mobileL} {
    margin-bottom: 10px;
  }
`

const RecommnedCodeInput = styled.input`
  width: ${props => props.wide === true ? "100%" : "448px"};
  height: 56px;
  border: 1px solid #DBDBDB;
  border-radius: 5px;
  padding: 0 10px;
  outline-color: #DC5F00;
  ::placeholder{
    font-size: 16px;
    font-weight: ${fontWeight("regular")};
  }
  ${props => {
    return props.readOnly === true ?
      css`
        background-color : #F1F1F5;
        outline: none;
        `
      :
      ''
  }}

@media ${device.mobileL} {
  font-size: 14px;
  width: ${props => props.wide === true ? "100%" : "100%"};
  height:37px;
    ::placeholder{
      font-size: 14px;
      font-weight: ${fontWeight("regular")};
    }
}
`


const RecommnedCodeButton = styled.button`
  width:137px;
  height:56px;
  border-radius: 5px;
  margin-left: 12px;
  font-size: 16px;
  font-weight: ${fontWeight("semiBold")};
  cursor: pointer;
    ${props => {

    switch (props.buttontype) {
      case "outline":
        return css`
      background-color: #fefefe;
      border:1px solid #DC5F00;
      color:#DC5F00;
    `
      case "primary":
        return css`
        background-color: #DBDBDB;
        border:1px solid #cfcfcf;
        color:#a9a9a9;
      `
      case "negative":
        return css`
      background-color: #DC5F00;
      border:1px solid #DC5F00;
      color:#fefefe;
    `
      default:
        return css`
        background-color: #fefefe;
        border:1px solid #DBDBDB;
        color:#DBDBDB;
      `
    };
  }
  }


  @media ${device.mobileL} {
      width: 90px;
      height: 48px;
      font-size:14px;
      font-weight:${fontWeight("regular")};
  }
`



const RecoomendCodeNotice = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight("regular")};
  color:#DC5F00;
  margin-top: 4px;
  padding-left: 10px;
  @media ${device.mobileL} {
      font-size:14px;
      padding-left: 10px;
  }
`

const SignupButton = styled.button`
  width:137px;
  height:56px;
  border-radius: 5px;
  margin-left: 12px;
  font-size: 16px;
  font-weight: ${fontWeight("semiBold")};
  cursor: pointer;
    ${props => {

    switch (props.buttontype) {
      case "outline":
        return css`
      background-color: #fefefe;
      border:1px solid #DC5F00;
      color:#DC5F00;
    `
      case "primary":
        return css`
        background-color: #DBDBDB;
        border:1px solid #cfcfcf;
        color:#a9a9a9;
      `
      case "negative":
        return css`
      background-color: #DC5F00;
      border:1px solid #DC5F00;
      color:#fefefe;
    `
      default:
        return css`
        background-color: #fefefe;
        border:1px solid #DBDBDB;
        color:#DBDBDB;
      `
    };
  }
  }


  @media ${device.mobileL} {
      width: 90px;
      height: 52px;
      font-size:14px;
      font-weight:${fontWeight("regular")};
  }
`


const SignupDoneWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  
`

const SignupDoneContainer = styled.div`
   display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: #fefefe;
    border-radius: 5px;
    z-index: 10;
    margin-top: 300px;
    padding:20px 20px 48px;
    width: 487px;
      height: 402px;


      span{
        display: block;
        font-size: 18px;
        font-weight: ${fontWeight("regular")};
        color:#767676;
      }
      p{
        font-size: 18px;
        font-weight: ${fontWeight("regular")};
        line-height: 21px;
        color:#DC5F00;
        text-align: center;
      }

      @media ${device.mobileL} {
      width: 295px;
      height: 348px;
    padding:20px 20px 24px;

      span{
        font-size: 14px;
      }
    
  }
`

const SignupDoneImageContainer = styled.div`
  margin-bottom: 30px;
      @media ${device.mobileL} {
  margin-bottom: 24px;
  img{
    width: 142px ;
        height: 155px;
  }
     
  }
`
const SignupDoneBackground = styled.div`
   position: absolute;
  top:0;
  left:0;
  background-color: #232323;
  width: 100%;
  height: 100%;
  z-index: 5;
  opacity: .8;
`
const SignupDoneButtonContainer = styled.div`
  width: 100%;
  text-align: center;

 
`
const SignupDoneButton = styled(SignupButton)`
font-size: 16px;
  font-weight: ${fontWeight("bold")};
  width: 228px;
  height: 53px;
  color:#fefefe;
  background-color: #DC5F00;
  border-radius: 10px;
  margin:18px auto 0 ;
  box-shadow: 5px 5px 10px rgba(0,0,0,.1);
  @media ${device.mobileL} {
    width: 182px;
    height: 48px;
    font-weight: ${fontWeight("medium")};

  }
  
`


const SignupDoneCloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width:100%;
  
`

const SignupDoneCloseButton = styled(Image)`
    cursor: pointer;
  @media ${device.mobileL} {
      width: 10px;
      height: 10px;
  }
`


function SimpleSignup() {
  const addressStateInfo = useRecoilValue(addressState('simpleSignup'));
  const setAddressState = useSetRecoilState(addressState('simpleSignup'));
  const addressInputStateInfo = useRecoilValue(addressInputState('simpleSignup'));
  const setAddressInputState = useSetRecoilState(addressInputState('simpleSignup'));
  const [addressAvailable, setAddressAvailable] = useState(null);
  const [funnelInfo, setFunnelInfo] = useState(null);
  const [signupDone, setSignupDone] = useState(null);
  const [mobile, setMobile] = useState(null);

  const [recommendCode, setRecommendCode] = useState({
    value: null,
    validation: null,
  });

  const saveSimpleSignup = async () => {
    const inputDataList = {};
    Object.keys(addressInputStateInfo).forEach((key) => {
      inputDataList[key] = addressInputStateInfo[key].value;
    })
    return await customAxios({
      method: "POST",
      data: { funnel: funnelInfo, addressInfo: inputDataList, recommendCode: recommendCode.value },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/simplesignup`,
    });
  };

  const recommendCodeAvailableCheck = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: { recommendCode: recommendCode?.value },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/signup/recommendcodecheck`,
    })
  }

  const { refetch: saveSimpleSignupRefetch } = useQuery("saveSimpleSignup", saveSimpleSignup, {
    enabled: false,
    onSuccess: (res) => {
      const response = res.data
      if (response.status === "success") {
        // common.setItemWithExpireTime("loggedIn", true, 12960000)
        // location.href = "/login"
        setSignupDone(true);
        setAddressAvailable(response.available);
        window.scrollTo({
          top: 0,
          left: 50
        });
      } else {
        alert("저장에 실패했습니다.");
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  });

  const { refetch: recommendCodeAvailableCheckRefetch } = useQuery('recommendCodeAvailableCheck', () => recommendCodeAvailableCheck(), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data.status === "not exist") {
        setRecommendCode({
          ...recommendCode,
          validation: false,
        });
      } else if (res.data.status === "exist") {
        setRecommendCode({
          ...recommendCode,
          validation: true,
        });
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })



  const handleSaveSimpleSignup = () => {

    setAddressState((oldState) => {
      return {
        ...oldState,
        addressAvailable: true
      }
    })
    if (funnelInfo == null || funnelInfo.length === 0) {
      alert("유입경로를 선택해주세요.")
      return false;
    }

    if (recommendCode.value != null) {
      if (recommendCode.value?.length !== 0 && (recommendCode?.validation === false || recommendCode?.validation == null)) {
        alert("추천인 코드확인을 해주세요.");
        return false;
      }
    }

    // if (addressStateInfo.addressAvailable === false) {
    //   alert("배송불가 지역입니다.")
    //   return false;
    // }
    for (let key in addressInputStateInfo) {
      if (addressInputStateInfo[key].validation === '' || addressInputStateInfo[key].validation === false) {
        alert("배송지 정보를 정확히 입력해주세요.")
        return false
      }
    }

    saveSimpleSignupRefetch();
  }

  const handelFunnelInfo = (e) => {
    setFunnelInfo(e.currentTarget.value);
  }
  const handelRecommendCode = (e) => {
    const target = e.currentTarget;
    setRecommendCode((oldState) => {
      return {
        ...oldState,
        value: target.value
      }
    }
    );
  }

  useEffect(() => {
    setMobile(isMobile);
  }, [])

  useEffect(() => {
    console.log('addressInputStateInfo.address', addressInputStateInfo.address)
    if (addressStateInfo.addressAvailable === false) {
      setAddressState((oldState) => {
        return {
          ...oldState,
          addressAvailable: true,
        }
      })
    }
  }, [addressStateInfo.addressAvailable])

  useEffect(() => {
    console.log('addressInputStateInfo', addressInputStateInfo)
  }, [addressInputStateInfo])
  return (
    <SimpleSignupWrapper>
      <SimpleSignupContainer>
        <SimpleSignupTitle>추가 정보입력</SimpleSignupTitle>
        <FunnelContainer>
          <FunnelTitle>유입경로 입력</FunnelTitle>
          <FunnelList>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="인스타그램 광고" onChange={handelFunnelInfo} id="insta"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="insta">인스타그램 광고</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="당근마켓 광고" onChange={handelFunnelInfo} id="carrot"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="carrot">당근마켓 광고</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="유튜브 광고" onChange={handelFunnelInfo} id="utube"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="utube">유튜브 광고</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="아파트 단지 커뮤니티" onChange={handelFunnelInfo} id="community"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="community">아파트 단지 커뮤니티</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="아파트 엘리베이터 광고" onChange={handelFunnelInfo} id="elevator"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="elevator">아파트 엘리베이터 광고</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="맘카페 / 지역카페" onChange={handelFunnelInfo} id="cafe"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="cafe">맘카페 / 지역카페</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="전단지" onChange={handelFunnelInfo} id="leaflet"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="leaflet">전단지</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="현수막" onChange={handelFunnelInfo} id="banner"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="banner">현수막</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="지인추천" onChange={handelFunnelInfo} id="friend"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="friend">지인추천</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
            <FunnelInfoGroup>
              <FunnelInfo>
                <FunnelRadioContainer>
                  <FunnelRadio type="radio" name="funnel" value="TV 광고" onChange={handelFunnelInfo} id="tv"></FunnelRadio>
                  <CheckMark></CheckMark>
                </FunnelRadioContainer>
                <FunnelRadioLable htmlFor="tv">TV 광고</FunnelRadioLable>
              </FunnelInfo>
            </FunnelInfoGroup>
          </FunnelList>
        </FunnelContainer>
        <RecommnedCodeInputGroupContainer>
          <RecommnedCodeInputGroup>
            <RecommnedCodeInputLabelContainer>
              <RecommnedCodeInputLabel htmlFor="phone">추천인 코드</RecommnedCodeInputLabel>
            </RecommnedCodeInputLabelContainer>
            <RecommnedCodeInputWrapper>
              <RecommnedCodeInputContainer>
                <RecommnedCodeInput
                  name="recommendCode"
                  title="추천인코드"
                  id="recommendCode"
                  type="text"
                  placeholder="추천인 코드를 입력해 주세요"
                  onChange={handelRecommendCode}
                ></RecommnedCodeInput>
                <RecommnedCodeButton buttontype={"outline"} onClick={recommendCodeAvailableCheckRefetch}>코드확인</RecommnedCodeButton>
              </RecommnedCodeInputContainer>
              {recommendCode?.validation === false &&
                <RecoomendCodeNotice>존재하지않는 추천인코드 입니다</RecoomendCodeNotice>
              }
              {recommendCode?.validation === true &&
                <RecoomendCodeNotice>사용가능한 추천인코드 입니다</RecoomendCodeNotice>
              }
            </RecommnedCodeInputWrapper>
          </RecommnedCodeInputGroup>
        </RecommnedCodeInputGroupContainer>
        <AddAddress activeSaveBtn={false} stateKey={"simpleSignup"}></AddAddress>
        <SaveSimpleSignup type="button" onClick={handleSaveSimpleSignup}>저장하기</SaveSimpleSignup>
      </SimpleSignupContainer>
      {signupDone === true &&
        <SignupDoneWrapper>
          {addressAvailable === true &&
            <SignupDoneContainer>
              <SignupDoneCloseButtonContainer>
                <SignupDoneCloseButton src="/img/main/web/crossIcon.png" width={19} height={19} alt="닫기 아이콘" onClick={() => { Router.push("/") }}></SignupDoneCloseButton>
              </SignupDoneCloseButtonContainer>
              <SignupDoneImageContainer>
                <Image src="/img/signupDone.png" width={172} height={187} alt="회원가입 완료 이미지"></Image>
              </SignupDoneImageContainer>
              {mobile === false ? <span>회원가입이 완료되었습니다. 맛있는 식사를 즐겨볼까요?</span> : <><span>회원가입이 완료되었습니다.</span><span>맛있는 식사를 즐겨볼까요?</span></>}
              <SignupDoneButtonContainer>
                <SignupDoneButton typeof="button" onClick={() => { Router.push("/subscribe") }}>구독하러가기</SignupDoneButton>
              </SignupDoneButtonContainer>
            </SignupDoneContainer>
          }
          {addressAvailable === false &&
            <SignupDoneContainer>
              <SignupDoneCloseButtonContainer>
                <SignupDoneCloseButton src="/img/main/web/crossIcon.png" width={19} height={19} alt="닫기 아이콘" onClick={() => { Router.push("/") }}></SignupDoneCloseButton>
              </SignupDoneCloseButtonContainer>
              <SignupDoneImageContainer>
                <Image src="/img/signupDone2.png" width={172} height={187} alt="회원가입 완료 이미지"></Image>
              </SignupDoneImageContainer>
              {mobile === false ? <span>이 주소는 배송불가 지역이예요. 현세권 신청하러 가볼까요?</span> : <><span>이 주소는 배송불가 지역이예요.</span><span>현세권 신청하러 가볼까요?</span></>}
              <SignupDoneButtonContainer>
                <SignupDoneButton typeof="button" onClick={() => { Router.push("https://doorkitchen.info/dooropen") }}>현세권 신청하기</SignupDoneButton>
              </SignupDoneButtonContainer>
            </SignupDoneContainer>
          }
          <SignupDoneBackground></SignupDoneBackground>
        </SignupDoneWrapper>
      }
    </SimpleSignupWrapper>
  );
}

export default SimpleSignup;