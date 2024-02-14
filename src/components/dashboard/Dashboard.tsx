import React, { useEffect } from 'react'
import clsx from 'clsx'

import { User } from 'firebase/auth'
import { inputFocus } from 'lib/utils'
import WelcomeBanner from 'components/welcome-banner'
import LinkTable from 'components/link-table'

import stl from './Dashboard.module.scss'

interface Props {
  theme: string
  domainUrl: string
  user: User
}

const Dashboard = ({ theme, domainUrl, user }: Props) => {
  const [className, setClassName] = React.useState('')

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkDashboard) : setClassName('')
  }, [theme])

  useEffect(() => {
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        inputFocus('searchInput')
      }
    })
  }, [])

  return (
    <div className={clsx(stl.dashboard, className)}>
      <div className={stl.container}>
        <WelcomeBanner theme={theme} name={user?.displayName || 'John Doe'} />
        <LinkTable theme={theme} domainUrl={domainUrl} user={user} />
      </div>
    </div>
  )
}

export default Dashboard
