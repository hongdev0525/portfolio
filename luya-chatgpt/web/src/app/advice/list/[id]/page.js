"use client"
import styled from "styled-components"
import AdviceInfoComponent from "@/component/advice/AdviceInfoComponent"
const AdviceInfoWrapper = styled.div`
  width: 100%;
`

function AdviceInfo({ params }) {

  return (
    <AdviceInfoWrapper>
      <AdviceInfoComponent id={params.id}> </AdviceInfoComponent>
    </AdviceInfoWrapper>
  );
}

export default AdviceInfo;

