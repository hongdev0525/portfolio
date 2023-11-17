"use client"
import styled from "styled-components"
import PrayInfoComponent from "@/component/pray/PrayInfoComponent"
const PrayInfoWrapper = styled.div`
  width: 100%;
`

function PrayInfo({ params }) {

  return (
    <PrayInfoWrapper>
      <PrayInfoComponent id={params.id}> </PrayInfoComponent>
    </PrayInfoWrapper>
  );
}

export default PrayInfo;

