'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'; 
export default function SignUpForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const isValidPassword = (password: string) => {
        // Check for minimum length
        if (password.length < 8) {
            return false
        }
        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return false
        }
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return false
        }
        // Check for at least one number
        if (!/[0-9]/.test(password)) {
            return false
        }
        // Check for at least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return false
        }
        return true
    }
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        if (!isValidPassword(password)) {
            setError('Password does not meet requirements (8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
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
                <h2 className="text-2xl font-bold text-black text-center">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border pl-4 p-2 rounded-2xl w-100 border-black placeholder-black text-black"
                    required
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border p-2 pl-4 rounded-2xl w-100 border-black placeholder-black text-black"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    
                    className="self-center bg-blue-500 text-white py-2 px-4 w-50 hover:bg-blue-600 rounded-2xl"
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    )
}
