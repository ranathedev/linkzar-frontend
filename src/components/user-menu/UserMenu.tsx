import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'
import { User } from 'firebase/auth'

import { setTheme } from '@/src/store'
import { logOut } from 'lib/authFunctions'
import useOnClickOutside from 'lib/useClickOutside'
import ToggleThemeBtn from 'components/toggle-theme-btn'
import Toast from 'components/toast'

import DropdownIcon from 'assets/chevron-down.svg'
import LogoutIcon from 'assets/logout.svg'
import ProfileIcon from 'assets/profile.svg'
import DashboardIcon from 'assets/dashboard-2.svg'

import stl from './UserMenu.module.scss'

interface Props {
  user: User | { displayName: string; photoURL: string }
  theme: string
}

const UserMenu = ({ user, theme }: Props) => {
  const [className, setClassName] = useState('')
  const [expand, setExpand] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastOpts, setToastOpts] = useState({ variant: '', msg: '' })
  const dispatch = useDispatch()

  const ref = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.key === 'Escape' && setExpand(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkUserMenu) : setClassName('')
  }, [theme])

  const handleThemeChange = () => {
    theme === 'light' ? dispatch(setTheme('dark')) : dispatch(setTheme('light'))
  }

  const name = user?.displayName?.split(' ')[0]

  useOnClickOutside(() => setExpand(false), ref)

  return (
    <>
      <Toast
        theme={theme}
        isVisible={showToast}
        variant={toastOpts.variant}
        content={toastOpts.msg}
        setShowToast={setShowToast}
      />
      <div
        ref={ref}
        className={clsx(stl.userMenu, className)}
        title={user?.displayName || 'John Doe'}
      >
        <div className={stl.content} onClick={() => setExpand(!expand)}>
          <Image
            src={
              user?.photoURL || 'https://i.postimg.cc/Mp7gnttP/default-Pic.jpg'
            }
            width={36}
            height={36}
            alt="user-avatar"
          />
          <span className={clsx(stl.icon, expand ? stl.rotate : '')}>
            <DropdownIcon />
          </span>
          <span className={stl.name}>
            {(user?.displayName && name) || 'John Doe'}
          </span>
        </div>
        <div className={clsx(stl.menu, expand ? stl.show : '')}>
          <div className={stl.theme} onClick={handleThemeChange}>
            <span>Theme</span>
            <ToggleThemeBtn customClass={stl.toggleBtn} theme={theme} />
          </div>
          <Link
            href="/user-profile"
            className={stl.settings}
            onClick={() => setExpand(false)}
          >
            <span>Profile</span>
            <ProfileIcon />
          </Link>
          <Link
            href="/dashboard"
            className={stl.dashboard}
            onClick={() => setExpand(false)}
          >
            <span>Dashboard</span>
            <DashboardIcon />
          </Link>
          <hr />
          <div
            className={stl.logout}
            onClick={() => {
              logOut(setShowToast, setToastOpts)
              setExpand(false)
            }}
          >
            <span>Logout</span>
            <LogoutIcon />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserMenu
