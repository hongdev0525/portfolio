import styled from "styled-components";
import SubscrbieCalendar from "../main/SubscribeCalendar";
import { BoxUList } from "../../common/GlobalComponent";
import { MdArrowForwardIos } from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { subscribeCalendarState } from "../../../state/mypage";
import DailyOrderInfo from "../main/DailyOrderInfo";
import { useEffect, useRef } from "react";

const MypageSubscribeContainer = styled.div`
  min-width: 50%;

`

function MypageSubscribe({ subsNo }) {
  const dailyOrderInfoRef = useRef(null);
  const subscribeCalendarStateInfo = useRecoilValue(subscribeCalendarState(subsNo));
  const setSubscribeCalendarState = useSetRecoilState(subscribeCalendarState(subsNo));


  useEffect(() => {
    setSubscribeCalendarState({});
  }, [])

  // useEffect(() => {
  //   dailyOrderInfoRef?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  // }, [subscribeCalendarStateInfo])


  return (
    <MypageSubscribeContainer>

    </MypageSubscribeContainer>
  );
}

export default MypageSubscribe;