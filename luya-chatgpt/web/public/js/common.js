
import { useRouter } from "next/router";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";

export const common = {
  getDayOfWeek: (date) => { //ex) getDayOfWeek('2022-06-13')

    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = week[new Date(date).getDay()];

    return dayOfWeek;

  },
  getDayOfWeekText: (weekOfDay) => { //ex) getDayOfWeek('월')
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    return week[weekOfDay];

  },
  numberCommaFormat: (number) => {
    return parseInt(number).toLocaleString("ko-KR")
  },
  DateFormatting: (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ');
  },
  sortObject: (obj) => {
    if (obj) {
      let tmp = [...obj];
      tmp = tmp.sort(function (a, b) {
        return a.name > b.name
      })
      return tmp
    }
  },

  displayToken: () => {
    var token = getCookie('authorize-access-token');

    function getCookie(name) {
      var parts = document.cookie.split(name + '=');
      if (parts.length === 2) { return parts[1].split(';')[0]; }
    }

    if (token) {
      Kakao.Auth.setAccessToken(token);
      Kakao.Auth.getStatusInfo()
        .then(function (res) {
          if (res.status === 'connected') {
            document.getElementById('token-result').innerText
              = 'login success, token: ' + Kakao.Auth.getAccessToken();
          }
        })
        .catch(function (err) {
          Kakao.Auth.setAccessToken(null);
        });
    }
  },
  // 만료 시간과 함께 데이터를 저장
  setItemWithExpireTime: (keyName, keyValue, tts) => {
    // localStorage에 저장할 객체
    const obj = {
      value: keyValue,
      expire: Date.now() + tts
    }

    // 객체를 JSON 문자열로 변환
    const objString = JSON.stringify(obj);

    // setItem
    window.localStorage.setItem(keyName, objString);
  }
}