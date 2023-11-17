"use client"

import styled from "styled-components";
import { CommonWrapper } from "../common/CommonComponent";
import SignUpForm from "./SignUpForm";

const SignUpWrapper = styled(CommonWrapper)`
  
`
const SignUpContainer = styled.div`
  padding: 30px 0px ;

`
const SignupTitle = styled.h3`
  font-size: 18px;
  text-align: center;
`

function SingUpComponent() {
  return (
    <SignUpWrapper>
      <SignUpContainer>
      <SignupTitle>회원가입</SignupTitle>
        <SignUpForm></SignUpForm>
      </SignUpContainer>
    </SignUpWrapper>
  );
}

export default SingUpComponent;