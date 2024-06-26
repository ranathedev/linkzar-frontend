import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

import { editLink } from 'lib/utils'
import Button from 'components/button'
import InputError from 'components/input-error'

import stl from './LinkEditor.module.scss'
import { LinkType } from 'lib/type'

interface Props {
  theme: string
  showEditor: boolean
  linkData: LinkType
  setShowEditor: (arg: boolean) => void
  sendResponse: (arg: Object) => void
  setLoading: (arg: string) => void
  setShowModal: (arg: boolean) => void
  uid: string
}

const LinkEditor = ({
  theme,
  showEditor,
  linkData,
  setShowEditor,
  sendResponse,
  setLoading,
  setShowModal,
  uid,
}: Props) => {
  const [error, setError] = useState('')
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('')

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkLinkEditor) : setClassName('')
  }, [theme])

  useEffect(() => {
    !showEditor && setValue('')
  }, [showEditor])

  const isAlphanumeric = (e: any) => {
    const input = e.target
    const inputVal = input.value
    const alphanumericRegex = /^[a-zA-Z0-9]*$/
    const isAlphanumeric = alphanumericRegex.test(inputVal)

    if (inputVal.length <= 7) {
      if (!isAlphanumeric) {
        setValue(inputVal.replace(/[^a-zA-Z0-9]/g, ''))
        setError('Only alphanumeric characters are allowed.')
      } else {
        setValue(inputVal)
        setError('')
      }
    } else setError('Alias cannot be more than 7 chars.')
  }

  const handleSubmit = async () => {
    setLoading('Editing link')

    if (value.length < 5) setError('Alias cannot be less than 5 chars.')
    else {
      setError('')
      setShowEditor(false)
      const response = await editLink(linkData._id, value, uid)
      sendResponse(response)
    }

    setLoading('')
  }

  const handleKeyDown = (e: any) => e.key === 'Enter' && handleSubmit()

  const handleCancel = () => {
    setShowEditor(false)
    setShowModal(false)
  }

  return (
    <div
      className={clsx(stl.linkEditor, showEditor ? stl.show : '', className)}
    >
      <input
        id="editerInput"
        placeholder={linkData.shortId}
        onChange={isAlphanumeric}
        onKeyDown={handleKeyDown}
        value={value}
        spellCheck={false}
      />
      <InputError theme={theme} error={error} />
      <div className={stl.btnContainer}>
        <Button
          theme={theme}
          label="Cancel"
          variant="secondary"
          handleOnClick={handleCancel}
        />
        <Button
          theme={theme}
          label="Change"
          variant="primary"
          handleOnClick={handleSubmit}
        />
      </div>
    </div>
  )
}

LinkEditor.defaultProps = {
  showEditor: false,
  linkData: {
    _id: '1234567890',
    shortId: 'aftab',
    originalURL: 'https://www.google.com/',
    clickCounts: 300,
    createdDate: '10-Aug-2023',
  },
}

export default LinkEditor
