import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import Button from 'components/button'

import ArrowIcon from 'assets/arrow-right.svg'

import stl from './CTA.module.scss'

interface Props {
  theme: string
}

const CTA = ({ theme }: Props) => {
  const [className, setClassName] = React.useState('')
  const router = useRouter()

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkCTA) : setClassName('')
  }, [theme])

  return (
    <section className={clsx(stl.cta, className)}>
      <div className={stl.container}>
        <div className={stl.content}>
          <h2 className={stl.heading}>Short Links, Big Impact!</h2>
          <p className={stl.desc}>
            Optimize sharing with our user-friendly web app for shortened URLs.
          </p>
          <Button
            theme={theme}
            label="Get Started"
            rightIcon={<ArrowIcon />}
            handleOnClick={() => router.push('/dashboard')}
          />
        </div>
      </div>
    </section>
  )
}

export default CTA
