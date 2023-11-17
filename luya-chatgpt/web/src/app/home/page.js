"use client"
import styled from "styled-components"
import WordOfDayComponent from "@/component/main/WordsOfDayComponent";

const HomeMainWrapper = styled.div`
  width: 100%;
`

function HomeMain() {
  return (
    <HomeMainWrapper>
      <WordOfDayComponent></WordOfDayComponent>
    </HomeMainWrapper>
  );
}

export default HomeMain;