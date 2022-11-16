import '../styles/globals.css'
import { useState, useEffect } from "react"
import Head from 'next/head'
import { RecoilRoot } from "recoil"

import * as fcl from "@onflow/fcl"

import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import TransactionNotification from '../components/common/TransactionNotification'
import BasicNotification from '../components/common/BasicNotification'
import publicConfig from '../publicConfig'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  const [user, setUser] = useState({ loggedIn: null })
  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  return (
    <div className="bg-white text-black bg-[url('/bg.png')] bg-cover bg-center min-h-screen">
      <SessionProvider session={session}>
        <RecoilRoot>
          <Head>
            <title>Emerald Bot | Discord Bot on Flow</title>
            <meta property="og:title" content="Emerald Bot | Discord Bot on Flow" key="title" />
          </Head>
          <NavigationBar user={user} />
          <Component {...pageProps} user={user} />
          <Footer />
          <TransactionNotification />
          <BasicNotification />
        </RecoilRoot>
      </SessionProvider>
    </div>
  )
}

export default MyApp
