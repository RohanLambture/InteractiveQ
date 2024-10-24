import { Button } from "../components/ui/button"
import { MessageCircle, HelpCircle, BarChart2, Users } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex items-center justify-between h-16 px-4 border-b border-gray-800 shrink-0 md:px-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <span className="text-lg font-semibold">InteractiveQ</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/SignIn">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/SignUp">
            <Button>Sign up</Button>
          </Link>   
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Engage Your Audience in Real-Time
                </h1>
                <p className="mx-auto max-w-[700px] text-xl text-gray-400 md:text-2xl/relaxed lg:text-3xl/relaxed">
                  Create interactive Q&A sessions, live polls, and more with InteractiveQ. Perfect for meetings, events, and classrooms.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <HelpCircle className="w-12 h-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Live Q&A</h3>
                <p className="text-gray-400">Engage your audience with real-time questions and answers.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <BarChart2 className="w-12 h-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Live Polling</h3>
                <p className="text-gray-400">Create instant polls and visualize results in real-time.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="w-12 h-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">Audience Insights</h3>
                <p className="text-gray-400">Gain valuable insights into your audience's engagement and preferences.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 InteractiveQ. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}
