import axios from "axios";
import Router from "next/router";
import { common } from "./common";

export const customAxios = axios.create({
  baseURl: process.env.NEXT_PUBLIC_API_SERVER,
})

customAxios.interceptors.response.use(
  function (response) {
    if (response.data.message) {
      const jwtExpired = response.data.message && response.data.message === "expired" ? true : false;

      const notNeededLoginList = JSON.parse(process.env.NEXT_PUBLIC_WHITELIST_URL);
      if (!notNeededLoginList.includes(Router.pathname)) {
        if (jwtExpired === true) {
          common.setItemWithExpireTime("loggedIn", false, 0)
          document.cookie = "_actk" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie = "_rftk" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          Router.replace("/login");
        };
      } else {
        if (jwtExpired === true) {
          common.setItemWithExpireTime("loggedIn", false, 0)
          document.cookie = "_actk" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie = "_rftk" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };
      }

    }
    return response;
  },
  function (err) {
    return Promise.reject(err);
  }

)