"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
// import { Switch } from "../components/ui/switch"
import { roomAPI, userAPI } from '../services/api'

interface UserProfile {
  fullName: string;
  email: string;
}

export default function Component() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserProfile(response.data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        // Handle unauthorized access
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const userInitials = userProfile?.fullName
    ? userProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : '';

  const handleCreateRoom = async () => {
    try {
      if (!roomName) {
        setError("Please enter a room name");
        return;
      }

      const response = await roomAPI.createRoom({ 
        name: roomName
      });

      navigate("/room/owner", { 
        state: { 
          roomId: response.data._id,
          roomName: response.data.name,
          roomCode: response.data.code
        } 
      });
    } catch (error) {
      setError("Failed to create room. Please try again.");
      console.error('Error creating room:', error);
    }
  }

  const handleJoinRoom = async () => {
    try {
      if (!roomCode) {
        setError("Please enter a room code");
        return;
      }

      const response = await roomAPI.joinRoom(roomCode);

      // Check if room exists and is active
      if (!response.data) {
        setError("Invalid room code or room has ended");
        return;
      }

      navigate("/room/participant", { 
        state: { 
          roomId: response.data._id,
          isAnonymous,
          roomCode: response.data.code,
          roomName: response.data.name
        } 
      });
    } catch (error) {
      setError("Invalid room code or room has ended");
      console.error('Error joining room:', error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex items-center justify-between h-16 px-4 border-b border-gray-800 shrink-0 md:px-6">
        <nav className="flex flex-row items-center gap-6 text-sm lg:gap-8">
          <a className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
            <MessageCircle className="w-6 h-6" />
            <span>InteractiveQ</span>
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{userProfile?.fullName}</span>
          <Avatar>
            <AvatarFallback className="text-black">{userInitials}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full max-w-md px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Welcome to InteractiveQ
            </h1>
            <p className="mt-2 text-gray-400 md:text-lg">
              Create or join interactive Q&A sessions, live polls, and more.
            </p>
          </div>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create a new room</CardTitle>
                  <CardDescription>Set up your Q&A session in seconds.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input 
                      id="room-name" 
                      placeholder="Enter room name" 
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  </div>

                  {/* TODO: Add room duration input if needed later  */}

                  {/* <div className="space-y-1">
                    <Label htmlFor="room-duration">Room Duration (minutes)</Label>
                    <Input 
                      id="room-duration" 
                      type="number" 
                      placeholder="Enter room duration" 
                      value={roomDuration}
                      onChange={(e) => setRoomDuration(e.target.value)}
                    />
                  </div> */}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button className="w-full" onClick={handleCreateRoom}>
                    Create Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="join">
              <Card>
                <CardHeader>
                  <CardTitle>Join an existing room</CardTitle>
                  <CardDescription>Enter the room code to join.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="room-code">Room Code</Label>
                    <Input 
                      id="room-code" 
                      placeholder="Enter room code" 
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymous-mode"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                    <Label htmlFor="anonymous-mode">Join anonymously</Label>
                  </div> */}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleJoinRoom}>
                    Join Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 InteractiveQ. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Helper function to generate a room code (you can implement your own logic)
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

