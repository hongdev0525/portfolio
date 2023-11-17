import { fontWeight, device } from "component/common/GlobalComponent";
import styled, { css } from "styled-components";
import AuthPhoneNumber from "./AuthPhoneNumber";
import DaumPostcode from "react-daum-postcode";
import Terms from "./Terms";
import Image from "next/image";
import { useQuery } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useState } from "react";
import { authPhoneState } from '../../state/auth';
import { useEffect } from "react";
import { customAxios } from "public/js/customAxios";
import { termsState } from "state/signup";
import { isMobile } from "react-device-detect";
import { sign } from "crypto";
import Router from "next/router";

const SignupWrapper = styled.div`
  padding:  80px 0 170px;

  @media ${device.mobileL} {
    width: 100%;
    padding:  80px 24px 60px;
  }
`
const SignupContainer = styled.div`
  width: 793px;
  @media ${device.mobileL} {
    width: 100%;
  }
`
const RequiredNotice = styled.div`
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  span{
    color:#DC5F00;
  }
 
  
`
const SignupTitle = styled.div`
    font-size: 28px;
    font-weight: ${fontWeight("medium")};
    text-align: center;
    margin-bottom: 40px;
    @media ${device.mobileL} {
      font-size:20px;
      font-weight:${fontWeight("regular")};
  }
`


const SignupInputGroupWrapper = styled.div`
  padding: 20px 68px 40px;
  border-top: 1px solid #707070;
  border-bottom: 1px solid #707070;
  @media ${device.mobileL} {
    border-top:none;
    padding: 0;
    padding-bottom: 20px;
  }
`
const SignupInputGroupContainer = styled.div`
  margin-bottom: 30px;
  @media ${device.mobileL} {
    margin-bottom: 20px;
  }
`

const SignupInputGroup = styled.div`
  display: flex;
  @media ${device.mobileL} {
   flex-direction: column;
  }
`

const SignupInputLabelContainer = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  @media ${device.mobileL} {
    height: 100%;
    margin-bottom: 8px;
  }
`

const SignupInputLabel = styled.label`
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

const SignInputWrapper = styled.div`
  width: 100%;
  
`
const SignInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  @media ${device.mobileL} {
    margin-bottom: 10px;
  }
`

const SignInput = styled.input`
  width: ${props => props.wide === true ? "100%" : "364px"};
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
    ::placeholder{
      font-size: 14px;
      font-weight: ${fontWeight("regular")};
    }
}
`
const SignupRadioContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap:wrap;
  label{
    margin-right:48px;
  }
  @media ${device.mobileL} {
      font-size: 14px;
   }
`
const FunnelWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap:wrap;
  label{
    margin-right:48px;
  }
`
const FunnelContainer = styled.div`
 min-width: 50%;
 margin-bottom: 8px;
 label{
  margin-right: 0;
 }
 @media ${device.mobileL} {
    font-size: 14px;
  }
`
const SignupRadio = styled.input`
    width: 20px;
    height: 20px;
    border: 1px solid  #BABABA;
    border-radius: 50%;
    margin-right: 6px;
    appearance: none;
    vertical-align: middle;
    cursor: pointer;
    :checked{
      position: relative;
      background-color: #DC5F00;
      border: none;
    }
    :checked::after{
      content: '';
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 12px;
      height: 12px;
      background-color: #DC5F00;
      border: 2px solid #fefefe;
      border-radius: 50%;
    }
   
`



const SingupInputNotice = styled.p`
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

const DaumPost = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 100;
`

const DaumPostCode = styled(DaumPostcode)`
  position: fixed;
  top:30%;
  left:50%;
  transform: translate(-50%,0%);
  width: 758px !important;
  z-index: 3;
  @media ${device.mobileL} {
    width: 100% !important;
    padding:  0 24px;
  }
`

const DaumPostBackground = styled.div`
  position: absolute;
  top:0%;
  left:00%;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  z-index: 1;
`


const ApartmentInput = styled(SignInput)`
  width: 311px;
  @media ${device.mobileL} {
    width: 100%;
  }
`
const UnitInput = styled(SignInput)`
  width: 190px;
  @media ${device.mobileL} {
    width: 70px;
    margin-left: 12px;
  }
`

const PasswordButtonGroup = styled.div`
  display: flex;
  width: 100%;
  @media ${device.mobileL} {  
    margin-top: 0px;
    margin-bottom: 10px;
  }
`
const ExistButton = styled.button`
    width: 50%;
    height: 63px;
    font-size: 18px;
    line-height: 27px;
    font-weight: ${fontWeight("bold")};
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border:none;
    cursor: pointer;

    ${props => props.active == true ?
    css`
        color:#fefefe;
        background-color: #DC5F00;
     `
    :
    css`
        color:#a9a9a8;
        background-color: #fefefe;
        border: 1px solid #A9A9A8;
     `
  }

  @media ${device.mobileL} {  
    font-size: 14px;
    line-height: 10px;
    font-weight: ${fontWeight("medium")};
    width: 50%;
    height: 48px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
`
const NoExistButton = styled(ExistButton)`
    font-size: 14px;
    line-height: 10px;
    font-weight: ${fontWeight("medium")};
    border-radius: 0;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  @media ${device.mobileL} {  
    width: 50%;
    height: 48px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

const SignupRegButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const SignupRegButton = styled(SignupButton)`
  font-size: 16px;
  font-weight: ${fontWeight("bold")};
  width:364px;
  height: 56px;
  border-radius: 10px;
  margin:0 auto;
  @media ${device.mobileL} {
    width: 100%;
    font-weight: ${fontWeight("medium")};

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

function Signup2() {
  const [addressModal, setAddressModal] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const [formData, setFromData] = useState({});
  const authState = useRecoilValue(authPhoneState);
  const [mobile, setMobile] = useState(null);
  const [enterancePwdEixst, setEnterancePwdEixst] = useState(true);
  const [addressAvailable, setAddressAvailable] = useState(null);
  const [submitActive, setSubmitActvie] = useState(false);
  const [signupDone, setSignupDone] = useState(null);
  const termsStateInfo = useRecoilValue(termsState);

  const funneList = [
    { id: "insta", value: "인스타그램 광고" },
    { id: "carrot", value: "당근마켓 광고" },
    { id: "utube", value: "유튜브 광고" },
    { id: "community", value: "아파트 단지 커뮤니티" },
    { id: "elevator", value: "아파트 엘리베이터 광고" },
    { id: "cafe", value: "맘카페 / 지역카페" },
    { id: "leaflet", value: "전단지" },
    { id: "banner", value: "현수막" },
    { id: "friend", value: "지인추천" },
    { id: "tv", value: "TV 광고" },
  ]

  const recommendCodeAvailableCheck = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: { recommendCode: formData.recommendCode?.value },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/signup/recommendcodecheck`,
    })
  }

  const addressAvailableCheck = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { roadAddress: formData.address?.value },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/main/addressavailable`,
    })
  }

  const idDuplicationCheck = async () => {
    return await customAxios({
      method: "GET",
      params: { userEmail: formData.userEmail?.value },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/searchid`,
    })
  }

  const { refetch: addressAvailableCheckRefetch } = useQuery(['addressAvailableCheck', formData.address?.value], addressAvailableCheck, {
    enabled: formData.address != null,
    retry: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data.status === "exist") {
        setAddressAvailable(true);
      } else if (res.status === 200 && res.data.status === "unavailable") {
        setAddressAvailable(false);
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const { refetch: idDuplicationCheckRefetch } = useQuery('idDuplicationCheck', () => idDuplicationCheck(), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data.status === "Not exist") {
        setFromData({
          ...formData,
          "userEmail": {
            value: formData["userEmail"].value,
            validation: formData["userEmail"].validation,
            duplication: false,
          },
        });
      } else if (res.data.status === "exist") {
        setFromData({
          ...formData,
          "userEmail": {
            value: formData["userEmail"].value,
            validation: formData["userEmail"].validation,
            duplication: true,
          },
        });
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })
  const { refetch: recommendCodeAvailableCheckRefetch } = useQuery('recommendCodeAvailableCheck', () => recommendCodeAvailableCheck(), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data.status === "not exist") {
        setFromData({
          ...formData,
          "recommendCode": {
            value: formData["recommendCode"].value,
            validation: false,
          },
        });
      } else if (res.data.status === "exist") {
        setFromData({
          ...formData,
          "recommendCode": {
            value: formData["recommendCode"].value,
            validation: true,
          },
        });
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })




  const validationCheck = (target) => {
    const regExpEmail =
      /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
    const regExpKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
    const regExpPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    const regExpSpecialCharacter =
      /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const regExpNumber = /[^0-9]/gi;
    const regExpId = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{4,20}$/;
    const regEmoji =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

    const value = target.value;
    const tmp = {
      value: value,
      validation: false,
    };

    if (value.length === 0) {
      return { value: value, validation: null };
    }
    switch (target.name) {
      case "id":
        if (regExpSpecialCharacter.test(value) || regEmoji.test(value)) {
          tmp.value = target.value.replace(regExpSpecialCharacter, "");
          // tmp.value = target.value.replace(regEmoji, "");
          tmp.validation = false;
        } else {
          tmp.validation =
            value.length < 4 || regExpId.test(value) === false ? false : true;
        }
        break;
      case "password":
        tmp.validation =
          value.length < 8 || regExpPassword.test(value) === false
            ? false
            : true;
        break;
      case "email":
        tmp.validation = regExpEmail.test(value) ? true : false;
        break;
      case "birthday":
        const birthYear = value.substr(0, 4);
        const birthMonth = value.substr(4, 2);
        const birtDAy = value.substr(6, 2);
        tmp.validation =
          !regExpNumber.test(value) && value.length === 8 ? true : false;

        if (value.length >= 8) {
          tmp.value = value.slice(0, 8);
          tmp.validation = true;
        }
        if (
          birthYear < 1900 ||
          birthMonth > 12 ||
          birthMonth < 1 ||
          birtDAy < 1 ||
          birtDAy > 31
        ) {
          tmp.validation = false;
        }
        break;
      case "recommendCode":
        tmp.validation = null;
        break;
      default:
        tmp.validation = true;
    }
    return tmp;
  };

  const handlePostcodeModal = () => {
    setAddressModal(true);
  };
  const handleInputChange = (e) => {
    const target = e.currentTarget;
    const inputData = validationCheck(target);
    console.log('inputData', inputData)

    if (target.name === "confirmpassword") {
      const check = target.value === formData.userPassword.value
      setFromData({
        ...formData,
        userPassword: {
          ...formData.userPassword,
          same: check,
        },
      });
    } else if (target.type !== "radio") {
      setFromData({
        ...formData,
        [target.id]: inputData,
      });
    } else {
      setFromData({
        ...formData,
        [target.name]: inputData,
      });
    }
  };
  const onCompletePostcodeMadal = (data) => {

    setFromData({
      ...formData,
      address: { value: data.address, validation: true },
    });
    setAddressAvailable(true);
    // addressAvailableCheckRefetch();
    setAddressModal(false);
  };

  const handleSubmitFormData = async () => {
    let signupData = {};

    if (submitActive === false) {
      return false;
    }


    // 회원가입에서 배송가능지역 판단 제외
    // if (addressAvailable === false) {
    //   alert("배송불가 지역입니다.");
    //   return false;
    // }

    if (formData["recommendCode"] && formData["recommendCode"].value?.length !== 0 && (formData["recommendCode"]?.validation === false || formData["recommendCode"]?.validation == null)) {
      alert("추천인 코드확인을 해주세요.");
      return false;
    }

    Object.keys(formData).forEach((key) => {
      signupData[key] = formData[key].value;
    });


    if (!signupData["userGender"]) {
      alert("성별을 선택 해주세요.");
      return false
    }



    signupData['userType'] = "회원"
    signupData = { ...signupData, ...termsStateInfo }

    await customAxios({
      method: "POST",
      data: signupData,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/create`,
    }).then((res) => {
      if (res.status === 200 && res.data.status === "success") {
        setSignupDone(true);
        window.scrollTo({
          top: 0,
          left: 50
        });
        // window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}/login`;
      } else if (res.data.status === "already") {
        alert("이미 가입된 회원정보입니다.");
      }
    });

  };

  const handleIdDuplicated = () => {
    if (formData.userEmail && formData.userEmail.value?.length !== 0) {
      idDuplicationCheckRefetch()
    } else {
      alert("이메일을 입력해주세요");
    }
  }

  useEffect(() => {
    if (authState.phoneNumber !== null) {
      formData["userPhone"] =
        { value: authState.phoneNumber, validation: true }
    }
  }, [authState])

  useEffect(() => {
    console.log('formData :>> ', formData);

    const validationSumit = () => {
      const requiredList = ["userEmail", "userPassword", "userName", "userPhone", "address", "apartmentBuilding", "apartmentUnit", "userGender", "birthday", "funnel"];
      let activeSumit = false;
      for (let i = 0; i < requiredList.length; i++) {
        const keyName = requiredList[i];
        if (!formData[keyName] || formData[keyName]?.validation === false || formData[keyName]?.validation === null) {
          activeSumit = false;
          return false;
        }
      }

      if (formData["userPassword"].same === false) {
        return false;
      }
      if (termsStateInfo.termsAndConditions === false || termsStateInfo.privacyPolicy === false) {
        activeSumit = false;
        return false;
      }

      return true
    }
    setSubmitActvie(validationSumit());
  }, [formData, termsStateInfo])

  useEffect(() => {
    setMobile(isMobile);
  }, [])

  useEffect(() => {
    console.log('formData', formData)
  }, [formData])
  return (
    <SignupWrapper>
      <SignupContainer>
        <SignupTitle>회원가입</SignupTitle>
        <RequiredNotice><span>*</span> 필수입력사항</RequiredNotice>
        <SignupInputGroupWrapper>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="email">아이디<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInputWrapper>
                <SignInputContainer>
                  <SignInput
                    name="email"
                    title="이메일"
                    id="userEmail"
                    type="email"
                    placeholder="doorkitchen@doorkitchen.info"
                    onChange={handleInputChange}
                  ></SignInput>
                  <SignupButton buttontype={"outline"} onClick={handleIdDuplicated}>중복확인</SignupButton>
                </SignInputContainer>
                {formData.userEmail?.validation === false &&
                  <SingupInputNotice>이메일을 정확하게 입력해 주세요</SingupInputNotice>
                }
                {formData.userEmail?.duplication === true &&
                  <SingupInputNotice>사용중인 아이디입니다</SingupInputNotice>
                }
                {formData.userEmail?.duplication === false && formData.userEmail?.validation === true &&
                  <SingupInputNotice>사용 가능한 아이디 입니다.</SingupInputNotice>
                }
              </SignInputWrapper>
            </SignupInputGroup>

          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="password">비밀번호<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInputWrapper>
                <SignInputContainer>
                  <SignInput
                    name="password"
                    title="비밀번호"
                    id="userPassword"
                    type="password"
                    placeholder="8~16자리 / 영문 대소문자, 숫자, 특수문자 조합"
                    onChange={handleInputChange}
                  ></SignInput>
                </SignInputContainer>
                {formData.userPassword?.validation === false &&
                  <SingupInputNotice>* 8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요</SingupInputNotice>
                }
              </SignInputWrapper>

            </SignupInputGroup>

          </SignupInputGroupContainer>

          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="confirmpassword">비밀번호 확인<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInputWrapper>
                <SignInputContainer>
                  <SignInput
                    name="confirmpassword"
                    title="비밀번호"
                    id="userConfirmPassword"
                    type="password"
                    placeholder="비밀번호를 한번 더 입력해주세요"

                    onChange={handleInputChange}

                  ></SignInput>
                </SignInputContainer>
                {formData.userPassword?.same === false &&
                  <SingupInputNotice>동일한 비밀번호를 입력해주세요</SingupInputNotice>
                }
              </SignInputWrapper>
            </SignupInputGroup>
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="name">이름<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInput
                name="name"
                title="이름"
                id="userName"
                type="text"
                placeholder="이름을 입력해 주세요"
                onChange={handleInputChange}
              ></SignInput>
            </SignupInputGroup>
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="phone">휴대폰<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <AuthPhoneNumber></AuthPhoneNumber>
            </SignupInputGroup>
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="address">주소<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInputWrapper>
                <SignInputContainer>
                  <SignInput
                    name="address"
                    title="주소"
                    id="address"
                    type="text"
                    placeholder="주소를 검색해 주세요"
                    readOnly={true}
                    value={formData.address?.value || ""}
                  ></SignInput>
                  <SignupButton buttontype={formData.address ? "outline" : "negative"} onClick={handlePostcodeModal}>{formData.address ? "재검색" : "주소검색"}</SignupButton>
                </SignInputContainer>

                {/* {addressAvailable === true && */}
                {formData.address && formData.address?.value.length !== 0 &&
                  <SignInputContainer>
                    <ApartmentInput
                      name="apartmentBuilding"
                      id="apartmentBuilding"
                      type="text"
                      placeholder={mobile === true ? "상세주소(아파트동/건물명)" : "상세 주소를 입력해주세요 (아파트동/건물명)"}
                      onChange={handleInputChange}>
                    </ApartmentInput>
                    <UnitInput
                      name="apartmentUnit"
                      id="apartmentUnit"
                      type="text"
                      placeholder={mobile === true ? "호수/층" : "호수/층을 입력해주세요"}
                      onChange={handleInputChange}>
                    </UnitInput>
                  </SignInputContainer>
                }
              </SignInputWrapper>
            </SignupInputGroup>
            {/* {addressAvailable === false &&
              <SingupInputNotice>* 배송불가지역입니다</SingupInputNotice>
            } */}
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            {/* {addressAvailable === true && */}
            {formData.address  && formData.address?.value.length !== 0 &&
              <SignupInputGroup>
                <SignupInputLabelContainer>
                  <SignupInputLabel>공동현관비밀번호<span>*</span></SignupInputLabel>
                </SignupInputLabelContainer>
                <SignInputWrapper>
                  <SignInputContainer>
                    <PasswordButtonGroup>
                      <ExistButton active={enterancePwdEixst == true ? true : false} onClick={() => setEnterancePwdEixst(true)}>있어요</ExistButton>
                      <NoExistButton active={enterancePwdEixst == true ? false : true} onClick={() => setEnterancePwdEixst(false)}>없어요</NoExistButton>
                    </PasswordButtonGroup>
                  </SignInputContainer>
                  {
                    enterancePwdEixst == true &&
                    <>
                      <SignInputContainer>
                        <SignInput wide={true} name="enterancePassword" id="enterancePassword" type="text" placeholder="특수문자 + 숫자로 정확하게 입력해주세요." onChange={handleInputChange}></SignInput>
                      </SignInputContainer>
                      <SingupInputNotice>* 공동현관비밀번호 오류시 정확한 배송이 어려우니 정확하게 입력해주세요.</SingupInputNotice>
                    </>
                  }
                </SignInputWrapper>
              </SignupInputGroup>
            }
          </SignupInputGroupContainer>
          {/* {
            addressAvailable === false && enterancePwdEixst == true && 
            <SingupInputNotice>* 공동현관비밀번호 오류시 정확한 배송이 어려우니 정확하게 입력해주세요.</SingupInputNotice>
          } */}
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel>성별<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignupRadioContainer>
                <SignupRadio
                  id="male"
                  name="userGender"
                  type="radio"
                  value="male"
                  onChange={handleInputChange}

                />
                <label htmlFor="male">남자</label>
                <SignupRadio
                  id="female"
                  name="userGender"
                  type="radio"
                  value="female"
                  onChange={handleInputChange}
                />
                <label htmlFor="female">여자</label>
              </SignupRadioContainer>
            </SignupInputGroup>
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel>유입경로<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <FunnelWrapper>
                {funneList.map((funnel, index) => {
                  return <FunnelContainer key={`${funnel.id}${index}`}>
                    <SignupRadio
                      id={funnel.id}
                      name="funnel"
                      type="radio"
                      value={funnel.value}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="male">{funnel.value}</label>
                  </FunnelContainer>
                })}
              </FunnelWrapper>
            </SignupInputGroup>
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="name">생년월일<span>*</span></SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInputWrapper>
                <SignInputContainer>
                  <SignInput
                    name="birthday"
                    title="생년월일"
                    id="birthday"
                    type="number"
                    maxLength={8}
                    placeholder="YYYY / MM / DD"
                    value={formData.birthday?.value || ""}
                    onChange={handleInputChange}
                  ></SignInput>
                </SignInputContainer>
                {formData.birthday?.validation === false &&
                  <SingupInputNotice>생년월일을 올바르게 입력해주세요</SingupInputNotice>
                }
              </SignInputWrapper>
            </SignupInputGroup>
          </SignupInputGroupContainer>
          <SignupInputGroupContainer>
            <SignupInputGroup>
              <SignupInputLabelContainer>
                <SignupInputLabel htmlFor="phone">추천인 코드</SignupInputLabel>
              </SignupInputLabelContainer>
              <SignInputWrapper>
                <SignInputContainer>
                  <SignInput
                    name="recommendCode"
                    title="추천인코드"
                    id="recommendCode"
                    type="text"
                    placeholder="추천인 코드를 입력해 주세요"
                    onChange={handleInputChange}
                  ></SignInput>
                  <SignupButton buttontype={"outline"} onClick={recommendCodeAvailableCheckRefetch}>코드확인</SignupButton>
                </SignInputContainer>
                {formData.recommendCode?.validation === false &&
                  <SingupInputNotice>존재하지않는 추천인코드 입니다</SingupInputNotice>
                }
                {formData.recommendCode?.validation === true &&
                  <SingupInputNotice>사용가능한 추천인코드 입니다</SingupInputNotice>
                }
              </SignInputWrapper>
            </SignupInputGroup>
          </SignupInputGroupContainer>

        </SignupInputGroupWrapper>
      </SignupContainer>
      <Terms></Terms>
      <SignupRegButtonContainer>
        <SignupRegButton buttontype={submitActive === true ? "negative" : "primary"} onClick={handleSubmitFormData}>가입하기</SignupRegButton>
      </SignupRegButtonContainer>
      {addressModal === true && (
        <DaumPost>
          <DaumPostCode onComplete={onCompletePostcodeMadal}></DaumPostCode>
          <DaumPostBackground></DaumPostBackground>
        </DaumPost>
      )}
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
                <SignupDoneButton typeof="button" onClick={() => { Router.replace("/subscribe") }}>구독하러가기</SignupDoneButton>
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
                <SignupDoneButton typeof="button" onClick={() => { Router.replace("https://doorkitchen.info/dooropen") }}>현세권 신청하기</SignupDoneButton>
              </SignupDoneButtonContainer>
            </SignupDoneContainer>
          }
          <SignupDoneBackground></SignupDoneBackground>
        </SignupDoneWrapper>
      }
    </SignupWrapper >
  );
}

export default Signup2;