import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { PageProps } from 'lib/type'
import Layout from 'components/layout'
import AvatarHandler from 'components/avatar-handler'
import UserInfoSettings from 'components/user-info-settings'
import LoadingScreen from 'components/loading-screen'
import VerificationDialog from 'components/verification-dialog'

import stl from './index.module.scss'

const Profile = ({ user, isLoading, theme }: PageProps) => {
  const [className, setClassName] = useState('')
  const router = useRouter()

  const urlParams = new URLSearchParams(window.location.search)

  const mode = urlParams.get('mode')

  if (!isLoading && mode !== 'dev' && !user) router.push('/auth?type=signin')

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkProfile) : setClassName('')
  }, [theme])

  return isLoading ? (
    <LoadingScreen />
  ) : user && user.emailVerified ? (
    <Layout theme={theme} user={user} title="Profile | Linkzar">
      <div className={clsx(stl.profile, className)}>
        <div className={stl.container}>
          <AvatarHandler
            theme={theme}
            customClass={stl.avatarHandler}
            user={user}
          />
          <UserInfoSettings theme={theme} user={user} />
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

export default Profile
