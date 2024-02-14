import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { User } from 'firebase/auth'

import { updatePhoto, deletePhoto } from 'lib/authFunctions'
import Button from 'components/button'
import Spinner from 'components/spinner'
import Modal from 'components/modal'
import DialogBox from 'components/dialog-box'

import CloseIcon from 'assets/close.svg'
import EditIcon from 'assets/edit.svg'
import DeleteIcon from 'assets/delete.svg'

import stl from './AvatarActions.module.scss'

interface Props {
  theme: string
  isVisible: boolean
  setIsVisible: (arg: boolean) => void
  user: User
  setShowToast: (arg: boolean) => void
  setToastOpts: (arg: { variant: string; msg: string }) => void
}

const AvatarActions = ({
  theme,
  isVisible,
  setIsVisible,
  user,
  setShowToast,
  setToastOpts,
}: Props) => {
  const [className, setClassName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.key === 'Escape' && setShowModal(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkAvatarActions) : setClassName('')
  }, [theme])

  const handleUpdatePhoto = async (e: any) =>
    await updatePhoto(e, setIsLoading, setShowToast, setToastOpts, user)

  const handleSelectFile = () => {
    const fileInput = document.getElementById('fileInput-2')
    fileInput?.click()
  }

  const handleDelete = async () =>
    await deletePhoto(setShowToast, setToastOpts, user, setIsLoading)

  return (
    <>
      <Modal
        isVisible={showModal}
        dialog={
          <DialogBox
            isVisible={showModal}
            theme={theme}
            msg="Are you sure want delete you Avatar?"
            primaryBtnLabel="Delete Avatar"
            secondaryBtnLabel="Cancel"
            handleCancel={() => setShowModal(false)}
            handleAction={handleDelete}
          />
        }
        theme={theme}
      />
      <div
        className={clsx(
          stl.avatarActions,
          className,
          isVisible ? stl.show : ''
        )}
      >
        <div className={stl.header}>
          <div className={stl.title}>Profile picture</div>
          <span className={stl.closeBtn} onClick={() => setIsVisible(false)}>
            <CloseIcon />
          </span>
        </div>
        {isLoading ? (
          <div className={stl.loading}>
            <Spinner taskTitle="" />
          </div>
        ) : (
          <Image
            src={user?.photoURL || ''}
            alt="profile-avatar"
            width={240}
            height={240}
          />
        )}
        <div className={stl.btnContainer}>
          <input
            id="fileInput-2"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpdatePhoto}
          />
          <Button
            theme={theme}
            label="Change"
            leftIcon={<EditIcon />}
            handleOnClick={handleSelectFile}
          />
          <Button
            theme={theme}
            label="Delete"
            isDisabled={
              user?.photoURL === 'https://i.postimg.cc/Mp7gnttP/default-Pic.jpg'
            }
            leftIcon={<DeleteIcon />}
            variant="secondary"
            handleOnClick={() => setShowModal(true)}
          />
        </div>
      </div>
    </>
  )
}

export default AvatarActions
