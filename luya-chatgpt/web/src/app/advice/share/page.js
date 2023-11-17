"use client"
import styled from "styled-components";
import AdviceShare from "@/component/advice/AdivceShareComponent";

const AdivceShareMainWrapper = styled.div`
    width: 100%;
`

function AdivceShareMain() {
  return (
    <AdivceShareMainWrapper>
      <AdviceShare></AdviceShare>
    </AdivceShareMainWrapper>
  );
}

export default AdivceShareMain;