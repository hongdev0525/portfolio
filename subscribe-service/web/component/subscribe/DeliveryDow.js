import styled, { css } from 'styled-components'
import { customAxios } from '../../public/js/customAxios.js';
import { Title, SubsTitle, TitleGroup } from './CommonComponent';
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { deliveryDowState } from '../../state/subscribe';
import { subscribeState, productState } from '../../state/subscribe';
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react';
import { fontWeight } from 'component/common/CommonComponent.js';
import { device } from "component/common/GlobalComponent";

const DeliveryDowContainer = styled.div`
    width: 100%;
    margin-bottom: 40px;
  @media ${device.mobileL} {
      margin-bottom: 60px;
  }
`

const DelieveryDows = styled.ul`
    display:flex;
    justify-content:space-between;
    margin-bottom: 9px;
    @media ${device.mobileL} {
      margin-bottom: 12px;
    }
`

const DliveryDowBox = styled.div`
    display: flex;
    justify-content: center;
    align-items:center;
    width: 100px;
    height:100px;
    font-size:35px;
    font-weight:${fontWeight("regular")};
    line-height: 55px;
    background-color: #fcfcfc;
    opacity: .5;
    color:#BABABA;
    transition: all .4s ease;
    border-radius: 10px;
    cursor: pointer;
    :focus {outline:none;background-color:red}
    ${props => {
    return props.active === true ?
      css`
          font-weight:${fontWeight("semiBold")};
          background-color: #DC5F00;
          color: #fcfcfc;
          opacity: 1;
          box-shadow: 5px 5px 10px rgba(0,0,0,.1);
        `
      :
      css`
          border: 1px solid #BABABA;
        `
  }};
   

  @media ${device.mobileL} {
    width: 55px;
    height:54px;
    font-size:20px;
    font-weight:${fontWeight("regular")};
    line-height: 32px;
    background-color: #fcfcfc;
    opacity: .5;
    color:#BABABA;
    transition: all .4s ease;
    border-radius: 10px;

    ${props => {
    return props.active === true ?
      css`
          font-size: 20px;
          font-weight:${fontWeight("semiBold")};
          background-color: #DC5F00;
          color: #fcfcfc;
          opacity: 1;
          box-shadow: 5px 5px 10px rgba(0,0,0,.1);
        `
      :
      css`
          border: 1px solid #BABABA;
        `
  }};
  }
`


const Notice01 = styled.p`
  font-size :  14px;
  font-weight: ${fontWeight("regular")};
  line-height: 18px;
  opacity: .5;
  transition: all .4s ease;
  @media ${device.mobileL} {
    font-size :  11px;
    font-weight: ${fontWeight("regular")};
    line-height: 16px;
  }
`
const Notice02 = styled(Notice01)`
  opacity: 1;
  color:#DC5F00;
  @media ${device.mobileL} {
    font-size :  11px;
    font-weight: ${fontWeight("medium")};
    line-height: 16px;
  }
`

function DeliveryDow({ stateKey }) {
  const setDeliveryDowState = useSetRecoilState(deliveryDowState(stateKey));
  const setSubscribeState = useSetRecoilState(subscribeState);
  const setProductState = useSetRecoilState(productState(stateKey));
  const selectedDowList = useRecoilValue(deliveryDowState(stateKey));
  const [deliveryDowList, setDeliveryDowList] = useState([]);
  useQuery('getDeliveryDow', () => getDeliveryDow(), {
    onSuccess: (res) => {
      if (res.status === 200) {
        setDeliveryDowList(res.data.data)
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const getDeliveryDow = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { codeType: "DELIVERY_DOW" },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/code/getcodelist`,
    })
  }

  const sortDow = (weekDay) => {
    const weekDaySorter = { '월': 1, '화': 2, '수': 3, '목': 4, '금': 5 };
    weekDay.sort(function sortByWeekDay(a, b) {
      return weekDaySorter[a] - weekDaySorter[b];
    });
    return weekDay
  }

  const handleDeliveryDowBox = (dow) => {

    if (!selectedDowList.list) {
      setDeliveryDowState((oldState) => {
        return {
          ...oldState,
          list: [dow]
        }
      });
    } else if (!selectedDowList.list.includes(dow)) {
      setDeliveryDowState((oldState) => {
        return {
          ...oldState,
          list: sortDow([...new Set([...oldState.list, dow])])
        }
      })
    } else {
      setProductState((oldState) => {
        const productList = oldState.list
        console.log('change')
        let tmp = productList.filter((element) => {
          return element["dow"] !== dow
        })
        return {
          ...oldState,
          list: tmp
        }
      });
      setDeliveryDowState((oldState) => {
        const dowList = oldState.list.filter((element) => {
          return element !== dow
        })
        return {
          ...oldState,
          list: dowList
        }
      })
    }
  }

  useEffect(() => {
    setSubscribeState((oldState) => {
      return {
        ...oldState,
        dows: selectedDowList.list
      }
    })
  }, [selectedDowList.list])

  useEffect(() => {
    const tmp = JSON.parse(localStorage.getItem("tmpSubscribeInfo"));
    if (tmp) {
      setDeliveryDowState((oldState) => {
        return tmp["dows"]
      })
    }
  }, [])



  return (
    <DeliveryDowContainer>
      <TitleGroup>
        <Title>구독 요일 선택</Title>
        <SubsTitle>추후 변경이 가능하니 자유롭게 선택해주세요!</SubsTitle>
      </TitleGroup>
      <DelieveryDows>
        {deliveryDowList.map((element) => {
          return (<DliveryDowBox
            key={element.CodeNo}
            onClick={() => handleDeliveryDowBox(element.CodeLabel)}
            active={selectedDowList.list && selectedDowList.list.includes(element.CodeLabel)}
          >
            {element.CodeLabel}
          </DliveryDowBox>)
        })
        }
      </DelieveryDows>
      {
        selectedDowList.list?.length === 0 ?
          <Notice01>* 현관앞키친은 주말과 법정공휴일을 제외한 평일만 배송됩니다.</Notice01>
          : selectedDowList.list?.length == 1 && stateKey != "experience" ?
            <Notice02>* 최소 이틀이상 선택해야합니다.</Notice02>
            : ""}
    </DeliveryDowContainer>
  );
}

export default DeliveryDow;



