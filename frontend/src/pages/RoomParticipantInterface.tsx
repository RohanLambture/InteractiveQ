import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Checkbox } from "../components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { ScrollArea } from "../components/ui/scroll-area"
import { MessageCircle, ThumbsUp, Send, User, Clock, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { questionAPI, pollAPI, pollForUpdates } from '../services/api';

interface Answer {
  text: string;
  author: string;
}

interface Question {
  id: number;
  text: string;
  votes: number;
  answers: Answer[];
  author: string;
}

interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
  votedBy: string[]; // Track who has voted
}

export default function RoomParticipantInterface() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAnonymous: initialIsAnonymous, roomCode, roomName, roomDuration } = location.state || {}

  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous || false)
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "What's the most exciting feature of this product?", votes: 5, answers: [], author: "Alice" },
    { id: 2, text: "How does this compare to competitors?", votes: 3, answers: [], author: "Anonymous" },
  ])
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      question: "Which feature should we prioritize next?",
      options: ["Mobile App", "Desktop Integration", "API Access"],
      votes: [12, 8, 15],
      votedBy: []
    },
    {
      id: 2, 
      question: "How often do you use our product?",
      options: ["Daily", "Weekly", "Monthly", "Rarely"],
      votes: [25, 15, 8, 3],
      votedBy: []
    }
  ])
  const [newQuestion, setNewQuestion] = useState("")
  const [username, setUsername] = useState("John Doe")
  const [selectedQuestion, setSelectedQuestion] = useState<typeof questions[0] | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState((roomDuration || 60) * 60)
  const [isSessionEnded, setIsSessionEnded] = useState(false)
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false)

  useEffect(() => {
    if (isAnonymous) {
      setUsername("Anonymous User")
    }
  }, [isAnonymous])

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

  useEffect(() => {
    // Set up polling for updates
    const cleanup = pollForUpdates(roomId, ({ questions: newQuestions, polls: newPolls }) => {
      setQuestions(newQuestions);
      setPolls(newPolls);
    });

    return () => cleanup();
  }, [roomId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const addQuestion = async () => {
    if (newQuestion.trim()) {
      try {
        await questionAPI.createQuestion({
          content: newQuestion,
          roomId,
          isAnonymous,
        });
        setNewQuestion("");
      } catch (error) {
        console.error('Error creating question:', error);
      }
    }
  };

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
      const updatedQuestions = questions.map((q) =>
        q.id === selectedQuestion.id
          ? {
              ...q,
              answers: [
                ...q.answers,
                { text: newAnswer, author: isAnonymous ? "Anonymous" : username },
              ],
            }
          : q
      )
      setQuestions(updatedQuestions)
      setNewAnswer("")
      closeAnswerDialog()
    }
  }

  const voteQuestion = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    )
  }

  const votePoll = async (pollId: string, optionIndex: number) => {
    try {
      await pollAPI.votePoll(pollId, {
        optionIndex,
        anonymous: isAnonymous,
      });
    } catch (error) {
      console.error('Error voting in poll:', error);
    }
  };

  const hasVoted = (pollId: number) => {
    const poll = polls.find(p => p.id === pollId);
    return poll?.votedBy.includes(username);
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  const endSession = () => {
    setIsSessionEnded(true)
    setTimeout(() => {
      navigate("/")
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
            <p>The session has ended. Redirecting to the home page...</p>
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
            {/* <div className="flex items-center space-x-2 bg-primary/10 text-primary rounded-md px-3 py-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
            </div> */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{username}</span>
              <Avatar className="w-8 h-8">
                <AvatarFallback>{getInitials(username)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your question here..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <Button onClick={addQuestion}>
                  <Send className="w-4 h-4 mr-2" />
                  Ask
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(!!checked)}
                />
                <Label htmlFor="anonymous">Ask anonymously</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="my">My Questions</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-400px)]">
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
                      <Button variant="ghost" size="sm" onClick={() => voteQuestion(question.id)}>
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {question.votes}
                      </Button>
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
          </TabsContent>
          <TabsContent value="my">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {questions
                .filter((q) => q.author === username)
                .map((question) => (
                  <Card key={question.id} className="mb-4">
                    <CardContent className="p-4">
                      <p className="mb-2">{question.text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{question.votes} votes</span>
                        <span className="text-sm text-muted-foreground">{question.answers.length} answers</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="polls">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {polls.map((poll) => (
                <Card key={poll.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{poll.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {poll.options.map((option, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <Button 
                          variant="outline" 
                          className="w-full text-left justify-between mb-2"
                          onClick={() => votePoll(poll.id, index)}
                          disabled={hasVoted(poll.id)}
                        >
                          <span>{option}</span>
                          <span>{poll.votes[index]} votes</span>
                        </Button>
                      </div>
                    ))}
                    {hasVoted(poll.id) && (
                      <p className="text-sm text-muted-foreground mt-2">You have already voted in this poll</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>

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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous-answer"
                  checked={isAnonymous}
                  onCheckedChange={(checked: boolean) => setIsAnonymous(checked)}
                />
                <Label htmlFor="anonymous-answer">Answer anonymously</Label>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <p>For any issues, please contact the room moderator</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
