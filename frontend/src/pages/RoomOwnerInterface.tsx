import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import { BarChart, MessageCircle, Users, PlusCircle, Send, ThumbsUp, Trash2, User, Clock, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"

interface Question {
  id: number;
  text: string;
  votes: number;
  author: string;
  answers: Array<{ text: string; author: string }>;
}

interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

export default function ImprovedRoomOwnerInterface() {
  const location = useLocation()
  const { roomName, roomDuration, roomCode } = location.state || {}
  const navigate = useNavigate()

  const [timeLeft, setTimeLeft] = useState((roomDuration || 60) * 60)
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "What's the most exciting feature of this product?", votes: 5, author: "Alice", answers: [] },
    { id: 2, text: "How does this compare to competitors?", votes: 3, author: "Anonymous", answers: [] },
  ])
  const [newQuestion, setNewQuestion] = useState("")
  const [participants, setParticipants] = useState(45)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
  const [newPollQuestion, setNewPollQuestion] = useState("")
  const [newPollOptions, setNewPollOptions] = useState(["", ""])
  const [isSessionEnded, setIsSessionEnded] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      endSession()
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { id: questions.length + 1, text: newQuestion, votes: 0, author: "Room Owner", answers: [] }])
      setNewQuestion("")
    }
  }

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const voteQuestion = (id: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, votes: q.votes + 1 } : q))
  }

  const openAnswerDialog = (question: Question) => {
    setSelectedQuestion(question)
    setIsAnswerDialogOpen(true)
  }

  const closeAnswerDialog = () => {
    setSelectedQuestion(null)
    setNewAnswer("")
    setIsAnswerDialogOpen(false)
  }

  const addAnswer = () => {
    if (newAnswer.trim() && selectedQuestion) {
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, answers: [...q.answers, { text: newAnswer, author: "Room Owner" }] }
          : q
      ))
      setNewAnswer("")
      closeAnswerDialog()
    }
  }

  const addPollOption = () => {
    setNewPollOptions([...newPollOptions, ""])
  }

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...newPollOptions]
    updatedOptions[index] = value
    setNewPollOptions(updatedOptions)
  }

  const launchPoll = () => {
    if (newPollQuestion.trim() && newPollOptions.filter(option => option.trim()).length >= 2) {
      const newPoll: Poll = {
        id: polls.length + 1,
        question: newPollQuestion,
        options: newPollOptions.filter(option => option.trim()),
        votes: new Array(newPollOptions.filter(option => option.trim()).length).fill(0)
      }
      setPolls([...polls, newPoll])
      setNewPollQuestion("")
      setNewPollOptions(["", ""])
    }
  }

  const endSession = () => {
    setIsSessionEnded(true)
    setTimeout(() => {
      navigate("/dashboard")
    }, 3000)
  }

  if (isSessionEnded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Session Ended</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The session has ended....</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">{roomName || "Default Room Name"}</h1>
            <Badge variant="outline">{roomCode || "DEFAULT"}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              {participants} Participants
            </Button>
            <div className="flex items-center space-x-2 bg-primary/10 text-primary rounded-md px-3 py-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={endSession}>End Session</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ask or Answer Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your question here..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Button onClick={addQuestion}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {questions.map((question) => (
                <Card key={question.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {question.author !== "Anonymous" ? (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>{question.author[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                        <span className="text-sm font-medium">{question.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => voteQuestion(question.id)}>
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {question.votes}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-2">{question.text}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAnswerDialog(question)}
                    >
                      Answer
                    </Button>
                    {question.answers.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold">Answers:</h4>
                        {question.answers.map((answer, index) => (
                          <div key={index} className="pl-4 border-l-2 border-primary/30">
                            <p className="text-sm">{answer.text}</p>
                            <p className="text-xs text-muted-foreground">- {answer.author}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
            <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Answer Question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="font-medium">{selectedQuestion?.text}</p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your answer here..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                    />
                    <Button onClick={addAnswer}>
                      <Send className="w-4 h-4 mr-2" />
                      Answer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent value="polls">
            <Card>
              <CardHeader>
                <CardTitle>Create a Poll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="poll-question">Poll Question</Label>
                    <Input
                      id="poll-question"
                      placeholder="Enter your poll question"
                      value={newPollQuestion}
                      onChange={(e) => setNewPollQuestion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {newPollOptions.map((option, index) => (
                      <Input
                        key={index}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                      />
                    ))}
                    <Button variant="outline" className="w-full" onClick={addPollOption}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                  <Button className="w-full" onClick={launchPoll}>
                    <Send className="w-4 h-4 mr-2" />
                    Launch Poll
                  </Button>
                </div>
              </CardContent>
            </Card>
            {polls.map((poll) => (
              <Card key={poll.id} className="mt-4">
                <CardHeader>
                  <CardTitle>{poll.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  {poll.options.map((option, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span>{option}</span>
                      <span>{poll.votes[index]} votes</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Session Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <Users className="h-12 w-12 text-primary mb-2" />
                        <p className="text-2xl font-semibold">{participants}</p>
                        <p className="text-sm text-muted-foreground">Total Participants</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <MessageCircle className="h-12 w-12 text-primary mb-2" />
                        <p className="text-2xl font-semibold">{questions.length}</p>
                        <p className="text-sm text-muted-foreground">Total Questions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <ThumbsUp className="h-12 w-12 text-primary mb-2" />
                        <p className="text-2xl font-semibold">{questions.reduce((sum, q) => sum + q.votes, 0)}</p>
                        <p className="text-sm text-muted-foreground">Total Votes</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Separator />
                  <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
                    <BarChart className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Room Code: {roomCode || "DEFAULT"}</p>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Room
          </Button>
        </div>
      </footer>
    </div>
  )
}
