"use client"

import styled from "styled-components"

const AdviceResultWrapper = styled.div`
    width: 100%;
  padding: 0 30px;
  min-height: 300px;
`

const AdviceResultContainer = styled.div`

`
const AdviceResultText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  white-space: pre-wrap;
  padding: 16px 0 40px;
`

const ConcernText = styled.p`
 font-size: 14px;
  font-weight: 500;
  line-height: 25px;
  white-space: pre-wrap;
  padding: 16px 0;

`

const AdviceResultTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color:var(--color-set05);
  /* text-align: center; */
  margin-top: 30px;
`



function AdivceResult({ adviceStateInfo }) {
  return (
    <AdviceResultWrapper>
      <AdviceResultContainer>
        <AdviceResultTitle>고민/질문</AdviceResultTitle>
        <ConcernText>
          {adviceStateInfo.message}
        </ConcernText>
      </AdviceResultContainer>
      <AdviceResultContainer>
        <AdviceResultTitle>성경 말씀</AdviceResultTitle>
        <AdviceResultText>
          {adviceStateInfo.advice}
        </AdviceResultText>
      </AdviceResultContainer>
    </AdviceResultWrapper>
  );
}

export default AdivceResult;