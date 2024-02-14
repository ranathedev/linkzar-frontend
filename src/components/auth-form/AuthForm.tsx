import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import Link from "next/link";
import clsx from 'clsx'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import {
  signupWithEmailPassword,
  signinWithEmailPassword,
  signinWithGoogle,
  signinWithGithub,
  signinWithMicrosoft,
} from 'lib/authFunctions'
import { getFields, getInitVals } from 'lib/authFormData'
import InputContainer from 'components/input-container'
import FgtPassDialog from 'components/fgt-pass-dialog'
import Spinner from 'components/spinner'
import Toast from 'components/toast'

import GoogleIcon from 'assets/google.svg'
import GithubIcon from 'assets/github-2.svg'
import MicrosoftIcon from 'assets/microsoft.svg'
// import TickIcon from "assets/tick.svg";

import stl from './AuthForm.module.scss'

interface Props {
  theme: string
}

const AuthForm = ({ theme }: Props) => {
  const [initVals, setInitVals] = useState({
    fname: '',
    lname: '',
    email: '',
    pass: '',
    confirmPass: '',
  })
  const [className, setClassName] = useState('')
  const [formType, setFormType] = useState('signup')
  const [isChecked, setIsChecked] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [resetPass, setResetPass] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastOpts, setToastOpts] = useState({ variant: '', msg: '' })
  const router = useRouter()

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkAuthForm) : setClassName('')
  }, [theme])

  useEffect(() => {
    const type = router.query.type

    if (type) {
      setFormType(type.toString())
      const initVals = getInitVals(type)
      //@ts-ignore
      setInitVals(initVals)
    }

    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const socialMethods = [
    {
      id: 'sign-in-with-google',
      icon: <GoogleIcon />,
      name: 'google',
      onClick: () => signinWithGoogle(setShowToast, setShowToast),
    },
    {
      id: 'sign-in-with-github',
      icon: <GithubIcon />,
      name: 'github',
      onClick: () => signinWithGithub(setShowToast, setShowToast),
    },
    {
      id: 'sign-in-with-microsoft',
      icon: <MicrosoftIcon />,
      name: 'twitter',
      onClick: () => signinWithMicrosoft(setShowToast, setShowToast),
    },
  ]
  const signUpSchema = Yup.object().shape({
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Email is not valid')
      .required('Email is required'),
    pass: Yup.string()
      .required('Password is required')
      .matches(/(?=.*\d)/, 'Password must contain at least 1 digit')
      .matches(/(?=.*[A-Z])/, 'Password must contain at least 1 capital letter')
      .matches(
        /(?=.*[a-z])/,
        'Password must contain at least 1 lowercase letter'
      )
      .matches(
        /(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])/,
        'Password must contain at least 1 special character'
      )
      .min(8, 'Password must be at least 8 characters long'),
    confirmPass: Yup.string()
      .required('Confirm your Password')
      //@ts-ignore
      .oneOf([Yup.ref('pass'), null], "Passwords didn't matched")
      .nullable()
      .required('Confirm Password is required'),
  })

  const signInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email is not valid')
      .required('Email is required'),
  })

  const changeFormType = () => {
    let newType = ''
    if (formType === 'signup') newType = 'signin'
    else if (formType === 'signin') newType = 'signup'

    const currentUrl = new URL(location.href)
    currentUrl.searchParams.set('type', newType)
    window.history.replaceState({}, '', currentUrl.toString())
    router.reload()
  }

  return isLoading ? (
    <Spinner customClass={stl.spinner} />
  ) : resetPass ? (
    <FgtPassDialog theme={theme} setResetPass={setResetPass} />
  ) : (
    <>
      <Toast
        theme={theme}
        isVisible={showToast}
        setShowToast={setShowToast}
        variant={toastOpts.variant}
        content={toastOpts.msg}
      />
      <div className={clsx(stl.authForm, className)}>
        <h2 className={stl.heading}>
          {formType === 'signup'
            ? 'Create your Free Account'
            : 'Log in to your Account'}
        </h2>
        <div className={stl.socialMethod}>
          <span>Sign {formType === 'signup' ? 'up' : 'in'} with</span>
          <div className={stl.btns}>
            {socialMethods.map(item => (
              <button
                key={item.id}
                aria-label={item.id}
                className={stl[`${item.name}Btn`]}
                onClick={item.onClick}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
        <div className={stl.divider}>
          <span className={stl.line} />
          <span className={stl.text}>or</span>
          <span className={stl.line} />
        </div>
        <Formik
          initialValues={initVals}
          validationSchema={formType === 'signup' ? signUpSchema : signInSchema}
          onSubmit={(values, actions) => {
            if ((formType === 'signup' && isChecked) || formType === 'signin') {
              ;(formType === 'signup' &&
                signupWithEmailPassword(
                  values.fname,
                  values.lname,
                  values.email,
                  values.pass,
                  setIsLoading,
                  setShowToast,
                  setToastOpts
                )) ||
                (formType === 'signin' &&
                  signinWithEmailPassword(
                    values.email,
                    values.pass,
                    setShowToast,
                    setToastOpts
                  ))
              actions.resetForm()
              setIsChecked(false)
            } else alert('Agree to our terms and conditions to create account.')
          }}
        >
          <Form>
            {getFields(formType)?.map(field => (
              <InputContainer
                theme={theme}
                key={field.id}
                id={field.id}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
              />
            ))}
            {formType === 'signup' ? null : ( // </div> //   </label> //     I agree to the <Link href="#">terms and conditions</Link>. //   <label htmlFor="agreement"> //   </span> //     <TickIcon /> //   > //     onClick={() => setIsChecked(!isChecked)} //     className={clsx(stl.checkbox, isChecked ? stl.checked : "")} //   <span // <div className={stl.checkboxContainer}>
              <div className={stl.forgotPassword}>
                <span onClick={() => setResetPass(true)}>Forgot password?</span>
              </div>
            )}
            <button className={stl.btn} type="submit">
              {formType === 'signup' ? 'Create an account' : 'Log in'}
            </button>
          </Form>
        </Formik>
        <div className={stl.authSwitch}>
          {formType === 'signup'
            ? 'Already have an account? '
            : "Don't have an account yet? "}
          <span onClick={changeFormType}>
            {formType === 'signup' ? 'Sign in' : 'Sign up for an account'}
          </span>
        </div>
      </div>
    </>
  )
}

AuthForm.defaultProps = {
  formType: 'signup',
}

export default AuthForm
