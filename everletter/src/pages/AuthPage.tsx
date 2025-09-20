import { useState } from 'react'
import { supabase } from '../supabaseClient'

interface AuthPageProps {
  onSignIn?: () => void // optional callback when sign-in succeeds
}

export default function AuthPage({ onSignIn }: AuthPageProps) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the confirmation link!')
  }
    const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) setMessage(error.message)
    else {
        setMessage('Signed in successfully!')
        onSignIn?.()
      }
  }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login / Sign Up</h2>
            <input
                type="email"
                placeholder="Email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div>
                <button onClick={signUp} className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 mr-2">Sign Up</button>
                <button onClick={signIn} className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-600">Sign In</button>
            </div>
             {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
        </div>  
    )
}
