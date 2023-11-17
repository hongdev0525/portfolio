"use client"
import styled from "styled-components"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useQuery } from "react-query";
import { CommonButton } from "../common/CommonComponent";
import useCustomAxios from "../../utils/UseCustomAxios";
import useAlert from "@/utils/useAlert/UseAlert";
import { useRouter } from "next/navigation";


const PrayShareContainer = styled.div`
  width: 100%;
  padding: 60px 20px 0;
`

const PrayShareTitle = styled.div`
  font-size: 16px;
  margin-bottom: 24px;
  span{
    color: var(--color-set05);
    font-size: 20px;
  }
`

const SharedPrayList = styled.ul`
  margin-bottom: 60px;
`
const SharedPray = styled.li`
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
  color: #232323;
  font-size: 14px;
  font-weight: 700;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

function PrayShare() {
  const axios = useCustomAxios();
  const searchParams = useSearchParams();
  const userToken = searchParams.get("userToken");
  const alertHook = useAlert();
  const [prayList, setprayList] = useState();
  const [userName, setUserName] = useState(null);
  const router = useRouter();


  const getPrayList = async () => {
    return await axios({
      method: "GET",
      params: { userToken: userToken, done: false },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/share/list`,
    })
  }


  useQuery(`getPrayList${userToken}`, getPrayList, {
    onSuccess: res => {
      if (res.data.message === "success") {
        setprayList(res.data.prayList);
        setUserName(res.data.userName);
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })


  useEffect(() => {
    if (!userToken) {
      alertHook.alert("잘못된 접근입니다.", () => {
        location.replace("/")
      })
    }
  }, [userToken])

  return (
    <PrayShareContainer>
      <PrayShareTitle>
        <span>  {userName}</span> 형제님의 기도제목이에요!
      </PrayShareTitle>
      <SharedPrayList>
        {prayList && prayList.map((pray, index) => {
          return <SharedPray key={pray.PRAY_NO}>
            {(index + 1) + ".  "}{pray.PRAY_TEXT}
          </SharedPray>
        })}
      </SharedPrayList>
      <ButtonContainer>
        <CommonButton type="button" onClick={() => router.push("/pray")}>
          나의 기도제목 작성하기
        </CommonButton>
      </ButtonContainer>
    </PrayShareContainer>
  );
}

export default PrayShare;