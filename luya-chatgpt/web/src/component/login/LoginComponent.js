"use client"

import styled from "styled-components"
import { CommonWrapper } from "../common/CommonComponent";
import Login from "./Login";
const LoginWrapper = styled(CommonWrapper)``


function LoginComponent() {
  return (
    <LoginWrapper>
      <Login></Login>
    </LoginWrapper>
  );
}

export default LoginComponent;