"use client"
import styled from "styled-components"
import WordsOfDay from "./WordsOfDay";
import WordsOfDayContents from "./WordsOfDayContents";
import useCustomAxios from "../../utils/UseCustomAxios";
import { CommonWrapper } from "../common/CommonComponent";
import { useQuery } from "react-query"
import { useState } from "react";
import UseMotion from "@/utils/UseMotion";
import Footer from "../common/Footer";

const WordOfDayWrapper = styled(CommonWrapper)`
  border-bottom: 1px solid #e5e5e5;
  background-color: var(--color-set05);
`


function WordOfDayComponent() {
  const axios = useCustomAxios();
  const [wordsOfToday, setWordsOfToday] = useState(null);

  const getAdvice = async () => {
    return await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/today/words`,
    })
  }

  useQuery("getAdvice", getAdvice, {
    onSuccess: response => {
      if (response.data.message === "success") {
        setWordsOfToday(response.data.words);
      }
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });

  return (
    <WordOfDayWrapper>
      {wordsOfToday &&
        <>
          <WordsOfDay wordsOfToday={wordsOfToday.WORDS_OF_TODAY} label={wordsOfToday.WORDS_OF_TODAY_LABEL}></WordsOfDay>
          <UseMotion delay={.6}>
            <WordsOfDayContents wordsOfTodayText={wordsOfToday.WORDS_OF_TODAY_TEXT} ></WordsOfDayContents>
            <Footer></Footer>
          </UseMotion>
        </>
      }
    </WordOfDayWrapper>
  );
}

export default WordOfDayComponent;