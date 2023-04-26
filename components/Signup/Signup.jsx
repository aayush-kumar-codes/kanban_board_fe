import React, { useState ,useEffect} from 'react'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useFormik } from 'formik'
import Axios from '../../src/utils/Axios'

function Signup() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleRequest = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      const request = await Axios.post('/api/auth/register/', data)
      if (request.data?.data?.access_token) {
        localStorage.setItem('token', request.data?.data?.access_token)
        localStorage.setItem('refresh', request.data?.data?.refresh_token)
        navigate('/home')
      }
      setIsLoading(false)
    }
    catch (e) {
      setIsLoading(false)
      if (e.response?.data?.message)
        setError(e.response.data.message)
      else
        setError('Something went wrong')
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm_password: ""
    },
    validationSchema: yup.object({
      email: yup.string()
        .required('Email is required')
        .email('Must be a email'),
      password: yup.string().required('Enter your password')
        .min(8, 'Password must be 8 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter'),
      confirm_password: yup.string().required('Confirm your password')
        .oneOf([yup.ref('password')], 'Confirm password and password must be same')
    }),
    onSubmit: (values) => {
      handleRequest(values)
    }
  })

  return (
    <div className='App login-conatiner'>
      <h3 className='text-center'>Sign Up</h3>
      <form className='w-50' onSubmit={formik.handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Email address</label>
          <input autoComplete='' type="email" className="form-control" name='email' onChange={formik.handleChange} placeholder="Enter your email address" />
          {formik.touched.email && formik.errors.email && <p className='mt-2 text-danger'>{formik.errors.email}</p>}
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input autoComplete='' type="password" className="form-control" name='password' onChange={formik.handleChange} placeholder='Enter your password' />
          {formik.touched.password && formik.errors.password && <p className='mt-2 text-danger'>{formik.errors.password}</p>}
        </div>
        <div className="mb-2">
          <label className="form-label">Confirm Password</label>
          <input autoComplete='' type="password" className="form-control" name='confirm_password' onChange={formik.handleChange} placeholder='Confirm your password' />
          {formik.touched.confirm_password && formik.errors.confirm_password && <p className='mt-2 text-danger'>{formik.errors.confirm_password}</p>}
        </div>
        {error && <p className='mt-2 mb-2 text-danger'>{error}</p>}
        <button type='submit' className='btn btn-sm btn-primary mt-2 w-25'>{isLoading ? 'Please wait...' : 'Signup'}</button>
        <div className='mt-3'>
          <Link className='text-dark text-decoration-none' to={'/'}>Already Registered? Login Now</Link>
        </div>
      </form>
    </div>
  )
}

export default Signup