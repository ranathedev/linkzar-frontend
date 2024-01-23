import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import firebase from 'firebase/auth'

import auth from 'lib/firebase'
import Layout from 'components/layout'
import AvatarHandler from 'components/avatar-handler'
import UserInfoSettings from 'components/user-info-settings'
import LoadingScreen from 'components/loading-screen'
import VerificationDialog from 'components/verification-dialog'

import stl from './index.module.scss'

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [className, setClassName] = useState('')
  const [user, setUser] = useState<
    firebase.User | { email: string; displayName: string; photoURL: string }
  >({
    email: 'johndoe@gmail.com',
    displayName: 'John Doe',
    photoURL: 'https://i.postimg.cc/Mp7gnttP/default-Pic.jpg',
  })
  const theme = useSelector((state: { theme: string }) => state.theme)
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    const mode = urlParams.get('mode')

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        setIsVerified(user.emailVerified)
      }

      if (mode !== 'dev' && !user) router.push('/auth?type=signin')

      setTimeout(() => setIsLoading(false), 500)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkSettings) : setClassName('')
  }, [theme])

  return isLoading ? (
    <LoadingScreen />
  ) : isVerified ? (
    <Layout theme={theme} user={user} title="Settings | Linkzar">
      <div className={clsx(stl.settings, className)}>
        <div className={stl.container}>
          <AvatarHandler
            theme={theme}
            customClass={stl.avatarHandler}
            user={user}
            setUser={setUser}
          />
          <div className={stl.wrapper}>
            <UserInfoSettings theme={theme} user={user} setUser={setUser} />
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <Layout theme={theme} user={user} title="Verify | Linkzar">
      <div className={stl.verification}>
        <VerificationDialog theme={theme} user={user} />
      </div>
    </Layout>
  )
}

export default SettingsPage