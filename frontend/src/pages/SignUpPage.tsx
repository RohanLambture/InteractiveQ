import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Link, useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useState } from "react"

export default function SignUp() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('Attempting signup with:', { fullName, email, password, termsAccepted })
      
      const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          termsAccepted
        }),
      })

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      // Try to parse JSON only if it's valid
      let data
      try {
        data = JSON.parse(responseText)
      } catch (err) {
        console.error('Failed to parse response as JSON:', responseText)
        throw new Error('Invalid response format from server')
      }

      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ')
          setError(errorMessages)
        } else {
          setError(data.message || 'Sign up failed')
        }
        return
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token)
      
      // Successful sign up
      navigate("/dashboard")
    } catch (err) {
      console.error('Sign up error:', err)
      setError('Failed to connect to server. Please try again later.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Create an account</h1>
        </div>
        {error && (
          <div className="mb-4 p-2 text-sm text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-300">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              required
              type="text"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email address
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              required
              type="email"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              required
              type="password"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              className="border-gray-600"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              required
            />
            <Label htmlFor="terms" className="text-sm text-gray-300">
              I agree to the{" "}
              <Link to="/terms" className="text-white hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          <Button className="w-full bg-white text-black hover:bg-gray-200" type="submit">
            Create Account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/SignIn" className="text-white hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
