import styled from "styled-components";
import { Button, InputLabel, Input } from '../common/GlobalComponent';
import { fontWeight } from "component/common/CommonComponent";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { device } from "../common/GlobalComponent";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useEffect, useRef, useState } from "react";
import { common } from "public/js/common";
import { milesState } from "state/miles";


const MilesInputGroupContainer = styled.div`
  margin-bottom: 20px;

 @media ${device.mobileL} {
    margin-top: 15px;
  }
`

const MilesInputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  
  @media ${device.mobileL} {
    margin-bottom: 5px;
  }
`

const MilesInputLabel = styled(InputLabel)`
  display:flex;
  align-items: center;
  font-size: 18px;
  line-height: 36px;
  font-weight: ${fontWeight("medium")};
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 25px;
    font-weight: ${fontWeight("medium")};
    padding-left:5px;
    margin-bottom: 5px;
  }
`


const MilesInput = styled(Input)`
  width: 447px;
  @media ${device.mobileL} {
    width: 221px;
  }
`


const MilesButton = styled(Button)`
  width: 137px;
  height: 56px;
  border-radius: 5px;
  font-size:16px;
  line-height: 38px;
  font-weight: ${fontWeight("semiBold")};
  @media ${device.mobileL} {
      width: 111px;
      height: 48px;
      border-radius: 5px;
      font-size:14px;
      line-height: 15px;
      font-weight: ${fontWeight("medium")};
    }
`

const Miles = styled.div`
  display: flex;
  font-size: 16px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  padding-left: 10px;
  color: #DC5F00;
  p{
    font-size: 18px;
    line-height: 26px;
    font-weight: ${fontWeight("regular")};
    padding-left: 10px;
    color: #DC5F00;
  }
  @media ${device.mobileL} {
    font-size: 10px;
    line-height: 10px;  
    padding-left: 5px;
    margin-bottom: 0px;
    margin-top: 5px;
    p{
      font-size: 10px;
      line-height: 10px;
      font-weight: ${fontWeight("regular")};
      padding-left: 10px;
      color: #DC5F00;
    }
  }
`



function MilesReg({ stateKey, subscribePrice }) {

  const milesStateInfo = useRecoilValue(milesState(stateKey));
  const setMilesState = useSetRecoilState(milesState(stateKey));
  const [milesAmount, setMilesAmount] = useState(null);
  const milesRef = useRef(null);

  const getUserMiles = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/miles/getmiles`,
    })
  };


  useQuery("getUserMiles", getUserMiles, {
    onSuccess: (res) => {
      setMilesAmount(res.data.data ? res.data.data : 0);
    },
    onError: (error) => {
      console.error(error);
    }
  })





  const handleMilesInputChange = (e) => {
    if (stateKey === "experience" && subscribePrice != null && subscribePrice < 50000) {
      alert("체험하기는 50,000원 구매이상부터 적림금 사용이 가능합니다.")
      return false;
    }
    let currentValue = e.currentTarget.value
    const numberRegex = new RegExp(/[^0-9.]/g);

    if (numberRegex.test(currentValue)) {
      currentValue = currentValue.replace(/[^0-9.]/g, '');
      milesRef.current.value = currentValue;
    }
    if (milesAmount) {
      if (parseInt(currentValue) > parseInt(milesAmount)) {
        milesRef.current.value = milesAmount;
        setMilesState((oldState) => {
          return {
            ...oldState,
            milesAmount: milesAmount
          }
        })
      } else {
        setMilesState((oldState) => {
          return {
            ...oldState,
            milesAmount: currentValue == 0 ? 0 : currentValue
          }
        })
      }
    } else {
      milesRef.current.value = 0;

    }
  }

  const handleUseAllMiles = () => {

    if (stateKey === "experience" && subscribePrice != null && subscribePrice < 50000) {
      alert("체험하기는 50,000원 구매이상부터 적림금 사용이 가능합니다.")
      return false;
    }
    milesRef.current.value = milesAmount;
    setMilesState((oldState) => {
      return {
        ...oldState,
        milesAmount: milesAmount
      }
    })
  }



  return (
    <MilesInputGroupContainer>
      <MilesInputLabel>
        현키포인트
      </MilesInputLabel>
      <MilesInputGroup>
        <MilesInput
          name="milesPoint"
          onChange={(e) => handleMilesInputChange(e)}
          placeholder="사용하실 포인트를 입력해주세요."
          value={milesStateInfo.milesAmount || ''}
          ref={milesRef}
          type="text"
        />
        <MilesButton type="button" onClick={() => handleUseAllMiles()}>전액사용</MilesButton>
      </MilesInputGroup>
      <Miles>보유 포인트 : {milesAmount ? common.numberCommaFormat(milesAmount) : 0}원
        {/* {milesStateInfo.milesAmount != null && milesStateInfo.milesAmount?.length !== 0 && milesStateInfo.milesAmount != 0 &&
          <p> - {common.numberCommaFormat(milesStateInfo.milesAmount)}원</p>
        } */}
      </Miles>
      {((parseInt(milesStateInfo.milesAmount) !== 0 && milesStateInfo.milesAmount?.length !== 0) && parseInt(milesStateInfo.milesAmount) <= parseInt(milesAmount)) &&
        <Miles>잔여 : {common.numberCommaFormat(milesAmount - milesStateInfo.milesAmount)}원</Miles>
      }
      {stateKey === "experience" && <Miles>최소 결제금액 50,000원 이상 사용 가능해요 </Miles>}
      {/* {
        parseInt(milesStateInfo.milesAmount) > parseInt(milesAmount) &&
        <Miles>(보유 금액보다 많이 입력하셨습니다.)</Miles>
      } */}
    </MilesInputGroupContainer>

  );
}

export default MilesReg;