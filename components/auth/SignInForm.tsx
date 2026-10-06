'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'; 
export default function SignInForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            router.push('/dashboard')
        } else {
            const data = await response.json()
            setError(data.error || 'An error occurred')
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-5 items-center justify-center h-150 w-100 bg-gray-100 rounded-2xl shadow-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8">
                <h2 className="text-2xl font-bold text-black ">Sign In</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 pl-4 rounded-2xl w-100 border-black placeholder-black text-black"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 pl-4 rounded-2xl w-100 border-black placeholder-black text-black"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="self-center bg-blue-500 text-white py-2 px-4 w-50 hover:bg-blue-600 rounded-2xl"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}   