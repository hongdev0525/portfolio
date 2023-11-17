"use client"
import styled from "styled-components"
import AdivceListComponent from "@/component/advice/AdviceListComponent";
const AdivceListWrapper = styled.div`
  width: 100%;
`


function AdivceListMain() {
  return (
    <AdivceListWrapper>
      <AdivceListComponent></AdivceListComponent>
    </AdivceListWrapper>
  );
}

export default AdivceListMain;