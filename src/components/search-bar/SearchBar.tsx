import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

import { isMac } from 'lib/utils'

import SearchIcon from 'assets/search-icon.svg'

import stl from './SearchBar.module.scss'

interface Props {
  theme: string
  handleSubmit: (arg: string) => void
  handleCancel: () => void
}

const SearchBar = ({ theme, handleSubmit, handleCancel }: Props) => {
  const [className, setClassName] = useState('')
  const [device, setDevice] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkSearchBar) : setClassName('')
  }, [theme])

  useEffect(() => {
    isMac() ? setDevice('Mac') : setDevice('')
  }, [])

  const handleKeydown = (e: any) => {
    e.key === 'Enter' && handleSubmit(value)
    e.key === 'Escape' && handleCancel()
  }

  const handleInput = (e: any) => {
    const value = e.target.value
    value === '' && handleCancel()
  }

  return (
    <div className={clsx(stl.searchBar, className)}>
      <div className={stl.icon}>
        <SearchIcon />
      </div>
      <div className={stl.hint}>
        {device === 'Mac' ? <>&#8984;</> : 'Ctrl'} K
      </div>
      <input
        type="search"
        id="searchInput"
        placeholder="Search"
        spellCheck={false}
        onKeyDown={handleKeydown}
        onChange={e => setValue(e.target.value)}
        onInput={handleInput}
      />
      <button
        title={value === '' ? 'Search box is empty' : 'search'}
        disabled={value === ''}
        onClick={() => handleSubmit(value)}
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar
