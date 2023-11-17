"use client"
import styled, { css } from "styled-components"
import Link from "next/link"
import { useQuery } from "react-query"
import useCustomAxios from "../../utils/UseCustomAxios"
import { useSearchParams } from 'next/navigation'
import { BiPencil } from "react-icons/bi";
import { useEffect, useState } from "react"
import { AiOutlinePlusCircle } from "react-icons/ai";

const AdviceListContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
  padding: 30px;
`
const AdviceContentList = styled.ul`
  padding: 10px 0px;

`

const AdviceContent = styled.li`
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  width: 100%;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  p{
    /* color:var(--color-set04); */
    color:#232323;
    font-size: 14px;
    font-weight: 700;
  }
  
  a{
    display: flex;
    justify-content: space-between;
    height: 50px;
  }
  img{
    opacity: 0.2;
  }

`

const NoAdviceList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  min-height: 150px;
  font-size: 14px;
  font-weight: 400;
  background-color: var(--color-set02);
  color: var(--color-set07);
  
`

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  
  span{
    color:var(--color-set07);
    font-size: 14px;
    font-weight: 300;
  } 
`

const WriteIcon = styled(BiPencil)`
    color: var(--color-set07);
`

const PlusIcon =styled(AiOutlinePlusCircle)`
    color: var(--color-set07);
  
`

function AdviceList() {
  const axios = useCustomAxios();
  const [adviceState, setAdviceState] = useState();

  const searchParams = useSearchParams()
  // const completed = searchParams.get("completed")


  const getAdviceList = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/list`,
    })
  }


  useQuery(`getAdviceList`, getAdviceList, {
    onSuccess: res => {
      if (res.data.message === "success") {
        setAdviceState(res.data.adviceList)
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })
  


  return (
    <AdviceListContainer>
      <AdviceContentList>
        {
          adviceState && adviceState.map(advice => {
            const text = advice.QUESTION.length > 20 ? advice.QUESTION.slice(0, 20) + "..." : advice.QUESTION;
            const date = advice.REGISTRATION_DT ? advice.REGISTRATION_DT.split(" ")[0].replace(/\-/g, ".") : ""
            return (
              <AdviceContent key={`Advice${advice.ADVICE_NO}`} >
                <Link href={`/advice/list/${advice.ADVICE_NO}`}>
                  <p>{text}</p>
                  <ContentsContainer>
                    <PlusIcon size={24}></PlusIcon>
                    <span>{date}</span>
                  </ContentsContainer>
                </Link>
              </AdviceContent>
            )
          })
        }
      </AdviceContentList>
      {
        (!adviceState || adviceState?.length === 0) &&
        <NoAdviceList>작성된 목록이 없습니다.</NoAdviceList>
      }
    </AdviceListContainer>
  );
}

export default AdviceList;