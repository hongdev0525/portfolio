import styled from 'styled-components'
import { customAxios } from '../../public/js/customAxios.js'
import { useQuery } from 'react-query'
import { paymentListState } from '../../state/payment'
import { subscribeState } from '../../state/subscribe'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import { fontWeight } from 'component/common/CommonComponent.js'
import { Button, device } from "../common/GlobalComponent";

const PaymentListWrapper = styled.div`
  width:100%;
  @media ${device.mobileL} {
    margin-bottom: 0px;
  }
`
const PaymentListContainer = styled.div`
  display: flex;
  justify-content: space-between;

`
const PaymentSelectContainer = styled.div`
  position: relative;
  /* width: 447px; */
  width: 100%;


  @media ${device.mobileL} {
    width: 100%;
    :after{
          width: 31px;
          height: 31px;
          top:3px;
          right:10px;
      }
  }
`
const PaymentSelect = styled.select`
  width: 100%;
  height: 56px;
  padding: 0 20px;
  border: 1px solid #232323;
  background-color: #F1F1F5;
  border-radius: 5px;
  font-size: 18px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  appearance: none;
  /* cursor: pointer; */
  outline: none;
  @media ${device.mobileL} {
    width: 100%;
    height: 48px;
    font-size: 14px;
    margin-bottom: 0px;
    line-height: 25px;
    padding: 0 10px;
  }

`
const SelectOption = styled.option`
  height: 40px;
  width  : 100%;
  div{  & span{
    font-size: 22px;
    line-height: 26px;
    font-weight: ${fontWeight("medium")};
    color:#DC5F00;
  }
    & p{
      font-size: 22px;
      line-height: 26px;
      font-weight: ${fontWeight("regular")};
    }
  }
`

const AddPaymentButton = styled(Button)`
  width: 137px;
  height: 56px;
  border-radius: 5px;
  font-size:16px;
  line-height: 38px;
  font-weight: ${fontWeight("semiBold")};
  @media ${device.mobileL} {
      width: 95px;
      height: 48px;
      border-radius: 5px;
      font-size:14px;
      line-height: 15px;
      font-weight: ${fontWeight("medium")};
    }
`

function PaymentList({stateKey}) {
  const setPaymentListState = useSetRecoilState(paymentListState(stateKey))
  const paymentListStateInfo = useRecoilValue(paymentListState(stateKey))

  const handlePaymentSelect = (e) => {

    setPaymentListState((oldState) => {
      return {
        ...oldState,
        paymentNo: e.target.value
      }
    })
  }

  // const handlePaymentMethod = (active) => {
  //   setPaymentListState((oldState) => {
  //     return {
  //       ...oldState,
  //       addPayment: active,
  //     }
  //   })
  // }


  return (
    <PaymentListWrapper>
      {paymentListStateInfo.list && paymentListStateInfo.list.length !== 0 &&
        <PaymentListContainer>
          <PaymentSelectContainer>
            <PaymentSelect onChange={handlePaymentSelect} value={String(paymentListStateInfo.paymentNo)} disabled>
              {
                paymentListStateInfo.list.map((payment) => {
                  return (
                    <SelectOption key={`payment${payment.PaymentNo}`} value={payment.PaymentNo} >
                      {payment.PaymentName}  {payment.CardName}
                    </SelectOption>
                  )
                })
              }
            </PaymentSelect>
          </PaymentSelectContainer>
          {/* <AddPaymentButton type="button" onClick={() => handlePaymentMethod(true)}>결제수단 추가</AddPaymentButton> */}
        </PaymentListContainer>
      }
    </PaymentListWrapper>
  );
}

export default PaymentList;