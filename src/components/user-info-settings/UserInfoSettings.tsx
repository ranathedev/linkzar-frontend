import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { User } from 'firebase/auth'

import {
  updateName,
  handleUpdateEmail,
  handleUpdatePass,
  logOut,
  deleteAccount,
} from 'lib/authFunctions'
import Button from 'components/button'
import AvatarContainer from 'components/avatar-container'
import Modal from 'components/modal'
import DialogBox from 'components/dialog-box'
import Toast from 'components/toast'
import Spinner from 'components/spinner'

import stl from './UserInfoSettings.module.scss'

interface Props {
  theme: string
  user: User
}

const UserInfoSettings = ({ theme, user }: Props) => {
  const [className, setClassName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPass, setNewPass] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastOpts, setToastOpts] = useState({ variant: '', msg: '' })
  const [loading, setLoading] = useState('')
  const [dialogOpts, setDialogOpts] = useState({
    primaryBtnLabel: 'Yes, Delete',
    msg: 'Are you sure want to delete your account?',
    handleAction: () => {},
  })

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.key === 'Escape' && setShowDialog(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkUserInforSet) : setClassName('')
  }, [theme])

  const changeName = async () => {
    await updateName(name, setShowToast, setToastOpts, setLoading, user)

    setName('')
  }

  const changeEmail = async () => {
    const validateEmail = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(email)
    }

    if (validateEmail()) {
      await handleUpdateEmail(
        email,
        setShowToast,
        setToastOpts,
        setShowDialog,
        setDialogOpts,
        setLoading,
        user
      )
    } else {
      setShowToast(true)
      setToastOpts({ variant: 'warn', msg: 'Email address is not valid.' })
    }

    setEmail('')
  }

  const changePass = async () => {
    await handleUpdatePass(
      newPass,
      setShowToast,
      setToastOpts,
      setShowDialog,
      setDialogOpts,
      setLoading,
      user
    )

    setNewPass('')
  }

  const showDeleteDialog = () => {
    setDialogOpts({
      primaryBtnLabel: 'Yes, Delete',
      msg: 'Are you sure want to delete your account?',
      handleAction: handleDelete,
    })
    setShowDialog(true)
  }

  const handleDelete = () => {
    deleteAccount(
      setShowDialog,
      setDialogOpts,
      setShowToast,
      setToastOpts,
      user
    )
    setShowDialog(false)
  }

  return (
    <>
      <Modal
        theme={theme}
        isVisible={showDialog}
        dialog={
          <DialogBox
            theme={theme}
            isVisible={showDialog}
            handleAction={dialogOpts.handleAction}
            handleCancel={() => setShowDialog(false)}
            msg={dialogOpts.msg}
            primaryBtnLabel={dialogOpts.primaryBtnLabel}
          />
        }
      />
      <Toast
        theme={theme}
        isVisible={showToast}
        variant={toastOpts.variant}
        content={toastOpts.msg}
        setShowToast={setShowToast}
      />
      <div className={clsx(stl.userInfoSettings, className)}>
        <h1 className={stl.heading}>Edit Profile</h1>
        <div className={stl.container}>
          <AvatarContainer
            theme={theme}
            user={user}
            setShowToast={setShowToast}
            setToastOpts={setToastOpts}
            customClass={stl.avatar}
          />
          <div className={stl.basicInfo}>
            {loading === 'Updating Name' ? (
              <Spinner taskTitle={loading} />
            ) : (
              <div className={stl.inputContainer}>
                <label htmlFor="name">Name</label>
                <input
                  name="name"
                  placeholder={user?.displayName || 'John Doe'}
                  onChange={e => setName(e.target.value)}
                  value={name}
                />
                <div
                  className={clsx(
                    stl.btnContainer,
                    name !== '' ? stl.show : ''
                  )}
                >
                  <Button
                    theme={theme}
                    label="Change Name"
                    handleOnClick={changeName}
                  />
                </div>
              </div>
            )}
            {loading === 'Updating Email' ? (
              <Spinner taskTitle={loading} />
            ) : (
              <div className={stl.inputContainer}>
                <label htmlFor="email">Your email</label>
                <input
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder={user?.email || 'johndoe@gmail.com'}
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
                <div
                  className={clsx(
                    stl.btnContainer,
                    email !== '' ? stl.show : ''
                  )}
                >
                  <Button
                    theme={theme}
                    label="Change Email"
                    handleOnClick={changeEmail}
                  />
                </div>
              </div>
            )}
            {loading === 'Updating Password' ? (
              <Spinner taskTitle={loading} />
            ) : (
              <div className={stl.inputContainer}>
                <label htmlFor="newPass">New Password</label>
                <input
                  type="password"
                  autoComplete="off"
                  name="newPass"
                  placeholder="Enter your new password"
                  onChange={e => setNewPass(e.target.value)}
                  value={newPass}
                />
                <div
                  className={clsx(
                    stl.btnContainer,
                    newPass !== '' ? stl.show : ''
                  )}
                >
                  <Button
                    theme={theme}
                    label="Change Password"
                    handleOnClick={changePass}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={stl.accContainer}>
            <div className={stl.inputContainer}>
              <label>Logout</label>
              <div className={stl.msg}>Log out from account?</div>
              <div className={clsx(stl.btnContainer, stl.logoutBtn)}>
                <Button
                  theme={theme}
                  label="Log out"
                  handleOnClick={() => logOut(setShowToast, setToastOpts)}
                />
              </div>
            </div>
            <div className={stl.inputContainer}>
              <label>Delete this account</label>
              <div className={stl.msg}>
                Your data will be lost and cannot be recovered.
              </div>
              <div className={clsx(stl.btnContainer, stl.delBtn)}>
                <Button
                  theme={theme}
                  label="Delete"
                  variant="danger"
                  handleOnClick={showDeleteDialog}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserInfoSettings
