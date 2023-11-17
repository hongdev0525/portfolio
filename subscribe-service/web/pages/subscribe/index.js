import styled from 'styled-components'
import Subscribe from 'component/subscribe/Subscribe';
const SubscribeWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
`

function SubscribeMain() {
    return (
        <SubscribeWrapper>
            <Subscribe></Subscribe>
        </SubscribeWrapper>
    );
}
export default SubscribeMain;