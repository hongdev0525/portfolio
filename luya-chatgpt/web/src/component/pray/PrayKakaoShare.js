"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import useAlert from "@/utils/useAlert/UseAlert";

const PrayKakaoShareWrapper = styled.div`
  width: 100%;
`

const KaKaoShareButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 90px;
  border-radius: 10px;
  background-color: #F7E600;
  padding:  20px;
  color:#3A1D1D ;
  box-shadow: 0px 2px 5px rgba(120, 120, 120, 0.2);
  cursor: pointer;
  img{
    margin-bottom: 7px;
  }
`




function PrayKakaoShare({ shareList, userInfo }) {
  const shareContents = [];
  const alertHook = useAlert();
  const [isInitialized, setIsInitialized] = useState(false);


  if (shareList.length > 0) {
    for (let i = 0; i < shareList.length; i++) {
      if (i >= 5) break;
      const pray = shareList[i];
      shareContents.push({
        item: `${i + 1}.`,
        itemOp: `${pray.PRAY_TEXT}`,
      }
      )
    }
  }



  const handleShareClick = () => {
    console.log("userInfo", userInfo)
    if (shareContents.length === 0) {
      alertHook.alert("공유할 기도제목이 없습니다.");
      return; // 공유할 내용이 없으므로 여기서 종료
    } else {
      if ( shareContents.length > 0 && userInfo) {
        const url = `${process.env.NEXT_PUBLIC_DOMAIN}/pray/share?userToken=${userInfo.userToken}`;
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: '',
            description: `${userInfo.userName}님께서 기도제목을 공유했어요!`,
            imageUrl:
              'https://luya.co.kr/img/logo/logo_text05.png',
            imageWidth: 400,
            imageHeight: 250,
            link: {
              mobileWebUrl: `${process.env.NEXT_PUBLIC_DOMAIN}`,
              webUrl: `${process.env.NEXT_PUBLIC_DOMAIN}`,
            },
          },
          itemContent: {
            items: shareContents,
          },
          buttons: [
            {
              title: '기도제목 더보기',
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        });
      }
    }

  };


  useEffect(() => {

    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY);
    }

    // if (!isInitialized && shareContents.length > 0 && userInfo) {
    //   setIsInitialized(true);
    // }

  }, [shareContents, userInfo, isInitialized])

  return (
    <PrayKakaoShareWrapper>
      <KaKaoShareButton id="kakaotalk-sharing-btn" onClick={handleShareClick}>
        <Image
          src="/img/kakaotalkIcons.png"
          width={24}
          height={24}
          alt="kakaotalk icon"
        ></Image>
        <p>
          공유하기
        </p>
      </KaKaoShareButton>
    </PrayKakaoShareWrapper>
  );
}

export default PrayKakaoShare;