"use client";
import { useRecoilState } from "recoil";
import { alertState } from "./alertState";

const useAlert = () => {
  const [alertStateInfo, setAlertStateInfo] = useRecoilState(alertState);

  const alert = (text, callback) => {
    setAlertStateInfo({
      active: true,
      text: text,
      callback,
    });
  };

  const closeAlert = () => {
    setAlertStateInfo({
      active: false,
      text: "",
      callback: null,
    });
  };

  return {
    alert,
    closeAlert,
    alertStateInfo,
  };
};

export default useAlert;
