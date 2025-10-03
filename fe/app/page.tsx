'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'


export default function Home() {
  const { data: session, status } = useSession()
  const [backendToken, setBackendToken] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState(null)
  
  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])
  const fetchData = async ()=> {
    try {
      console.log(process.env.BACKEND_URL)
      const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}` 
        }
      })
      const result = await data.json()
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  
  const sendToBackend = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/login`,
        {
          email: session?.user?.email,
          username: session?.user?.name
        }
      )
      console.log(response.data)
      if (response.data.success) {
        setBackendToken(response.data.token)
        localStorage.setItem('token', response.data.token)
      }
    } catch (error) {
      console.error('Backend auth error:', error)
    }
  }

  const fetchProfile = async () => {
    try {
      const token = session?.user.accessToken
      console.log(token)
      console.log(process.env.BACKEND_URL)
      const response = await axios.get(
        `${process.env.BACKEND_URL}/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        console.log(response.data)
        setUserProfile(response.data.user)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    }
  }

  if (status === 'loading') return <p>Loading...</p>

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Login UGM
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Gunakan email UGM (@mail.ugm.ac.id) untuk login
            </p>
          </div>
          <div>
            <button
              onClick={() => signIn('google')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {session.user?.name}!
          </h1>
          <p className="text-gray-600 mb-4">Email: {session.user?.email}</p>
          <p className='text-gray-600 mb-4'>Access Token: {session.user.accessToken}</p>
          
          {backendToken && (
            <div className="mb-4 p-3 bg-green-100 rounded">
              <p className="text-green-800 text-sm">✅ Backend authentication successful</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={fetchProfile}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Fetch Profile from Backend
            </button>
            
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>

          {userProfile && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-bold text-gray-800">Profile dari Backend:</h3>
              <pre className="text-left text-sm mt-2">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}