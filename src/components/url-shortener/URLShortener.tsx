import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import {
  isMobileDevice,
  createShortLink,
  generateRandomString,
  shareShortLink,
  validateUrl,
  inputFocus,
  handleDelLink,
} from 'lib/utils'
import { LinkType } from 'lib/type'
import Button from 'components/button'
import Spinner from 'components/spinner'
import DialogBox from 'components/dialog-box'
import Modal from 'components/modal'
import InputError from 'components/input-error'
import Tooltip from 'components/tooltip'
import Toast from 'components/toast'
import ShareMenu from 'components/share-menu'

import LinkIcon from 'assets/link.svg'
import OpenLinkIcon from 'assets/openLink.svg'
import CopyIcon from 'assets/copy.svg'
import ShareIcon from 'assets/share.svg'
import DeleteIcon from 'assets/delete.svg'
import DoneIcon from 'assets/done.svg'
import TextIcon from 'assets/text.svg'

import stl from './URLShortener.module.scss'

interface Props {
  theme: string
  isVisible: boolean
  domainUrl: string
  setShowModal: (arg: boolean) => void
  sendNewLink: (arg: LinkType) => void
  sendDeleteId: (arg: string) => void
  uid: string
  path: string
}

const URLShortener = ({
  theme,
  isVisible,
  domainUrl,
  setShowModal,
  sendNewLink,
  sendDeleteId,
  uid,
  path,
}: Props) => {
  const [url, setURL] = useState('')
  const [alias, setAlias] = useState('')
  const [linkData, setLinkData] = useState({
    _id: '',
    shortId: '',
    originalURL: '',
    clickCounts: 0,
  })
  const [loading, setLoading] = useState('')
  const [className, setClassName] = useState('')
  const [device, setDevice] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [urlErr, setUrlErr] = useState('')
  const [aliasErr, setAliasErr] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastOpts, setToastOpts] = useState({ variant: '', msg: '' })
  const [linksCount, setLinksCount] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkURLShortener) : setClassName('')
  }, [theme])

  useEffect(() => {
    if (uid === 'links') {
      const data = localStorage.getItem('linksCount')
      if (data) {
        //@ts-ignore
        const linksCount = JSON.parse(data)
        setLinksCount(linksCount)
      }
    }
    isMobileDevice() ? setDevice('Mobile') : setDevice('')
  }, [uid])

  useEffect(() => {
    showTooltip && setTimeout(() => setShowTooltip(false), 1500)
  }, [showTooltip])

  useEffect(() => {
    isVisible ? inputFocus('originalLink') : handleReset()
  }, [isVisible])

  const handleReset = () => {
    setURL('')
    setAlias('')
    setUrlErr('')
    setAliasErr('')
    setLinkData({
      _id: '',
      shortId: '',
      originalURL: '',
      clickCounts: 0,
    })
  }

  const handleKeyDown = (e: any) => {
    setUrlErr('')
    setAliasErr('')

    if (e.key === 'Enter') {
      if (uid === 'links') {
        if (linksCount < 3) handleSubmit()
        else {
          setShowToast(true)
          setToastOpts({
            variant: 'warn',
            msg: '3 Links Created! Sign Up to Create More.',
          })
          handleReset()
        }
      } else handleSubmit()
    }
  }

  const handleChange = (e: any) => {
    const input = e.target
    const inputVal = input.value
    const alphanumericRegex = /^[a-zA-Z0-9]*$/
    const isAlphanumeric = alphanumericRegex.test(inputVal)

    if (inputVal.length <= 7) {
      if (!isAlphanumeric) {
        setAlias(inputVal.replace(/[^a-zA-Z0-9]/g, ''))
        setAliasErr('Only alphanumeric characters are allowed.')
      } else {
        setAlias(inputVal)
        setAliasErr('')
      }
    } else setAliasErr('Alias cannot be more than 7 chars.')
  }

  const handleSubmit = async () => {
    const isValidURL = validateUrl(url)

    if (url !== '') {
      if (isValidURL) {
        if (alias === '' || alias.length >= 5) {
          const shortId = alias === '' ? generateRandomString(7) : alias

          const response = await createShortLink(setLoading, shortId, url, uid)

          if (response.err) {
            setShowToast(true)
            setToastOpts({
              variant: 'warn',
              msg: response.err,
            })
          } else if (response.count) {
            setLinkData(response.document)
            if (uid === 'links') {
              const updatedLinkCount = linksCount + response.count
              setLinksCount(updatedLinkCount)
              const stringData = JSON.stringify(updatedLinkCount)
              localStorage.setItem('linksCount', stringData)

              const data = localStorage.getItem('demoLinks')
              if (data) {
                const existingData = JSON.parse(data)
                const updatedData = [...existingData, response.document]
                const stringData = JSON.stringify(updatedData)
                localStorage.setItem('demoLinks', stringData)
              } else {
                const demoLinks = [response.document]
                const stringData = JSON.stringify(demoLinks)
                localStorage.setItem('demoLinks', stringData)
              }
            } else sendNewLink(response.document)

            setShowToast(true)
            setToastOpts({
              variant: 'success',
              msg: 'Link created successfully!',
            })
          }
        } else setAliasErr('Alias cannot be less than 5 chars.')
      } else setUrlErr('Url is not valid.')
    } else setUrlErr('Url cannot be empty.')
  }

  const getResponse = (res: any) => {
    if (!res.err) {
      setShowToast(true)
      setToastOpts({ variant: 'success', msg: 'Link deleted successfully!' })
      handleReset()
      sendDeleteId(linkData._id)
      if (uid === 'links') {
        const data = localStorage.getItem('linksCount')
        if (data) {
          //@ts-ignore
          const linksCount = JSON.parse(data)
          const stringData = JSON.stringify(linksCount - 1)
          localStorage.setItem('linksCount', stringData)
          setLinksCount(linksCount - 1)
        }

        const demoLinksData = localStorage.getItem('demoLinks')
        if (demoLinksData) {
          const existingData = JSON.parse(demoLinksData)
          const updatedData = existingData.filter(
            (item: LinkType) => item._id !== linkData._id
          )
          const stringData = JSON.stringify(updatedData)
          localStorage.setItem('demoLinks', stringData)
        }
      }
    } else {
      setShowToast(true)
      setToastOpts({ variant: 'danger', msg: res.err })
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setShowTooltip(true)
  }

  const handleDelete = () => {
    handleDelLink(linkData._id, setLoading, getResponse, uid)
    setShowDialog(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    setAliasErr('')
    setUrlErr('')
  }

  return (
    <>
      <Modal
        isVisible={showDialog}
        theme={theme}
        dialog={
          <DialogBox
            theme={theme}
            isVisible={showDialog}
            handleAction={handleDelete}
            handleCancel={handleCancel}
          />
        }
      />
      <Toast
        variant={toastOpts.variant}
        content={toastOpts.msg}
        theme={theme}
        isVisible={showToast}
        setShowToast={setShowToast}
      />
      <div
        className={clsx(stl.urlShortener, isVisible ? stl.show : '', className)}
      >
        {loading !== '' ? (
          <Spinner taskTitle={loading} />
        ) : (
          <>
            <h2 className={stl.heading}>Shorten New Link</h2>
            {linkData.shortId === '' && (
              <div className={stl.searchBar}>
                <div className={stl.searchIcon}>
                  <LinkIcon />
                </div>
                <input
                  value={url}
                  id="originalLink"
                  placeholder="Enter link here"
                  onChange={e => setURL(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                />
                <InputError theme={theme} error={urlErr} />
                <div className={stl.aliasContainer}>
                  <div className={stl.textIcon}>
                    <TextIcon />
                  </div>
                  <input
                    id="shortId"
                    className={stl.alias}
                    placeholder="Alias must be 5 chars. (optional)"
                    value={alias}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                  />
                </div>
                <InputError theme={theme} error={aliasErr} />
                <div className={stl.btnContainer}>
                  {path !== '/shorten' && (
                    <Button
                      label="Back to Dashboard"
                      theme={theme}
                      variant="secondary"
                      handleOnClick={handleCancel}
                    />
                  )}
                  <Button
                    label="Shorten URL"
                    theme={theme}
                    handleOnClick={() => handleKeyDown({ key: 'Enter' })}
                  />
                </div>
              </div>
            )}
            {linkData.originalURL !== '' && (
              <div className={stl.longURL}>
                Long URL :{' '}
                <Link href={linkData.originalURL} target="_blank">
                  {linkData.originalURL}
                  <span>
                    <OpenLinkIcon />
                  </span>
                </Link>
              </div>
            )}
            {linkData.shortId !== '' && (
              <div className={stl.shortURL}>
                Short URL :{' '}
                <div
                  className={clsx(
                    stl.link,
                    isMobileDevice() ? '' : stl.hideOptions
                  )}
                >
                  {domainUrl + linkData.shortId}
                  <div className={stl.optContainer}>
                    <div className={stl.options}>
                      <button
                        className={stl.btn}
                        onClick={() =>
                          copyToClipboard(domainUrl + linkData.shortId)
                        }
                      >
                        {showTooltip ? <DoneIcon /> : <CopyIcon />}
                        <Tooltip theme={theme} isVisible={showTooltip} />
                      </button>
                      <button
                        className={stl.btn}
                        onClick={() =>
                          window.open(domainUrl + linkData.shortId, '_blank')
                        }
                      >
                        <OpenLinkIcon />
                      </button>
                      {device === 'Mobile' ? (
                        <button
                          className={stl.btn}
                          onClick={() =>
                            shareShortLink(domainUrl + linkData.shortId)
                          }
                        >
                          <ShareIcon />
                        </button>
                      ) : (
                        <>
                          <button
                            className={clsx(stl.btn, stl.shareBtn)}
                            onClick={() => setShowShareMenu(true)}
                          >
                            <ShareIcon />
                          </button>
                          <ShareMenu
                            theme={theme}
                            isVisible={showShareMenu}
                            setShowShareMenu={setShowShareMenu}
                            shortId={linkData.shortId}
                          />
                        </>
                      )}
                      <button
                        className={stl.btn}
                        onClick={() => setShowDialog(true)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className={stl.btnContainer}>
              {linkData.shortId !== '' && (
                <>
                  {path !== '/shorten' && (
                    <Button
                      label="Back to Dashboard"
                      theme={theme}
                      variant="secondary"
                      handleOnClick={handleCancel}
                    />
                  )}
                  <Button
                    label="Shorten another"
                    rightIcon={<LinkIcon />}
                    theme={theme}
                    handleOnClick={handleReset}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

URLShortener.defaultProps = {
  isVisible: false,
  setShowModal: () => true,
  path: '',
}

export default URLShortener
