import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate()
  const { backendUrl, setIsLoggedin ,getUserData } = useContext(AppContent)

  const [state, setState] = useState('Sign up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      axios.defaults.withCredentials = true
      axios.defaults.headers.post['Content-Type'] = 'application/json'

      if (state === 'Sign up') {
        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          { name, email, password }
        )

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(
          backendUrl + '/api/auth/login',
          { email, password }
        )

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-6 bg-gradient-to-br from-blue-200 to-purple-400'>
      
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign up' ? 'Create account' : 'Login'}
        </h2>

        <p className='text-center text-sm mb-6'>
          {state === 'Sign up'
            ? 'Create your account'
            : 'Login to your account'}
        </p>

        <form onSubmit={onSubmitHandler}>

          {state === 'Sign up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='' />
              <input
                type="text"
                placeholder="FullName"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className='bg-transparent outline-none'
              />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' />
            <input
              type="email"
              placeholder="Email id"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='bg-transparent outline-none'
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='bg-transparent outline-none'
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-500 cursor-pointer'
          >
            Forget Password?
          </p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
            {state}
          </button>
        </form>

        {state === 'Sign up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-blue-400 cursor-pointer underline'
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't have an account?{' '}
            <span
              onClick={() => setState('Sign up')}
              className='text-blue-400 cursor-pointer underline'
            >
              Sign up
            </span>
          </p>
        )}

      </div>
    </div>
  )
}

export default Login
