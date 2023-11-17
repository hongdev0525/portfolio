import './globals.css'
import ReactQueryProvider from '@/utils/ReactQueryProvider'
import { Suspense } from "react";
import RecoilRootProvider from '@/utils/RecoilRootProvider'
import StyledComponentsRegistry from '@/utils/StyleRegistry';
import LoadingSpinner from '@/component/common/LoadingSpinner';
import CommonLayout from '@/component/common/CommonLayout';


export default function RootLayout({ children }) {

  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />

        <title>Luya - 성경 AI 및 기도제목으로 구성된 신앙생활 도우미</title>

        <meta name="description" content="Luya는 성경 AI와 다양한 기도제목을 활용하여 신앙 생활을 돕는 서비스입니다." />

        <meta name="keywords" content="Luya, 성경 AI, 기도제목, 신앙 생활, 루야" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/img/logo/log.png"></link>
        <meta name="theme-color" content="#000000" />


        <meta property="og:title" content="Luya - 성경 AI 및 기도제목으로 구성된 신앙생활 도우미" />
        <meta property="og:description" content="Luya는 성경 AI와 다양한 기도제목을 활용하여 신앙 생활을 돕는 서비스입니다." />
        <meta property="og:image" content="/img/logo/logo.png" />
        <meta property="og:url" content="https://luya.co.kr" />

        <meta name="twitter:card" content="/img/logo/logo_text05.png" />
        <meta name="twitter:title" content="Luya - 성경 AI 및 기도제목으로 구성된 신앙생활 도우미" />
        <meta name="twitter:description" content="Luya는 성경 AI와 다양한 기도제목을 활용하여 신앙 생활을 돕는 서비스입니다." />
        <meta name="twitter:image" content="/img/logo/logo.png" />

        <link rel="apple-touch-icon" sizes="180x180" href="/img/logo/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/logo/favicon-16x16.png" />
        <script src="https://developers.kakao.com/sdk/js/kakao.js" defer></script>

        <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" defer></script>
      </head>
      <body>
        <ReactQueryProvider>
          <RecoilRootProvider>
            <StyledComponentsRegistry>
              <Suspense fallback={<LoadingSpinner />}>
                <CommonLayout>
                    {children}
                </CommonLayout>
              </Suspense>
            </StyledComponentsRegistry>
          </RecoilRootProvider>
        </ReactQueryProvider>
      </body>
    </html >
  )
}
