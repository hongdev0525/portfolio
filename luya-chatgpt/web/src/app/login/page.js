"use client"
import styled from "styled-components"
import LoginComponent from "@/component/login/LoginComponent";

const LoginMainWrapper = styled.div``


function LoginMain() {
  return (
    <LoginMainWrapper>
      <LoginComponent></LoginComponent>
    </LoginMainWrapper>
  );
}

export default LoginMain;