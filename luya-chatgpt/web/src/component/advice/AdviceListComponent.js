"use client"

import styled from "styled-components"
import AdviceList from "./AdviceList";

const AdivceListComponentWarpper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 30px;
`
const AdviceTitle = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color:var(--color-set07)
`

function AdivceListComponent() {
  return (
    <AdivceListComponentWarpper>
      <AdviceTitle>고민/질문</AdviceTitle>
      <AdviceList></AdviceList>
    </AdivceListComponentWarpper>
  );
}

export default AdivceListComponent;