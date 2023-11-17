import styled from 'styled-components'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { subscribeState } from '../../state/subscribe';
import { SubsTitle } from './CommonComponent';
import { useEffect } from 'react';

const PaymentPeriodWrapper = styled.div`
  margin-bottom: 48px;
`
const PeriodBoxConatiner = styled.div`
  display: flex;
  justify-content:  space-around;
  align-items: center;
`
const PeriodBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width:49%;
  border-radius: 10px;
  padding: 30px 0;
  cursor: pointer;
  ${props => {
    return props.active === true ? "border:   1px solid tomato" : " border:  1px solid #e5e5e5"
  }};
  &>h2{
    font-size:24px;
    font-weight: bold;
  }
`

function PaymentPeriod() {
  const setSubscribeState = useSetRecoilState(subscribeState)
  const subscribeStateInfo = useRecoilValue(subscribeState)
  const handlePaymentPeriod = (period) => {
    setSubscribeState((oldState) => {
      return { ...oldState, period: period }
    })
  }

  useEffect(() => {
    if (!subscribeState.period) {
      setSubscribeState((oldState) => {
        return {
          ...oldState,
          period: 4
        }
      })
    }
  }, [])

  return (
    <PaymentPeriodWrapper>
      <SubsTitle>결제 주기를 선택해주세요.</SubsTitle>
      <PeriodBoxConatiner>
        <PeriodBox onClick={() => handlePaymentPeriod(4)} active={subscribeStateInfo.period === 4}> <h2>4주</h2><p>편하게 한달치를 결제하고 싶어요</p></PeriodBox>
        <PeriodBox onClick={() => handlePaymentPeriod(1)} active={subscribeStateInfo.period === 1}> <h2>1주</h2><p>일주일마다 결제하고 싶어요</p></PeriodBox>
      </PeriodBoxConatiner>
    </PaymentPeriodWrapper>
  );
}

export default PaymentPeriod;