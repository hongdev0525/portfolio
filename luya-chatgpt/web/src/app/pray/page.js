"use client"
import styled from "styled-components"
import PrayComponent from "@/component/pray/PrayComponent"

const PrayMainWrapper = styled.div`
  width: 100%;
`

function PrayMain() {


  return ( 
    <PrayMainWrapper>
        <PrayComponent></PrayComponent>
    </PrayMainWrapper>
   );
}

export default PrayMain;