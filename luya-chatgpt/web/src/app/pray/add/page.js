"use client"
import styled from "styled-components"
import PrayAddComponent from "@/component/pray/PrayAddComponent";

const PrayAddMainWrapper = styled.div`
  width: 100%;
`

function PrayAddMain() {
  return (
    <PrayAddMainWrapper>
      <PrayAddComponent>

      </PrayAddComponent>
    </PrayAddMainWrapper>
  );
}

export default PrayAddMain;