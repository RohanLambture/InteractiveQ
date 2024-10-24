import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Link, useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useState } from "react"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy credentials check
    if (name && email && password && agreeTerms) {
      // Successful sign up
      console.log("Sign up successful:", { name, email, password })
      navigate("/dashboard")
    } else {
      // Failed sign up
      alert("Please fill in all fields and agree to the terms.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Create an account</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              type="text"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
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
