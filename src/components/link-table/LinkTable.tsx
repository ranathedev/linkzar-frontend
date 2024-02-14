import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

import { User } from 'firebase/auth'
import { getLinks, isMobileDevice } from 'lib/utils'
import { LinkType } from 'lib/type'
import TableRow from 'components/table-row'
import SearchBar from 'components/search-bar'
import LoadingSpinner from 'components/loading-spinner'
import Button from 'components/button'
import Modal from 'components/modal'
import URLShortener from 'components/url-shortener'
import Toast from 'components/toast'

import RefreshIcon from 'assets/refresh.svg'
import AddIcon from 'assets/plus.svg'

import stl from './LinkTable.module.scss'

interface Props {
  theme: string
  domainUrl: string
  user: User
}

const LinkTable = ({ theme, domainUrl, user }: Props) => {
  const [className, setClassName] = useState('')
  const [listOfLinks, setListOfLinks] = useState<LinkType[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastOpts, setToastOpts] = useState({ variant: '', msg: '' })
  const [device, setDevice] = useState('')
  const [searchMsg, setSearchMsg] = useState('')
  const [allLinks, setAllLinks] = useState<LinkType[]>([])

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.key === 'Escape' && setShowModal(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkLinkTable) : setClassName('')
  }, [theme])

  useEffect(() => {
    const linksData = localStorage.getItem('links')
    if (linksData) {
      //@ts-ignore
      const links = JSON.parse(linksData)
      setListOfLinks(links)
    }

    isMobileDevice() ? setDevice('mobile') : setDevice('')
  }, [])

  const refresh = async () => {
    const links = await getLinks(setIsRefreshing, user?.uid)

    if (!links.err) {
      setShowToast(false)
      setListOfLinks(links)
    } else {
      setShowToast(true)
      setToastOpts({ variant: 'danger', msg: "Can't refresh collection." })
    }
  }

  const saveDataToLocalStorage = async (data: Array<LinkType>) =>
    await localStorage.setItem('links', JSON.stringify(data))

  const addNewLink = async (newLink: LinkType) => {
    const updatedList = await [...listOfLinks]
    updatedList.unshift(newLink)

    setListOfLinks(updatedList)
    saveDataToLocalStorage(updatedList)
  }

  const removeLink = async (linkId: string) => {
    const updatedList = await listOfLinks.filter(link => link._id !== linkId)

    setTimeout(() => {
      saveDataToLocalStorage(updatedList)
      setListOfLinks(updatedList)
    }, 500)
  }

  const updateLinkInList = async (updatedLink: LinkType) => {
    const updatedListOfLinks = await listOfLinks.map(link =>
      link._id === updatedLink._id ? updatedLink : link
    )

    setListOfLinks(updatedListOfLinks)
    saveDataToLocalStorage(updatedListOfLinks)
  }

  const increaseClickCount = async (linkId: string) => {
    const linkIndex = await listOfLinks.findIndex(link => link._id === linkId)

    if (linkIndex !== -1) {
      const updatedLinks = await [...listOfLinks]

      updatedLinks[linkIndex].clickCounts += 1

      setListOfLinks(updatedLinks)
      saveDataToLocalStorage(updatedLinks)
    }
  }

  const filterLinks = async (keyword: string) => {
    setIsRefreshing(true)
    setAllLinks(listOfLinks)
    const filteredArray = listOfLinks.filter(link =>
      link.shortId.includes(keyword)
    )

    setListOfLinks(filteredArray)
    filteredArray.length <= 0 &&
      setSearchMsg('Sorry, No link matches your search')

    setIsRefreshing(false)
  }

  const handleCancel = () => {
    if (allLinks.length > 0) setListOfLinks(allLinks)
    setSearchMsg('')
    setAllLinks([])
  }

  return (
    <>
      <Toast
        theme={theme}
        isVisible={showToast}
        setShowToast={setShowToast}
        variant={toastOpts.variant}
        content={toastOpts.msg}
      />
      <Modal
        isVisible={showModal}
        theme={theme}
        dialog={
          <URLShortener
            domainUrl={domainUrl}
            isVisible={showModal}
            sendNewLink={addNewLink}
            setShowModal={setShowModal}
            sendDeleteId={removeLink}
            theme={theme}
            uid={user?.uid}
          />
        }
      />
      <div className={clsx(stl.linkTable, className)}>
        <SearchBar
          theme={theme}
          handleCancel={handleCancel}
          handleSubmit={filterLinks}
        />
        <div className={stl.btn}>
          <Button
            label="Create New"
            leftIcon={<AddIcon />}
            theme={theme}
            handleOnClick={() => setShowModal(true)}
          />
          <div
            className={clsx(stl.refresh, isRefreshing ? stl.animation : '')}
            onClick={refresh}
          >
            <RefreshIcon />
            <span>Refresh</span>
          </div>
        </div>
        <div className={stl.table}>
          <div className={stl.header}>
            <span className={stl.shortLink}>Short Link</span>
            <span className={stl.originalLink}>Original Link</span>
            <span className={stl.clicks}>Clicks</span>
            <span className={stl.date}>Date</span>
            <div className={stl.emptyBox} />
          </div>
          {isRefreshing ? (
            <div className={stl.loadingContainer}>
              <LoadingSpinner loading={isRefreshing} />
            </div>
          ) : (
            <div className={stl.listContainer}>
              {listOfLinks.length > 0 ? (
                listOfLinks.map(linkItem => (
                  <TableRow
                    key={linkItem._id}
                    domainUrl={domainUrl}
                    theme={theme}
                    sendDeleteId={removeLink}
                    sendUpdatedLinks={updateLinkInList}
                    increaseClickCount={increaseClickCount}
                    linkData={linkItem}
                    uid={user?.uid}
                  />
                ))
              ) : searchMsg !== '' ? (
                <p className={stl.note}>{searchMsg}</p>
              ) : device === 'mobile' ? (
                <p className={stl.note}>
                  You haven&apos;t added any links yet. Let&apos;s start
                  building your collection. Tap the <b>Create New</b> or{' '}
                  <b>+</b> button to add your first link.
                </p>
              ) : (
                <p className={stl.note}>
                  You haven&apos;t added any links yet. Let&apos;s start
                  building your collection. Click the <b>Create New</b> button
                  to add your first link.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default LinkTable
