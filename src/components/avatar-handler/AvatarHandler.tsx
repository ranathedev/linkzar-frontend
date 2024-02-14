import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { User } from 'firebase/auth'

import { updatePhoto, deletePhoto } from 'lib/authFunctions'
import Button from 'components/button'
import AvatarContainer from 'components/avatar-container'
import Spinner from 'components/spinner'
import Toast from 'components/toast'
import Modal from 'components/modal'
import DialogBox from 'components/dialog-box'

import EditIcon from 'assets/edit.svg'
import DeleteIcon from 'assets/delete.svg'
import InfoIcon from 'assets/info.svg'

import stl from './AvatarHandler.module.scss'

interface Props {
  theme: string
  user: User
  customClass?: string
}

const AvatarHandler = ({ theme, user, customClass }: Props) => {
  const [className, setClassName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toastOpts, setToastOpts] = useState({ variant: '', msg: '' })

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.key === 'Escape' && setShowModal(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkAvatarHandler) : setClassName('')
  }, [theme])

  const handleUpdatePhoto = async (e: any) => {
    await updatePhoto(e, setIsLoading, setShowToast, setToastOpts, user)
  }

  const handleSelectFile = () => {
    const fileInput = document.getElementById('fileInput-1')
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
      <Toast
        theme={theme}
        isVisible={showToast}
        variant={toastOpts.variant}
        content={toastOpts.msg}
        setShowToast={setShowToast}
      />
      <div className={clsx(stl.avatarHandler, className, customClass)}>
        <div className={stl.name}>{user?.displayName}</div>
        {isLoading ? (
          <div className={stl.loading}>
            <Spinner taskTitle="" />
          </div>
        ) : (
          <AvatarContainer
            theme={theme}
            user={user}
            setShowToast={setShowToast}
            setToastOpts={setToastOpts}
          />
        )}
        <div className={stl.btnContainer}>
          <input
            id="fileInput-1"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpdatePhoto}
          />
          <Button
            theme={theme}
            label="Change Avatar"
            leftIcon={<EditIcon />}
            handleOnClick={handleSelectFile}
          />
          <Button
            theme={theme}
            isDisabled={
              user?.photoURL === 'https://i.postimg.cc/Mp7gnttP/default-Pic.jpg'
            }
            label="Delete Avatar"
            variant="secondary"
            leftIcon={<DeleteIcon />}
            handleOnClick={() => setShowModal(true)}
          />
        </div>
        <div className={stl.note}>
          <InfoIcon /> Maximum upload size is <b>1 MB</b>.
        </div>
      </div>
    </>
  )
}

export default AvatarHandler
