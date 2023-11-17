"use client";
import { useRecoilState } from "recoil";
import { confirmState } from "./confirmState";

const useConfirm = () => {
  const [confirmStateInfo, setConfirmStateInfo] = useRecoilState(confirmState);

  const confirm = (text, callback, confirmText, cancelText) => {
    setConfirmStateInfo({
      active: true,
      text,
      confirmText,
      cancelText,
      callback,
    });
  };

  const closeConfirm = () => {
    setConfirmStateInfo({
      active: false,
      text: "",
      confirmText: "",
      cancelText: "",
      callback: null,
    });
  };

  return {
    confirm,
    closeConfirm,
    confirmStateInfo,
  };
};

export default useConfirm;
