"use client"
import styled from "styled-components"


const WordsOfDayContentsWrapper = styled.div`
  padding: 30px;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
  background-color: #fefefe;
  min-height: calc(100vh - 160px);
`
const WordsOfDayContentsContainer = styled.div`
`
const WordsOfDayTitle = styled.h1`
  font-size  : 16px;
  font-weight: 500;
  margin-bottom: 18px;
  color:var(--color-set05);
`

const Text = styled.p`
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  white-space: pre-wrap;
`

function WordsOfDayContents({wordsOfTodayText}) {
  return (
    <WordsOfDayContentsWrapper>
      <WordsOfDayTitle>
        오늘의 말씀
      </WordsOfDayTitle>
      <WordsOfDayContentsContainer>
        <Text>
        {wordsOfTodayText}
        </Text>
      </WordsOfDayContentsContainer>
    </WordsOfDayContentsWrapper>
  );
}

export default WordsOfDayContents;