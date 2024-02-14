import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import {
  isMobileDevice,
  shareShortLink,
  inputFocus,
  handleDelLink,
} from 'lib/utils'
import useOnClickOutside from 'lib/useClickOutside'
import Modal from 'components/modal'
import DialogBox from 'components/dialog-box'
import Spinner from 'components/spinner'
import ShareMenu from 'components/share-menu'

import MoreIcon from 'assets/more-icon.svg'
import OpenLinkIcon from 'assets/openLink.svg'
import CopyIcon from 'assets/copy.svg'
import ShareIcon from 'assets/share.svg'
import EditIcon from 'assets/edit.svg'
import DeleteIcon from 'assets/delete.svg'
import DoneIcon from 'assets/done.svg'

import stl from './ActionBox.module.scss'

interface Props {
  display: string
  theme: string
  variant: 'primary' | 'secondary'
  domainUrl: string
  linkData: {
    _id: string
    shortId: string
    originalURL: string
    createdDate: string
    clickCounts: number
  }
  setShowEditor: (arg: boolean) => void
  setShowModal: (arg: boolean) => void
  increaseClickCount: (arg: string) => void
  sendResponse: (arg: Object) => void
  uid: string
  sendVisibility: (arg: boolean) => void
}

const ActionBox = ({
  theme,
  display,
  variant,
  domainUrl,
  linkData,
  setShowEditor,
  setShowModal,
  sendResponse,
  increaseClickCount,
  uid,
  sendVisibility,
}: Props) => {
  const [showActionList, setShowActionList] = useState(false)
  const [device, setDevice] = useState('')
  const [className, setClassName] = useState('')
  const [loading, setLoading] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showShortTooltip, setShowShortTooltip] = useState(false)
  const [showLongTooltip, setShowLongTooltip] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: any) =>
      e.key === 'Escape' && setShowActionList(false)

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkActionBox) : setClassName('')
  }, [theme])

  useEffect(() => {
    isMobileDevice() ? setDevice('Mobile') : setDevice('')
  }, [])

  useEffect(() => {
    showShortTooltip && setTimeout(() => setShowShortTooltip(false), 1500)
    showLongTooltip && setTimeout(() => setShowLongTooltip(false), 1500)
  }, [showShortTooltip, showLongTooltip])

  useEffect(() => {
    sendVisibility(showActionList)
  }, [showActionList])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const spaceFromBottom =
        window.innerHeight - ref.current.getBoundingClientRect().bottom

      if (spaceFromBottom >= 245) {
        ref.current.classList.remove(stl.growAbove)
        ref.current.classList.add(stl.growBelow)
      } else {
        ref.current.classList.remove(stl.growBelow)
        ref.current.classList.add(stl.growAbove)
      }
    }
  }, [showActionList])

  const hideActionList = () => {
    setShowActionList(false)
    setShowShareMenu(false)
  }

  useOnClickOutside(hideActionList, ref)

  const openLink = (link: string) => {
    window.open(link, '_blank')
    hideActionList()
  }

  const copyToClipboard = async (text: string) =>
    await navigator.clipboard.writeText(text)

  const handleShare = (link: string) => {
    shareShortLink(link)
    hideActionList()
  }

  const handleLinkEdit = () => {
    setShowModal(true)
    setShowEditor(true)
    hideActionList()
    inputFocus('editerInput')
  }

  const showDeleteDialog = () => {
    setShowDialog(true)
    hideActionList()
  }

  const handleDelete = () => {
    handleDelLink(linkData._id, setLoading, sendResponse, uid)
    setShowDialog(false)
  }

  return (
    <>
      <Modal
        isVisible={showDialog || loading !== ''}
        theme={theme}
        dialog={
          loading !== '' ? (
            <Spinner taskTitle={loading} variant="secondary" />
          ) : (
            <DialogBox
              theme={theme}
              isVisible={showDialog}
              handleAction={handleDelete}
              handleCancel={() => setShowDialog(false)}
            />
          )
        }
      />
      <div
        ref={ref}
        style={{ display }}
        className={clsx(stl.actionsBox, className, stl[variant])}
      >
        <button onClick={() => setShowActionList(!showActionList)}>
          <MoreIcon />
        </button>
        <ul className={showActionList ? stl.showList : ''}>
          <li
            onClick={() => {
              openLink(domainUrl + linkData.shortId)
              increaseClickCount(linkData._id)
            }}
          >
            <OpenLinkIcon /> Open short link
          </li>
          <li onClick={() => openLink(linkData.originalURL)}>
            <OpenLinkIcon />
            Open original link
          </li>
          <li
            onClick={() => {
              copyToClipboard(domainUrl + linkData.shortId)
              setShowShortTooltip(true)
            }}
          >
            {showShortTooltip ? <DoneIcon /> : <CopyIcon />} Copy short link
          </li>
          <li
            onClick={() => {
              copyToClipboard(linkData.originalURL)
              setShowLongTooltip(true)
            }}
          >
            {showLongTooltip ? <DoneIcon /> : <CopyIcon />}
            Copy original link
          </li>
          {device === 'Mobile' ? (
            <li onClick={() => handleShare(domainUrl + linkData.shortId)}>
              <ShareIcon /> Share
            </li>
          ) : (
            <>
              <li className={stl.share} onClick={() => setShowShareMenu(true)}>
                <ShareIcon /> Share
              </li>
              <ShareMenu
                theme={theme}
                isVisible={showShareMenu}
                setShowShareMenu={setShowShareMenu}
                shortId={linkData.shortId}
                customClass={stl.shareMenu}
              />
            </>
          )}
          <li onClick={handleLinkEdit}>
            <EditIcon /> Edit
          </li>
          <li onClick={showDeleteDialog}>
            <DeleteIcon /> Delete
          </li>
        </ul>
      </div>
    </>
  )
}

ActionBox.defaultProps = {
  display: 'inline-flex',
  variant: 'primary',
}

export default ActionBox
