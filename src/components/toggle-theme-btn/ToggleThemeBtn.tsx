import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'

import { setTheme } from '@/src/store'

import SunIcon from 'assets/sun.svg'
import MoonIcon from 'assets/moon.svg'

import stl from './ToggleThemeBtn.module.scss'

interface Props {
  customClass?: string
  theme: string
}

const ToggleThemeBtn = ({ customClass, theme }: Props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const btn = document.getElementById('toggleBtn')
    const dot = document.getElementById('dotBtn')
    if (theme === 'dark') {
      btn?.classList.add(stl.activeBtn)
      dot?.classList.add(stl.active)
    } else {
      btn?.classList.remove(stl.activeBtn)
      dot?.classList.remove(stl.active)
    }
  }, [theme])

  const handleTheme = () =>
    theme === 'light' ? dispatch(setTheme('dark')) : dispatch(setTheme('light'))

  return (
    <div
      title="Toggle Theme"
      className={clsx(stl.toggleBtn, customClass)}
      onClick={handleTheme}
    >
      <div id="toggleBtn" className={stl.iconContainer}>
        <MoonIcon />
        <SunIcon />
      </div>
      <span id="dotBtn" className={stl.dotBtn} />
    </div>
  )
}

export default ToggleThemeBtn
