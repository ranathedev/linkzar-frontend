import React, { useEffect } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { User } from 'firebase/auth'

import Modal from 'components/modal'
import AvatarActions from 'components/avatar-actions'

import CameraIcon from 'assets/camera.svg'

import stl from './AvatarContainer.module.scss'

interface Props {
  theme: string
  user: User
  setShowToast: (arg: boolean) => void
  setToastOpts: (arg: { variant: string; msg: string }) => void
  customClass?: string
}

const AvatarContainer = ({
  theme,
  user,
  setShowToast,
  setToastOpts,
  customClass,
}: Props) => {
  const [showModal, setShowModal] = React.useState(false)

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.key === 'Escape' && setShowModal(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Modal
        theme={theme}
        isVisible={showModal}
        dialog={
          <AvatarActions
            theme={theme}
            isVisible={showModal}
            setIsVisible={setShowModal}
            user={user}
            setShowToast={setShowToast}
            setToastOpts={setToastOpts}
          />
        }
      />
      <div
        className={clsx(stl.avatarContainer, customClass)}
        onClick={() => setShowModal(true)}
      >
        <Image
          src={user?.photoURL || ''}
          alt="profile-avatar"
          width={500}
          height={500}
          priority
        />
        <div>
          <CameraIcon />
        </div>
      </div>
    </>
  )
}

export default AvatarContainer
