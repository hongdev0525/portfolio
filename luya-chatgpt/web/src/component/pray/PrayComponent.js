"use client"
import styled, { css } from "styled-components"
import PrayList from "./PrayList"
import Image from "next/image"
import Link from "next/link"
import { CommonWrapper } from "../common/CommonComponent"
import { useQuery } from "react-query"
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react"
import useCustomAxios from "@/utils/UseCustomAxios"
import useAlert from "@/utils/useAlert/UseAlert"
import UseMotion from "@/utils/UseMotion"
import PrayKakaoShare from "./PrayKakaoShare"


const PrayWrapper = styled(CommonWrapper)`
  position:relative;
  background-color: var(--color-set05);
  /* min-height: calc(100vh - 166px); */
  overflow-y: hidden;
  justify-content: flex-start;
`

const PrayListContainer = styled.div`
  width: 100%;
`

const PrayContainer = styled.div`
  position: absolute;
  top: 55%;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30px 200px;
  height: 100vh;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
  background-color: #fefefe;
  transition: all .5s ease;
  transform: translate(0 , 0);
  overflow-y: scroll;

  ${props => {
    if (props.index === 0) {
      return props.active === true ?
        css` 
        top : 0;
        overflow-y: scroll;
      ` :
        css` 
      top: 55%;
        overflow-y: hidden;
      `
    } else {
      if (props.active) {
        return css` 
        top: 90%;
        /* overflow-y: hidden; */
      `
      }
    }
  }
  }
  
 
`
const PrayDoneContainer = styled.div`
position: absolute;
  top: 45%;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30px 200px;
  height: 100vh;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
  background-color: var(--color-set02);
  transition: all .5s ease;
  overflow-y: scroll;
  ${props => props.active === true ?
    css` 
      top : 0;
      overflow-y: scroll;
    ` :
    css` 
      top: 45%;
      overflow-y: hidden;
    `
  }
`


const PrayRegButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 90px;
  background-color: #fefefe;
  border-radius: 10px;
  /* color:var(--color-set03); */
  color:#232323;
  box-shadow: 0px 2px 5px rgba(120, 120, 120, 0.2);
  svg{
    margin-bottom: 7px;
  }

`

const KaKaoShareButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 45%;
  height: 90px;
  border-radius: 10px;
  background-color: #F7E600;
  padding:  20px;
  color:#3A1D1D ;
  box-shadow: 0px 2px 5px rgba(120, 120, 120, 0.2);
  cursor: pointer;
  img{
    margin-bottom: 7px;
  }
`

const PrayHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  p{
    width: 100%;
    font-size: 12px;
    color: var(--color-set07);
    margin: 16px 0;

  }
`


const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 30px;

`

const ButtonContainer = styled.div`
  width: 45%;
  font-size: 14px;
`


const CountPrayContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 30px;
    h3{
      font-size: 14px;
      color:#fefefe;
      margin-left: 4px;
    }
`
const CountPray = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
  width: 45%;
    height: 60px;
    border-radius: 15px;
    span{
      text-align: center;
      color:#fefefe;
    }
`

const Count = styled.div`
  font-size: 48px;
  text-align: center;
  font-weight: 700;
  color:#fefefe;
`

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 40px;
  cursor: pointer;
  div{
    width: 40px;
    height: 5px;
    background-color: var(--color-set07);
    border-radius: 5px;
  }
`


function PrayComponent() {
  const axios = useCustomAxios();
  const alertHook = useAlert([]);
  const [shareList, setShareList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [prayListForCount, setPrayListForCount] = useState(null);
  const [prayCount, setPrayCount] = useState({
    done: 0,
    wait: 0,
  })

  const getPrayList = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/list`,
    })
  }

  useQuery(`getPrayList`, getPrayList, {
    retry: false,
    onSuccess: res => {
      // setPrayCount({
      //   done: 0,
      //   wait: 0,
      // })
      if (res.data.message === "success") {
        setShareList(res.data.prayList)
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })


  const getPrayShareList = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      params: { done: 0 },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/list`,
    })
  }

  const { refetch: getPrayShareListRefetch } = useQuery(`getPrayShareList`, getPrayShareList, {
    retry: false,
    onSuccess: res => {
      setPrayCount(countPrayList(res.data.prayList));

    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })
  const getUserInfo = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    })
  }

  const { refetch: getUserInfoRefetch } = useQuery(`getUserInfo`, getUserInfo, {
    retry: false,
    onSuccess: res => {
      if (res.data.status === "success") {
        const { userName, userToken } = res.data;
        setUserInfo({ userName, userToken });
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })



  const [containerState, setContainerState] = useState({ active: null, index: null })

  const handleTab = (index) => {

    setContainerState(prev => {
      return {
        ...prev,
        active: prev.active !== null ? !prev.active : true,
        index: index
      }
    })

  }

  const countPrayList = (prayList) => {
    if (prayList) {

      const prayCount = {
        done: 0,
        wait: 0,
      };

      for (const key in prayList) {
        if (prayList.hasOwnProperty(key)) {
          const prayItem = prayList[key];
          if (prayItem.PRAY_COMPLETED === 1) {
            prayCount.done++;
          } else if (prayItem.PRAY_COMPLETED === 0) {
            prayCount.wait++;
          }
        }
      }
      return prayCount
    }
  }

  const handlekakaoShare = () => {
    alertHook.alert("아직 지원하지 않는 기능입니다.");
  }



  return (
    <PrayWrapper>
      {prayCount &&
        <UseMotion>
          <CountPrayContainer>
            <CountPray>
              <span>기다리는 기도</span>
              <Count>
                {prayCount.wait}
              </Count>
            </CountPray>
            <CountPray>
              <span>응답된 기도</span>
              <Count>
                {prayCount.done}
              </Count>
            </CountPray>
          </CountPrayContainer>
        </UseMotion>
      }
      <UseMotion delay={0.15}>
        <ButtonGroup>
          <ButtonContainer>
            <PrayRegButton
              href="/pray/add"
            >
              <FaPen size={24}></FaPen>
              작성하기
            </PrayRegButton>
          </ButtonContainer>
          <ButtonContainer>
            <PrayKakaoShare shareList={shareList} userInfo={userInfo}></PrayKakaoShare>
          </ButtonContainer>
        </ButtonGroup>
      </UseMotion>
      <PrayListContainer>
        <PrayDoneContainer active={containerState.index === 1 && containerState.active == true ? true : false} >
          <PrayHeader>
            <Tab onClick={() => handleTab(1)}>
              <div></div>
            </Tab>
            <p>기도에 응답된...</p>
          </PrayHeader>
          <PrayList done={true} stateKey={"done"}></PrayList>
        </PrayDoneContainer>
        <PrayContainer active={containerState.active == true ? true : false} index={containerState.index}>
          <PrayHeader>
            <Tab onClick={() => handleTab(0)}>
              <div></div>
            </Tab>
            <p>기도 응답을 기다리며...</p>
          </PrayHeader>
          <PrayList stateKey={"wait"}></PrayList>
        </PrayContainer>
      </PrayListContainer>
    </PrayWrapper >
  );
}

export default PrayComponent;