"use client"
import styled from "styled-components"
import Image from "next/image"
import useCustomAxios from "../../utils/UseCustomAxios";
import useAlert from "@/utils/useAlert/UseAlert";
import BackWard from "../common/Backward"
import { CommonWrapper, CommonButton } from "../common/CommonComponent"
import { useQuery } from "react-query"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { prayInfoStateFamily } from "@/state/prayState"
import { useEffect } from "react"
import { commonAlertState } from "@/state/common"
import { commonConfirmState } from "@/state/common"
import { useRouter } from "next/navigation"
import useConfirm from "@/utils/useConfirm/UseConfirm";

const PrayInfoWrapper = styled(CommonWrapper)`
  position: relative;
  width: 100%;

`
const PrayInfoContainer = styled.div`
  width: 100%;
  padding: 30px 20px 60px;
`
const PrayInfoTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  img{
    margin-right: 8px;
  }
  p{
    font-size: 16px;
    /* color: var(--color-set05);
     */
    font-weight: 400;
    text-align: center ;
    }
`

const ParyInfoSubTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color:#a9a9a9;
    text-align: center;

`
const PrayInfoGroup = styled.textarea`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border:  1px solid #e5e5e5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  min-height: 150px;
  height: 150px;
  width: 100%;
  resize: none;
  font-size: 14px;
  :focus {
    border: 1px solid var(--color-set05);
  }
  ::placeholder{
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      font-size: 14px;
    color:#777777;

  }

`

// const PrayInfo = styled.textarea`
//   white-space: pre-wrap;
//   font-weight: 500;
//   font-size: 20px;
//   resize: none;

// `
const PrayButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 230px;
  margin: 0 auto;
`

const PrayButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  button{
    background-color: #fefefe;
    border:1px solid #e5e5e5;
    color:#a9a9a9;
    width: 49%
  }
`

const PrayButton = styled(CommonButton)`
  margin : 12px 0;
  width: 100%;
`


function PrayInfoComponent({ id }) {
  const axios = useCustomAxios();
  const router = useRouter();
  const alertHook = useAlert();
  const confirmHook = useConfirm();
  const prayInfoState = useRecoilValue(prayInfoStateFamily(id))
  const setPrayInfoState = useSetRecoilState(prayInfoStateFamily(id))



  // 기도제목 획득
  const getPrayInfo = async () => {
    return await axios({
      method: "GET",
      params: { prayNo: id },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/info`,
    })
  }

  const { refetch: getPrayInfoRefetch } = useQuery(['getPrayInfo', id], getPrayInfo, {
    onSuccess: res => {
      if (res.data.message === "success") {
        setPrayInfoState((prevState) => {
          return {
            ...prevState,
            prayInfo: res.data.prayInfo,
            initialInfo: res.data.prayInfo
          }
        })
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })


  //기도제목 완료처리
  const donePray = async () => {
    return await axios({
      method: "POST",
      data: { prayNo: id },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/done`,
    })
  }

  const { refetch: donePrayRefetch } = useQuery(['donePray', id], donePray, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: false,
    onSuccess: res => {
      if (res.data.message === "success") {
        router.replace("/pray");
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })

  //기도제목 수정
  const updatePray = async () => {
    return await axios({
      method: "POST",
      data: { prayNo: id, text: prayInfoState.prayInfo },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/update`,
    })
  }

  const { refetch: updatePrayRefetch } = useQuery(['updatePray', id], updatePray, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: false,
    onSuccess: res => {
      if (res.data.message === "success") {
        alertHook.alert("기도제목이 수정되었습니다.", () => {
          getPrayInfoRefetch();
          router.replace("/pray");
        })
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })




  //기도제목 삭제처리
  const deletePray = async () => {
    return await axios({
      method: "POST",
      data: { prayNo: id },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/delete`,
    })
  }

  const { refetch: deletePrayRefetch } = useQuery(['deletePray', id], deletePray, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: false,
    onSuccess: res => {
      if (res.data.message === "success") {
        alertHook.alert("기도제목이 삭제되었습니다.", () => {
          router.replace("/pray");
        })
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
      alertHook.alert("기도제목 삭제가 실패했습니다.", () => {
        router.replace("/pray");
      })
    }
  })


  const handleDonePray = () => {
    confirmHook.confirm("기도제목이 응답되었습니까?", donePrayRefetch, "예", "아니오")
  }

  const handleDeletePray = () => {
    confirmHook.confirm("기도제목을 삭제하시겠습니까?", deletePrayRefetch, "예", "아니오")
  }

  const handleUpdatePray = () => {
    if (prayInfoState.prayInfo === prayInfoState.initialInfo) {
      alertHook.alert("이전 기도제목과 동일합니다.");
      return false;
    }
    updatePrayRefetch();
  }

  const handleTextarea = (e) => {
    const text = e.currentTarget.value;
    setPrayInfoState((prevState) => {
      return {
        ...prevState,
        prayInfo: text
      }
    })
  }

  return (
    <PrayInfoWrapper>
      <PrayInfoContainer>
        <BackWard url={"/pray"}>
        </BackWard>
        <ParyInfoSubTitle>기도제목</ParyInfoSubTitle>
        <PrayInfoTitle>
          <p>
            주님께서 여러분과 함께하실 것입니다
          </p>
        </PrayInfoTitle>
        <PrayInfoGroup value={prayInfoState.prayInfo ?? ""} placeholder="기도제목을 작성해주세요." onChange={(e) => handleTextarea(e)}>
        </PrayInfoGroup>
        <PrayButtonContainer>
          <PrayButton onClick={handleDonePray}>
            기도가 응답되었습니다
          </PrayButton>
          <PrayButtonGroup>
            <PrayButton onClick={handleUpdatePray}>
              수정하기
            </PrayButton>
            <PrayButton onClick={handleDeletePray}>
              삭제하기
            </PrayButton>
          </PrayButtonGroup>
        </PrayButtonContainer>
      </PrayInfoContainer>
    </PrayInfoWrapper >
  );
}

export default PrayInfoComponent;