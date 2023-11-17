import styled from 'styled-components';
import CardInput from './CardInput';
import PaymentList from './PaymentList';
import KakaoPayButton from './KakaoPay';
import KakaoPayMobileButton from './KakaoPayMobile';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { paymentListState } from '../../state/payment';
import { useEffect } from 'react';
import { Title, TitleGroup } from '../subscribe/CommonComponent';
import { BrowserView, MobileView } from 'react-device-detect';
import { ButtonGroup, GroupButton01, GroupButton02 } from 'component/subscribe/CommonComponent.js'
import { fontWeight } from 'component/common/CommonComponent';
import { device } from "../common/GlobalComponent";
import { useQuery } from 'react-query';
import { customAxios } from 'public/js/customAxios';
const PaymentWrapper = styled.div`
  margin-bottom: 50px;
  @media ${device.mobileL} {
    margin: 0px 0 60px;
  }
`
const PaymentContainer = styled.div``
const SelectPayment = styled.div`
  margin-top:20px;
  @media ${device.mobileL} {
    margin-top: 30px;
  }
`
const PaymentListContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`
const PaymentMethodContainer = styled(ButtonGroup)`
  display: flex;
  width: 100%;
  margin:20px 0 ;
  div{
    width: 50%;
  }

  @media ${device.mobileL} {
    margin-top: 30px;
  }
`

const Notice = styled.p`
  font-size: 16px;
  line-height: 42px;
  font-weight: ${fontWeight("regular")};
  margin-top: 14px;
  margin-bottom: 24px;
  color:  #A9A9A8;

  @media ${device.mobileL} {
    font-size: 11px;
    line-height: 17px;
    margin-top: 4px;
    padding-left: 5px;
  }
`

const PaymentTitleGroup = styled(TitleGroup)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0px;
  

`


const CardButton = styled(GroupButton01)`

  font-weight: ${fontWeight("regular")};
  border-right: none;
  @media ${device.mobileL} {
    height : 37px;
    font-size:12px;
  }
`
const Kakaopay = styled(KakaoPayButton)`


`

const KakaoPayMobile = styled(KakaoPayMobileButton)`
  font-weight: ${fontWeight("regular")};

`


const CanclButton = styled.div`
  font-size: 14px;
  line-height: 39px;
  font-weight: ${fontWeight("regular")};
  text-decoration: underline;
  cursor: pointer;
  @media ${device.mobileL} {
    font-size: 11px;
    line-height: 19px;
  }
`



function Payment({ selectedDowListLength, propsType, experience = false, redirectUrl, failRedirectUrl, stateKey, paymentPrice }) {
  const setPaymentListState = useSetRecoilState(paymentListState(stateKey));
  const paymentListStateInfo = useRecoilValue(paymentListState(stateKey));
  const handlePaymentMethod = (paymentType, active) => {
    setPaymentListState((oldState) => {
      return {
        ...oldState,
        paymentModal: active,
        paymentType: paymentType
      }
    })
  }


  const getPaymentInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { paymentNo: paymentListStateInfo.paymentNo },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/info`,
    })
  }

  const { refetch: getPaymentInfoRefetch } = useQuery('getPaymentInfo', () => getPaymentInfo(), {
    onSuccess: (res) => {
      console.log("paymentListStateInfo", paymentListStateInfo)
      if (res.status === 200 && res.data?.data?.length !== 0) {
        setPaymentListState((oldState) => {
          return {
            ...oldState,
            list: res.data.data,
            // paymentNo: paymentListStateInfo.paymentNo !== null ? String(paymentListStateInfo.paymentNo) : res.data.data ? res.data.data[0].PaymentNo : null
          }
        })
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })
  // const getPaymentList = async () => {
  //   return await customAxios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/list`,
  //   })
  // }

  // const { refetch: getPaymentListRefetch } = useQuery('getPaymentList', () => getPaymentList(), {
  //   onSuccess: (res) => {
  //     if (res.status === 200 && res.data?.data?.length !== 0) {
  //       setPaymentListState((oldState) => {
  //         return {
  //           ...oldState,
  //           list: res.data.data,
  //           paymentNo: paymentListStateInfo.paymentNo !== null ? String(paymentListStateInfo.paymentNo) : res.data.data ? res.data.data[0].PaymentNo : null
  //         }
  //       })
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error Occured : ", error)
  //   }
  // })



  useEffect(() => {
    // getPaymentListRefetch();
    getPaymentInfoRefetch();
  }, [paymentListStateInfo.paymentNo])



  useEffect(() => {
    if (paymentListStateInfo.list?.length !== 0) {
      setPaymentListState((oldState) => {
        return {
          ...oldState,
          addPayment: false,
        }
      })
    }
  }, [paymentListStateInfo.list]);

  useEffect(() => {
    console.log('experience', experience)
    if (experience === true || stateKey == "subscribe") {
      setPaymentListState((oldState) => {
        return {
          ...oldState,
          addPayment: true,
        }
      })
    }
  }, [])


  return (
    <PaymentWrapper>
      <PaymentContainer>
        <PaymentTitleGroup>
          <Title>결제수단</Title>
          {paymentListStateInfo.list && paymentListStateInfo.list.length !== 0 && paymentListStateInfo.addPayment === true &&
            <CanclButton type='button' onClick={() => {
              setPaymentListState((oldState) => {
                return {
                  ...oldState,
                  addPayment: false,
                  paymentModal: false,
                }
              })
            }}>	&lt; 등록 취소하기</CanclButton>
          }
        </PaymentTitleGroup>
        {selectedDowListLength ?
          <>
            {
              selectedDowListLength >= 2
              && paymentListStateInfo.paymentModal === false
              && paymentListStateInfo.addPayment === false
              && paymentListStateInfo.list?.length !== 0 &&
              <SelectPayment>
                <PaymentListContainer>
                  <PaymentList
                    stateKey={stateKey}
                  ></PaymentList>
                </PaymentListContainer>
              </SelectPayment>
            }
          </> :
          <>
            {
              paymentListStateInfo.paymentModal === false
              && paymentListStateInfo.addPayment === false
              && paymentListStateInfo.list?.length !== 0 &&
              <SelectPayment>
                <PaymentListContainer>
                  <PaymentList
                    stateKey={stateKey}
                  ></PaymentList>
                </PaymentListContainer>
              </SelectPayment>
            }
          </>
        }
        {
          (paymentListStateInfo.list?.length === 0 || paymentListStateInfo.addPayment === true) &&
          <PaymentMethodContainer>
            <CardButton active={paymentListStateInfo.paymentType === "Card" ? true : false} onClick={() => handlePaymentMethod("Card", true)}>카드등록하기</CardButton>
            <>
              <BrowserView>
                <Kakaopay
                  stateKey={stateKey}
                  active={paymentListStateInfo.paymentType === "Kakao" ? true : false}
                  redirectUrl={redirectUrl}
                  failRedirectUrl={failRedirectUrl}
                  paymentPrice={paymentPrice}
                >
                </Kakaopay>
              </BrowserView>
              <MobileView>
                <KakaoPayMobile
                  stateKey={stateKey}
                  active={paymentListStateInfo.paymentType === "Kakao" ? true : false}
                  redirectUrl={redirectUrl}
                  failRedirectUrl={failRedirectUrl}
                  paymentPrice={paymentPrice}
                >
                </KakaoPayMobile>
              </MobileView>
            </>
          </PaymentMethodContainer>
        }
        {
          paymentListStateInfo.paymentModal === true &&
          <>
            {/* <Notice>체크카드, 신용카드 모두 가능해요</Notice> */}
            <CardInput stateKey={stateKey}></CardInput>
          </>
        }
      </PaymentContainer>
    </PaymentWrapper>
  );
}

export default Payment;