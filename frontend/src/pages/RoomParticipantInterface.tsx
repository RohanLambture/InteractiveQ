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
import { questionAPI, pollAPI, pollForUpdates, roomAPI, userAPI } from '../services/api';

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

  const { 
    roomId = '', 
    roomCode = '', 
    roomName = '', 
  } = location.state || {};

  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSessionEnded, setIsSessionEnded] = useState(false)
  const [username, setUsername] = useState("Anonymous User")
  const [newQuestion, setNewQuestion] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [polls, setPolls] = useState<Poll[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (!roomId) {
      console.error('No room ID provided');
      navigate('/dashboard');
      return;
    }

    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserProfile(response.data);
        setUsername(response.data.fullName); // Set actual username
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch initial room data
    const fetchRoomData = async () => {
      try {
        const response = await roomAPI.getRoomDetails(roomId);
        setQuestions(response.data.questions);
        setPolls(response.data.polls);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchUserProfile();
    fetchRoomData();

    // Set up polling for updates
    const cleanup = pollForUpdates(roomId, (data) => {
      setQuestions(data.questions);
      setPolls(data.polls);
    });

    return () => cleanup();
  }, [roomId, navigate]);

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

  const addQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    const question = {
      content: newQuestion,
      roomId: roomId,
      isAnonymous: isAnonymous
    };
    
    try {
      const response = await questionAPI.createQuestion(question);
      setQuestions(prevQuestions => [...prevQuestions, response.data]);
      setNewQuestion("");
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const openAnswerDialog = (question: Question) => {
    setSelectedQuestion(question)
    setIsAnswerDialogOpen(true)
  }

  const voteQuestion = async (questionId: number) => {
    try {
      await questionAPI.voteQuestion(questionId.toString());
    } catch (error) {
      console.error("Failed to vote on question:", error);
    }
  };

  const hasVoted = (pollId: number): boolean => {
    const poll = polls.find(p => p.id === pollId);
    return poll?.votedBy.includes(username) || false;
  };

  const votePoll = async (pollId: number, optionIndex: number) => {
    try {
      await pollAPI.votePoll(pollId.toString(), optionIndex.toString());
    } catch (error) {
      console.error("Failed to vote on poll:", error);
    }
  };

  const addAnswer = async () => {
    if (!newAnswer.trim() || !selectedQuestion) return;
    
    try {
      await questionAPI.answer(roomId, selectedQuestion.id, {
        text: newAnswer,
        author: isAnonymous ? "Anonymous" : username
      });
      setNewAnswer("");
      setIsAnswerDialogOpen(false);
    } catch (error) {
      console.error("Failed to add answer:", error);
    }
  };

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

  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">{roomName}</h1>
            <Badge variant="outline">{roomCode}</Badge>
          </div>
          <div className="flex items-center space-x-4">
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
