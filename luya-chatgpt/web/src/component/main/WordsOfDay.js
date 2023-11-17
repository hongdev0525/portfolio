"use client"
import styled from "styled-components"
import UseMotion from "@/utils/UseMotion"

const WordsOfDayWrapper = styled.div`
  width: 100%;
`
const WordsOfDayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-set05);
  background-size: cover;
  filter: blur(30%);
  color: #fefefe;
  padding:20px;
  min-height: 160px;

`

const WordsOfDayText = styled.div`
  font-size: 14px;
  margin-bottom: 24px;
  white-space: pre-wrap;
  text-align: center;
`

const TextFrom = styled.span`
 
`

function WordsOfDay({ wordsOfToday, label }) {


  return (
    <WordsOfDayWrapper>
      <WordsOfDayContainer>
        <WordsOfDayText>
          <UseMotion >
            {wordsOfToday}
          </UseMotion>
        </WordsOfDayText>
        <TextFrom>
          <UseMotion delay={0.15}>
            {label}
          </UseMotion>
        </TextFrom>
      </WordsOfDayContainer>
    </WordsOfDayWrapper>
  );
}

export default WordsOfDay;