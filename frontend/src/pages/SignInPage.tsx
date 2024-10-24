import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useState } from "react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy credentials
    if (email === "user@example.com" && password === "password123") {
      // Successful login
      navigate("/dashboard")
    } else {
      // Failed login
      alert("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
        <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Sign In</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-white">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              required
              type="password"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full bg-white text-black hover:bg-gray-200" type="submit">
            Continue
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/SignUp" className="text-white hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
