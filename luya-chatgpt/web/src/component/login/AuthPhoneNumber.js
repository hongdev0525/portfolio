"use client";
import { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import useCustomAxios from "@/utils/UseCustomAxios.js";
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { CommonInput, CommonButton } from "../common/CommonComponent";
import Timer from "../common/Timer";
import { authPhoneState } from '../../state/auth.js'
import useAlert from '@/utils/useAlert/UseAlert';


const AuthPhoneWrapper = styled.div`
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  :nth-of-type(2){
    margin-top: 30px;

  }

`;

const AuthInput = styled(CommonInput)`
width: 230px;
:focus{
    background-color: #FEF8F3;
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
  
`


const AuthInputContainer = styled.div`
  position: relative;
  div{
    position: absolute;
    right:0;
    top:50%;
    transform: translate(0,-50%);
    color:var(--color-set05);
    p{
      color:var(--color-set05);
      margin:0;
      margin-right: 10px;
    }
  }
  
`



const Button = styled(CommonButton)`
  width:auto;
  height:50px;
  border-radius: 5px;
  margin-left: 12px;
  font-size: 14px;
  padding:10px;
  cursor: pointer;
  
  ${props => {

    switch (props.buttontype) {
      case "outline":
        return css`
      background-color: #fefefe;
      border:1px solid var(--color-set05);
      color:var(--color-set05);
    `
      case "primary":
        return css`
        background-color: #fefefe;
        border:1px solid #DBDBDB;
        color:#DBDBDB;
      `
      case "negative":
        return css`
      background-color: var(--color-set05);
      border:1px solid var(--color-set05);
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


`



function AuthPhoneNumber({ duplicate, text }) {
  const axios = useCustomAxios();
  const alertHook = useAlert();
  const authRequestRef = useRef();
  const setAuthPhone = useSetRecoilState(authPhoneState)
  const authDonePhone = useRecoilValue(authPhoneState);
  const [phoneNumber, setPhoneNumber] = useState();

  const authRequest = () => {
    setAuthPhone((oldAuth) => {
      return {
        ...oldAuth,
        inAuth: true,
        authDone: false,
      }
    })
  }

  const authState = useRecoilValue(authPhoneState)

  const requestAuthPhone = async () => {
    if (phoneNumber) {
      authRequest();
      await axios({
        method: "GET",
        params: { userPhone: phoneNumber },
        url: `${process.env.NEXT_PUBLIC_API_SERVER}/authphone/sendcode`,
      });
    } else {
      alert("핸드폰번호를 입력해주세요.");
      return false;
    }
  }

  const handleRequestAuthPhone = async () => {
    if (duplicate === true) {
      await axios({
        method: "GET",
        params: { userPhone: phoneNumber },
        url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/searchid`,
      }).then(async (res) => {
        if (res.data.status === "exist") {
          setAuthPhone((oldAuth) => {
            return {
              ...oldAuth,
              isExistPhoneNumber: true,
            }
          })
          return false
        } else {
          requestAuthPhone()
        }
      });
    } else {
      requestAuthPhone()
    }

  };

  const handleAuthPhone = async () => {
    if (authState.authNumber) {
      await axios({
        method: "GET",
        params: { userAuth: authState.authNumber, userPhone: phoneNumber },
        url: `${process.env.NEXT_PUBLIC_API_SERVER}/authphone/verify`,
      }).then((res) => {
        if (res.data.status === "success") {
          setAuthPhone((oldAuth) => {
            return {
              ...oldAuth,
              inAuth: false,
              authDone: true,
              authNumber: null,
              phoneNumber: phoneNumber
            }
          })
          authRequestRef.current.disable = "true";
        } else if (res.data.status === "fail") {
          alertHook.alert("인증번호가 일치하지않습니다.");
        }
      });
    } else {
      alertHook.alert("인증번호를 입력해주세요.");
    }
  };


  const handlePhoneNumber = (e => {
    // 나중에 전화번호 validation check 해야함
    // const phoneRegex = /^01([0|1|6|7|8|9]?)?([0-9]{3,4})?([0-9]{4})$/
    setPhoneNumber(e.target.value)
  });


  useEffect(() => {
    setAuthPhone((oldAuth) => {
      return {
        inAuth: false,
        authDone: false,
        authNumber: null,
        phoneNumber: null,
        isExistPhoneNumber: null,
      }
    })
  }, [])


  return (
    <AuthPhoneWrapper>
      <InputWrapper>
        <AuthInput
          type="number"
          placeholder="핸드폰 번호를 입력해주세요"
          defaultValue={phoneNumber}
          onChange={handlePhoneNumber}
          readOnly={authState.authDone}
          name="phone"
        ></AuthInput>
        <Button
          type="button"
          onClick={handleRequestAuthPhone}
          ref={authRequestRef}
          disabled={authState.authDone}
          buttontype={(authState.inAuth === true || phoneNumber?.length != 0) ? "outline" : "'"}
        >
          {authState.inAuth === true
            ? "재전송"
            : authState.authDone == true
              ? "인증완료"
              : text ? text : "인증번호 받기"}
        </Button>
      </InputWrapper>
      {
        authState.inAuth === true && (
          <InputWrapper>
            <AuthInputContainer>
              <AuthInput
                tpye="number"
                name="authNumber"
                onChange={(e) =>
                  setAuthPhone((oldAuth) => {
                    return {
                      ...oldAuth,
                      authNumber: e.currentTarget.value
                    }
                  })
                }
              ></AuthInput>
              <Timer hoursMinSecs={{ hours: 0, minutes: 3, seconds: 0 }}></Timer>
            </AuthInputContainer>
            <Button type="button" onClick={handleAuthPhone} buttontype={"outline"}>
              인증하기
            </Button>
          </InputWrapper>
        )
      }
    </AuthPhoneWrapper >
  );
}

export default AuthPhoneNumber;
