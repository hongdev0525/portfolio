import { useEffect } from 'react';
import styled from 'styled-components'
import Login from '../../component/login/Login';

const LoginWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
`
function LoginMain() {

    return (
        <LoginWrapper>
            <Login></Login>
        </LoginWrapper>
    );
}

export default LoginMain;