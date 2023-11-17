import styled from 'styled-components'
import SimpleSignup from '../../component/signup/SimpleSignup'
const SimpleSignupWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
`

function SimpleSignupMain() {
  return (
    <SimpleSignupWrapper>
      <SimpleSignup></SimpleSignup>
    </SimpleSignupWrapper>
  );
}

export default SimpleSignupMain;