import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query'
import '../styles/globals.css'
import Layout from '../component/common/Layout'
import { useRouter } from 'next/router';
const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
          <Layout>
            {getLayout(<Component key={router.asPath} {...pageProps} />)}
          </Layout>
      </RecoilRoot>
    </QueryClientProvider>
  )
}
