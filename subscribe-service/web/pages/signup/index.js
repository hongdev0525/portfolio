import styled from 'styled-components'
import Signup from '../../component/signup/Signup2'
const SignupWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
`

function SignupMain() {
    return (
        <SignupWrapper>
            <Signup></Signup>
        </SignupWrapper>
    );
}

export default SignupMain;