import React, { useEffect } from 'react'
import clsx from 'clsx'

import stl from './Modal.module.scss'

interface Props {
  theme: string
  dialog: JSX.Element
  isVisible: boolean
}

const Modal = ({ dialog, theme, isVisible }: Props) => {
  const [className, setClassName] = React.useState('')

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkModal) : setClassName('')
  }, [theme])

  return (
    <div className={clsx(stl.modal, isVisible ? stl.show : '', className)}>
      {dialog}
    </div>
  )
}

export default Modal
