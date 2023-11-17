"use client"
import styled, { css } from "styled-components"
import Image from "next/image"
import Link from "next/link"
import { useQuery } from "react-query"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { prayStateFamily } from "@/state/prayState"
import useCustomAxios from "../../utils/UseCustomAxios"
import { useSearchParams } from 'next/navigation'
import { BiPencil } from "react-icons/bi";


const PrayListContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
`
const PrayContentList = styled.ul`
  padding: 10px 0px;

`

const PrayContent = styled.li`
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  width: 100%;
  ${props => {
    return props.done === true ?
      css`
       background-color: var(--color-set02);
      border-bottom: 1px solid var(--color-set01);
       
       `
      :
      css` 
      background-color: #fefefe;
     border-bottom: 1px solid var(--color-set02);
      
      `
  }};
  margin-bottom: 16px;
  padding-bottom: 10px;
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

const NoPrayList = styled.div`
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

function PrayList({ done = false, stateKey }) {
  const axios = useCustomAxios();
  const prayState = useRecoilValue(prayStateFamily(stateKey))
  const setPrayState = useSetRecoilState(prayStateFamily(stateKey))

  const searchParams = useSearchParams()
  // const completed = searchParams.get("completed")


  const getPrayList = async () => {
    return await axios({
      method: "GET",
      // params: { userNo: 0, completed: completed ? parseInt(completed) : null },
      params: { done: done, stateKey },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/list`,
    })
  }


  useQuery(`getPrayList${stateKey}`, getPrayList, {
    onSuccess: res => {
      if (res.data.message === "success") {
        setPrayState((prevState) => {
          return {
            ...prevState,
            prayList: res.data.prayList
          }
        })
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })


  return (
    <PrayListContainer>
      <PrayContentList>
        {
          prayState.prayList && prayState.prayList.map(pray => {
            const text = pray.PRAY_TEXT.length > 20 ? pray.PRAY_TEXT.slice(0, 20) + "..." : pray.PRAY_TEXT;
            const date = pray.CREATED_AT ? pray.CREATED_AT.split(" ")[0].replace(/\-/g, ".") : ""
            return (
              <PrayContent key={`pray${pray.PRAY_NO}`} done={done}>
                <Link href={`/pray/${pray.PRAY_NO}`}>
                  <p>{text}</p>
                  <ContentsContainer>
                    {done === false &&
                      <WriteIcon size={24}></WriteIcon>
                    }
                    <span>{date}</span>
                  </ContentsContainer>
                </Link>
              </PrayContent>
            )
          })
        }
      </PrayContentList>
      {
        (!prayState.prayList || prayState.prayList?.length === 0) &&
        <NoPrayList>작성된 기도제목이 없습니다.</NoPrayList>
      }
    </PrayListContainer>
  );
}

export default PrayList;