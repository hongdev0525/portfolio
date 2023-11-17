import { useState } from 'react';
import styled from 'styled-components'
import { customAxios } from '../../public/js/customAxios.js'
import { Button, InputLabel, Input } from '../common/GlobalComponent';
import { useSetRecoilState } from 'recoil'
import { useQuery } from 'react-query';
import { cardState, paymentListState } from '../../state/payment';
import { fontWeight } from 'component/common/CommonComponent.js';
import { device } from "../common/GlobalComponent";

const CardInputWrapper = styled.div`
  margin-bottom: 50px;
  
`
const CardInputForm = styled.div` 
  margin-bottom: 40px;
  @media ${device.mobileL} {
    margin-bottom: 30px;
  }
`
const Required = styled.p`
  color:tomato;
`

const CardInputGroup = styled.div`
  margin-bottom: 20px;
`

const CardInputLabel = styled(InputLabel)`
  display:flex;
  align-items: center;
  font-size: 16px;
  line-height: 22px;
  font-weight: ${fontWeight("semiBold")};
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 14px;
    font-weight: ${fontWeight("medium")};
    padding-left: 5px;
    margin-bottom: 5px;
  }
`

const CardRegButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  font-size:18px;
  font-weight: ${fontWeight("bold")};
  line-height: 38px;
  border-radius: 5px;
  @media ${device.mobileL} {
    width: 100%;
    height: 48px;
    font-size: 14px;
    line-height: 13px;
    font-weight: ${fontWeight("medium")};
    border-radius: 5px;

  }
`

function CardInput({ stateKey }) {
  const setPaymentState = useSetRecoilState(paymentListState(stateKey));
  const setCardState = useSetRecoilState(cardState(stateKey));
  const [cardInfo, setCardInfo] = useState({
    paymentType: { value: "Card", validation: true },
    paymentName: { value: "", validation: "" },
    cardNumber: { value: "", validation: "" },
    expiry: { value: "", validation: "" },
    birth: { value: "", validation: "" },
    pwd2Digit: { value: "", validation: "" },
  })


  const { refetch: regPaymentInfoRefetch } = useQuery('regPaymentInfo', () => regPaymentInfo(cardInfo), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data.status === "failed") {
          if (res.data.error === "duplicate") {
            alert("이미 등록된 결제수단입니다.");
          } else {
            alert(`결제수단 등록에 실패했습니다.${res.data.message}`,)
          }
        } else {
          alert("등록이 완료되었습니다.");
          setPaymentState((oldState) => {
            return {
              ...oldState,
              paymentNo: res.data.data,
              paymentModal: false,
              paymentType: null,
            }
          })
        }
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const regPaymentInfo = async (cardInfo) => {
    const inputDataList = {};
    Object.keys(cardInfo).forEach((key) => {
      inputDataList[key] = cardInfo[key].value;
    })
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: inputDataList,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/issuebilling`,
    })
  }

  const handleInputChange = (e) => {
    setCardInfo(
      {
        ...cardInfo,
        [e.currentTarget.name]: { value: e.currentTarget.value, validation: e.currentTarget.value.length !== 0 ? true : false }
      }
    )
  }

  const handleRegCardInfo = (e) => {

    for (let key in cardInfo) {
      if (cardInfo[key].validation === '' || cardInfo[key].validation === false) {
        alert("카드 정보를 정확히 입력해주세요.")
        return false
      }
    }

  
      regPaymentInfoRefetch();
    
  }

  return (
    <CardInputWrapper>
      {/* <SubsTitle>카드등록하기</SubsTitle> */}
      <CardInputForm>
        <CardInputGroup>
          <CardInputLabel>
            카드 이름 <Required>*</Required>
          </CardInputLabel>
          <Input
            type="text"
            name="paymentName"
            value={cardInfo["paymentName"]["value"]}
            onChange={handleInputChange}
            placeholder="카드 이름을 입력해주세요. 예) 생활비카드,엄마카드"
          />
        </CardInputGroup>
        <CardInputGroup>
          <CardInputLabel>
            카드 번호 <Required>*</Required>
          </CardInputLabel>
          <Input
            type="text"
            name="cardNumber"
            maxLength={16}
            value={cardInfo["cardNumber"]["value"]}
            onChange={handleInputChange}
            placeholder="(-)하이픈 없이 입력해 주세요."
          />
        </CardInputGroup>
        <CardInputGroup>
          <CardInputLabel>
            카드 유효기간 <Required>*</Required>
          </CardInputLabel>
          <Input
            type="text"
            name="expiry"
            value={cardInfo["cardNumber"]["expiry"]}
            onChange={handleInputChange}
            maxLength={4}
            placeholder="월/년도(MMYY) 순서로 4자리 숫자를 입력해 주세요."
          />
        </CardInputGroup>
        <CardInputGroup>
          <CardInputLabel>
            생년월일 <Required>*</Required>
          </CardInputLabel>
          <Input
            type="text"
            name="birth"
            value={cardInfo["cardNumber"]["birth"]}
            onChange={handleInputChange}
            maxLength={6}
            placeholder="월/년도(MMYYDD) 순서로 6자리 숫자를 입력해 주세요. 예)940624"
          />
        </CardInputGroup>
        <CardInputGroup>
          <CardInputLabel>
            카드 비밀번호 앞 두자리 <Required>*</Required>
          </CardInputLabel>
          <Input
            type="password"
            name="pwd2Digit"
            value={cardInfo["cardNumber"]["pwd2Digit"]}
            onChange={handleInputChange}
            maxLength={2}
            placeholder="카드 비밀번호 앞 두자리를 입력해 주세요."
          />
        </CardInputGroup>
      </CardInputForm>
      <CardRegButton type="button" onClick={() => handleRegCardInfo()}>카드 등록하기</CardRegButton>
    </CardInputWrapper >
  );
}

export default CardInput;