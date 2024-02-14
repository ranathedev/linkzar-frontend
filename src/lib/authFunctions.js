import axios from 'axios'
import firebase from 'firebase/app'

import auth from './firebase'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  updateEmail,
  signOut,
  updatePassword,
  deleteUser,
  reauthenticateWithPopup,
} from 'firebase/auth'
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from 'firebase/storage'
import handleAuthErrs from './handleAuthErrs'

const storage = getStorage()

let origin = ''

if (typeof window !== 'undefined') origin = window.location.origin

const actionCodeSettings = {
  url: `${origin}/dashboard`,
  handleCodeInApp: true,
}

const apiUrl = 'https://linkzar.fly.dev/api/'

const signupWithEmailPassword = async (
  fname,
  lname,
  email,
  password,
  setIsLoading,
  setShowToast,
  setToastOpts
) => {
  setIsLoading(true)
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      const user = userCredential.user

      const displayName = (fname + ' ' + lname).trim()

      await updateProfile(user, {
        displayName,
        photoURL: 'https://i.postimg.cc/Mp7gnttP/default-Pic.jpg',
      })
        .then(async () => {
          const data = localStorage.getItem('demoLinks')
          const linksData = localStorage.getItem('links')

          await sendEmailVerification(user, actionCodeSettings)
            .then(async () => {
              setShowToast(true)
              setToastOpts({
                variant: 'success',
                msg: `Verification email sent to: ${email}`,
              })

              setIsLoading(false)
            })
            .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))

          location.href = '/dashboard'

          if (data) {
            localStorage.setItem('links', data)
            if (linksData) localStorage.setItem('links', linksData)
            const originalArray = JSON.parse(data)
            const demoLinks = originalArray.reverse()

            const res = await axios.post(`${apiUrl}demoLinks`, {
              headers: { 'Content-Type': 'application/json' },
              uid: user.uid,
              demoLinks,
            })

            if (res.status === 200) localStorage.removeItem('demoLinks')
          } else {
            const links = []
            localStorage.setItem('links', JSON.stringify(links))

            await axios.post(`${apiUrl}createColl`, {
              headers: { 'Content-Type': 'application/json' },
              uid: user.uid,
            })
          }
        })
        .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))

  setIsLoading(false)
}

const signinWithEmailPassword = async (
  email,
  password,
  setShowToast,
  setToastOpts
) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      const user = userCredential.user
      location.href = '/dashboard'
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

const signinWithGoogle = async (setShowToast, setToastOpts) => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    prompt: 'consent',
  })

  await signInWithPopup(auth, provider)
    .then(async userCredential => {
      const user = userCredential.user

      const data = localStorage.getItem('demoLinks')
      const linksData = localStorage.getItem('links')

      location.href = '/dashboard'

      if (!user.emailVerified) {
        await sendEmailVerification(user, actionCodeSettings)
          .then(async () => {
            setShowToast(true)
            setToastOpts({
              variant: 'success',
              msg: `Verification email sent to: ${email}`,
            })

            setIsLoading(false)
          })
          .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
      }

      if (data) {
        localStorage.setItem('links', data)
        if (linksData) localStorage.setItem('links', linksData)

        const originalArray = JSON.parse(data)
        const demoLinks = originalArray.reverse()

        const res = await axios.post(`${apiUrl}demoLinks`, {
          headers: { 'Content-Type': 'application/json' },
          uid: user.uid,
          demoLinks,
        })

        if (res.status === 200) localStorage.removeItem('demoLinks')
      } else {
        const links = []
        localStorage.setItem('links', JSON.stringify(links))

        await axios.post(`${apiUrl}createColl`, {
          headers: { 'Content-Type': 'application/json' },
          uid: user.uid,
        })
      }
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

const signinWithGithub = async (setShowToast, setToastOpts) => {
  const provider = new GithubAuthProvider()
  provider.setCustomParameters({
    prompt: 'consent',
  })

  signInWithPopup(auth, provider)
    .then(async userCredential => {
      const user = userCredential.user

      const data = localStorage.getItem('demoLinks')
      const linksData = localStorage.getItem('links')

      location.href = '/dashboard'

      if (!user.emailVerified) {
        await sendEmailVerification(user, actionCodeSettings)
          .then(async () => {
            setShowToast(true)
            setToastOpts({
              variant: 'success',
              msg: `Verification email sent to: ${email}`,
            })

            setIsLoading(false)
          })
          .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
      }

      if (data) {
        localStorage.setItem('links', data)
        if (linksData) localStorage.setItem('links', linksData)
        const originalArray = JSON.parse(data)
        const demoLinks = originalArray.reverse()

        const res = await axios.post(`${apiUrl}demoLinks`, {
          headers: { 'Content-Type': 'application/json' },
          uid: user.uid,
          demoLinks,
        })

        if (res.status === 200) localStorage.removeItem('demoLinks')
      } else {
        const links = []
        localStorage.setItem('links', JSON.stringify(links))

        await axios.post(`${apiUrl}createColl`, {
          headers: { 'Content-Type': 'application/json' },
          uid: user.uid,
        })
      }
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

const signinWithMicrosoft = async (setShowToast, setToastOpts) => {
  const provider = new OAuthProvider('microsoft.com')

  provider.setCustomParameters({
    prompt: 'consent',
    tenant: '6b2aaabf-fc70-42aa-bf76-c493c61263fc',
  })
  signInWithPopup(auth, provider)
    .then(async userCredential => {
      const user = userCredential.user

      const data = localStorage.getItem('demoLinks')
      const linksData = localStorage.getItem('links')

      location.href = '/dashboard'

      if (!user.emailVerified) {
        await sendEmailVerification(user, actionCodeSettings)
          .then(async () => {
            setShowToast(true)
            setToastOpts({
              variant: 'success',
              msg: `Verification email sent to: ${email}`,
            })

            setIsLoading(false)
          })
          .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
      }

      if (data) {
        localStorage.setItem('links', data)
        if (linksData) localStorage.setItem('links', linksData)
        const originalArray = JSON.parse(data)
        const demoLinks = originalArray.reverse()

        const res = await axios.post(`${apiUrl}demoLinks`, {
          headers: { 'Content-Type': 'application/json' },
          uid: user.uid,
          demoLinks,
        })

        if (res.status === 200) localStorage.removeItem('demoLinks')
      } else {
        const links = []
        localStorage.setItem('links', JSON.stringify(links))

        await axios.post(`${apiUrl}createColl`, {
          headers: { 'Content-Type': 'application/json' },
          uid: user.uid,
        })
      }
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

const sendVerificationEmail = async (user, setShowToast, setToastOpts) => {
  await sendEmailVerification(user, actionCodeSettings)
    .then(() => {
      setShowToast(true)
      setToastOpts({ variant: 'success', msg: 'Verification Email sent!' })
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

const sendResetPasswordEmail = async (email, setShowToast, setToastOpts) => {
  const actionCodeSettings = {
    url: `${origin}/auth?type=signin`,
    handleCodeInApp: true,
  }
  await sendPasswordResetEmail(auth, email, actionCodeSettings)
    .then(() => {
      setShowToast(true)
      setToastOpts({
        variant: 'success',
        msg: `Password reset email sent to: ${email}`,
      })
    })
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

const updateName = async (
  name,
  setShowToast,
  setToastOpts,
  setLoading,
  user
) => {
  setLoading('Updaing Name')

  await updateProfile(user, {
    displayName: name,
  })
    .then(async () => {
      setShowToast(true)
      setToastOpts({
        variant: 'success',
        msg: 'Name updated successfully.',
      })
    })
    .catch(err => {
      handleAuthErrs(err, setShowToast, setToastOpts)

      setShowToast(true)
      setToastOpts({
        variant: 'danger',
        msg: "Can't update Name.",
      })
    })

  setLoading('')
}

const handleUpdateEmail = async (
  email,
  setShowToast,
  setToastOpts,
  setShowDialog,
  setDialogOpts,
  setLoading,
  user
) => {
  setLoading('Updating Email')
  await updateEmail(user, email)
    .then(async () => {
      await sendEmailVerification(user)
        .then(async () => {
          setShowToast(true)
          setToastOpts({
            variant: 'success',
            msg: 'Email updated successfully.',
          })
        })
        .catch(err => {
          handleAuthErrs(err, setShowToast, setToastOpts)

          setShowToast(true)
          setToastOpts({
            variant: 'danger',
            msg: "Can't update Email.",
          })
        })
    })
    .catch(err => {
      if (err.code === 'auth/requires-recent-login') {
        if (user !== null) {
          user.providerData.forEach(async profile => {
            const providerId = profile.providerId

            let provider
            if (providerId === 'google.com') provider = new GoogleAuthProvider()
            else if (providerId === 'github.com')
              provider = new GithubAuthProvider()
            else if (providerId === 'microsoft.com')
              provider = new OAuthProvider('microsoft.com')

            if (providerId !== 'password') {
              await reauthenticateWithPopup(user, provider)
                .then(async result => {
                  const user = result.user
                  if (!user.emailVerified) {
                    await sendEmailVerification(user)
                      .then(async () => {
                        setShowToast(true)
                        setToastOpts({
                          variant: 'success',
                          msg: 'Email updated successfully.',
                        })
                      })
                      .catch(err => {
                        handleAuthErrs(err, setShowToast, setToastOpts)

                        setShowToast(true)
                        setToastOpts({
                          variant: 'danger',
                          msg: "Can't update Email.",
                        })
                      })
                  }
                })
                .catch(err => console.log('Error:', err))
            }

            if (providerId === 'password') {
              setShowDialog(true)
              setDialogOpts({
                primaryBtnLabel: 'Go to Log In',
                msg: 'You will have to log in again to perform this action.',
                handleAction: () => (location.href = '/auth?type=signin'),
              })
            }
          })
        }
      } else handleAuthErrs(err, setShowToast, setToastOpts)
    })

  setLoading('')
}

const handleUpdatePass = async (
  newPassword,
  setShowToast,
  setToastOpts,
  setShowDialog,
  setDialogOpts,
  setLoading,
  user
) => {
  setLoading('Updating Password')

  await updatePassword(user, newPassword)
    .then(() => {
      setShowToast(true)
      setToastOpts({
        variant: 'success',
        msg: 'Password updated successfully.',
      })
    })
    .catch(err => {
      if (err.code === 'auth/requires-recent-login') {
        if (user !== null) {
          user.providerData.forEach(async profile => {
            const providerId = profile.providerId

            let provider
            if (providerId === 'google.com') provider = new GoogleAuthProvider()
            else if (providerId === 'github.com')
              provider = new GithubAuthProvider()
            else if (providerId === 'microsoft.com')
              provider = new OAuthProvider('microsoft.com')

            if (providerId !== 'password') {
              await reauthenticateWithPopup(user, provider)
                .then(async result => {
                  const user = result.user
                  await updatePassword(user, newPassword)
                    .then(() => {
                      setShowToast(true)
                      setToastOpts({
                        variant: 'success',
                        msg: 'Password updated successfully.',
                      })
                    })
                    .catch(err =>
                      handleAuthErrs(err, setShowToast, setToastOpts)
                    )
                })
                .catch(err => console.log('Error:', err))
            }

            if (providerId === 'password') {
              setDialogOpts({
                primaryBtnLabel: 'Go to Log In',
                msg: 'You will have to log in again to perform this action.',
                handleAction: () => (location.href = '/auth?type=signin'),
              })
              setShowDialog(true)
            }
          })
        }
      } else {
        handleAuthErrs(err, setShowToast, setToastOpts)

        setShowToast(true)
        setToastOpts({
          variant: 'danger',
          msg: "Can't update Password.",
        })
      }
    })

  setLoading('')
}

const updatePhoto = async (
  e,
  setIsLoading,
  setShowToast,
  setToastOpts,
  user
) => {
  setIsLoading(true)
  const file = e.target.files[0]
  const uid = user.uid
  const profilePicRef = ref(storage, `${process.env.BUCKET}/${uid}/profilePic`)
  await deleteObject(profilePicRef)
    .then(() => {})
    .catch(err => {})

  const storageRef = ref(storage, `${process.env.BUCKET}/${uid}/profilePic`)

  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    },
    error => {},
    async () => {
      await getDownloadURL(uploadTask.snapshot.ref)
        .then(async downloadURL => {
          await updateProfile(user, { photoURL: downloadURL })
            .then(async () => {
              setIsLoading(false)
              setShowToast(true)
              setToastOpts({
                variant: 'success',
                msg: 'Profile photo updated.',
              })
            })
            .catch(err => {
              handleAuthErrs(err, setShowToast, setToastOpts)

              setShowToast(true)
              setToastOpts({
                variant: 'danger',
                msg: "Can't update Profile photo.",
              })
            })
        })
        .catch(err => {
          handleAuthErrs(err, setShowToast, setToastOpts)

          setIsLoading(false)
          setShowToast(true)
          setToastOpts({
            variant: 'danger',
            msg: "Can't update Profile photo.",
          })
        })
    }
  )
}

const deletePhoto = async (setShowToast, setToastOpts, user, setIsLoading) => {
  setIsLoading(true)
  const uid = user.uid
  const profilePicRef = ref(storage, `${process.env.BUCKET}/${uid}/profilePic`)

  await deleteObject(profilePicRef)
    .then(async () => {
      const photoURL = 'https://i.postimg.cc/Mp7gnttP/default-Pic.jpg'

      await updateProfile(user, { photoURL })
        .then(() => {
          setShowToast(true)
          setToastOpts({
            variant: 'success',
            msg: 'Profile photo removed.',
          })
        })
        .catch(err => {
          handleAuthErrs(err, setShowToast, setToastOpts)

          setShowToast(true)
          setToastOpts({
            variant: 'danger',
            msg: "Can't update Profile photo.",
          })
        })
    })
    .catch(err => {
      setShowToast(true)
      setToastOpts({
        variant: 'danger',
        msg: "Can't update Profile photo.",
      })
    })

  setIsLoading(false)
}

const deleteAccount = async (
  setShowDialog,
  setDialogOpts,
  setShowToast,
  setToastOpts,
  user
) => {
  await axios
    .post(`${apiUrl}deleteColl`, {
      headers: { 'Content-Type': 'application/json' },
      uid: user.uid,
    })
    .then(async () => {
      await deleteUser(user)
        .then(async () => {
          await localStorage.removeItem('user')
          await localStorage.removeItem('links')
          await localStorage.removeItem('linkCount')
          await localStorage.removeItem('demoLinks')

          location.href = '/auth?type=signup'
        })
        .catch(err => {
          if (err.code === 'auth/requires-recent-login') {
            if (user !== null) {
              user.providerData.forEach(async profile => {
                const providerId = profile.providerId

                let provider
                if (providerId === 'google.com')
                  provider = new GoogleAuthProvider()
                else if (providerId === 'github.com')
                  provider = new GithubAuthProvider()
                else if (providerId === 'microsoft.com')
                  provider = new OAuthProvider('microsoft.com')

                if (providerId !== 'password') {
                  await reauthenticateWithPopup(user, provider)
                    .then(async result => {
                      const user = result.user
                      await deleteUser(user)
                        .then(async () => {
                          await localStorage.removeItem('user')
                          await localStorage.removeItem('links')

                          location.href = '/auth?type=signup'

                          await axios.post(`${apiUrl}deleteColl`, {
                            headers: { 'Content-Type': 'application/json' },
                            uid: user.uid,
                          })
                        })
                        .catch(err =>
                          handleAuthErrs(err, setShowToast, setToastOpts)
                        )
                    })
                    .catch(err => console.log('Error:', err))
                }

                if (providerId === 'password') {
                  setDialogOpts({
                    primaryBtnLabel: 'Go to Log In',
                    msg: 'You will have to Log In again to perform this action.',
                    handleAction: () => (location.href = '/auth?type=signin'),
                  })
                  setShowDialog(true)
                }
              })
            }
          } else handleAuthErrs(err, setShowToast, setToastOpts)
        })
    })
    .catch(err => {
      setShowToast(true)
      setToastOpts({
        variant: 'danger',
        msg: "Can't delete account. Try again.",
      })
    })
}

const logOut = (setShowToast, setToastOpts) => {
  signOut(auth)
    .then(() => (location.href = '/auth?type=signin'))
    .catch(err => handleAuthErrs(err, setShowToast, setToastOpts))
}

export {
  signupWithEmailPassword,
  signinWithEmailPassword,
  signinWithGoogle,
  signinWithGithub,
  signinWithMicrosoft,
  sendVerificationEmail,
  sendResetPasswordEmail,
  updateName,
  handleUpdateEmail,
  handleUpdatePass,
  updatePhoto,
  deletePhoto,
  deleteAccount,
  logOut,
}
