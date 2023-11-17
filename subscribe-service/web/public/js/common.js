import Router from "next/router";

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
  deliveryAvailableCheck: (selectedDateInfo) => {
    /**
     * 조건
     * 1. 일수 차이가 이틀이상의 주문
     * 2. 오늘 시간이 16:00이전
     * 3. 일수만 따지면 안되고 월도 따져야한다. 
     */
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const selectedDate = new Date(selectedDateInfo);
    const limitMonth = selectedDate.getMonth() + 1;
    const limitHours = today.getHours();
    const dayDiff = selectedDate.getDate() - today.getDate();
    if (limitMonth < thisMonth) {
      return false;
    } else if (limitMonth > thisMonth) {
      return true;
    } else {
      if (dayDiff > 2) {
        return true;
      } else if (dayDiff === 2) {
        if (limitHours < 16) {
          return true
        } else {
          return false;

        }
      } else {
        return false;

      }
    }
  }
  ,
  sortObject: (obj) => {
    if (obj) {
      let tmp = [...obj];
      tmp = tmp.sort(function (a, b) {
        return a.name > b.name
      })
      return tmp
    }
  },
  loginCheck: (path) => {

    //로그인이 필요없는 페이지 리스트를 객체화 하여 예외처리해줘야함. env파일에있음.

    const notNeededLoginList = JSON.parse(process.env.NEXT_PUBLIC_WHITELIST_URL);
    if (!notNeededLoginList.includes(path)) {

      const expireCheck = () => {

        const objString = window.localStorage.getItem("loggedIn");

        if (!objString) {
          return false;
        }
        const obj = JSON.parse(objString);
        if (Date.now() > obj.expire) {
          window.localStorage.removeItem("loggedIn");
          return false;
        } else if (obj.value == false) {
          return false;
        }
        return true;

      };
      const loggInState = expireCheck();

      if (loggInState === false) {
        Router.replace("/login", undefined, { shallow: true });
      }
    } else {
      return false;
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