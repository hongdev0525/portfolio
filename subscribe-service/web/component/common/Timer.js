import { useState, useEffect } from "react";
import styled from "styled-components";
import  { timerState } from '../../state/timer'
import {  useSetRecoilState } from 'recoil';
import { authPhoneState } from '../../state/auth'

const TimerWrapper = styled.div`
  text-align: left;
`;

function Timer({ hoursMinSecs }) {
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
  const setTimerover= useSetRecoilState(timerState)
  const setAuthPhoneState = useSetRecoilState(authPhoneState)

  const tick = () => {
    if (hrs === 0 && mins === 0 && secs === 0) {
      reset();
    } else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  const reset = () => {
    setTimerover((oldstate)=>{
      return false
    })
    setAuthPhoneState((oldstate)=>{
      return{
        ...oldstate,
        inAuth:false,
        authDone:false,
      }
    })
    setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <TimerWrapper>
      <p>{
        //   `${hrs.toString().padStart(2, "0")}:
        `${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`
      }</p>
    </TimerWrapper>
  );
}

export default Timer;
