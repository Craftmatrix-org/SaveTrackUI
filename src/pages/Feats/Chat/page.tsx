import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/lib/token";
import axios from "axios";
import { Send, Bot, User, TrendingUp, DollarSign, Target, Lightbulb } from "lucide-react";

interface InsightResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  insight?: InsightResponse;
}

const predefinedQuestions = [
  { icon: TrendingUp, text: "Analyze my spending patterns", category: "spending_analysis" },
  { icon: DollarSign, text: "How can I save more money?", category: "savings_tips" },
  { icon: Target, text: "Help me set a budget", category: "budget_advice" },
  { icon: Lightbulb, text: "Financial insights for this month", category: "monthly_insights" },
];

export const Chat = () => {
  const token = getCookie("token");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hi! I'm your AI financial assistant. I can help you analyze your spending, provide savings tips, and give personalized financial insights. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spending_analysis': return <TrendingUp className="w-4 h-4" />;
      case 'savings_tips': return <DollarSign className="w-4 h-4" />;
      case 'budget_advice': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const sendMessage = async (message: string, category?: string) => {
    if (!token || !message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post<InsightResponse>(
        `${import.meta.env.VITE_API_URL}/api/v2/Insight/generate`,
        {
          category: category || "general",
          question: message,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data.content,
        isBot: true,
        timestamp: new Date(),
        insight: response.data,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get insight:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble analyzing your data right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string, category: string) => {
    sendMessage(question, category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(currentMessage);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">AI Financial Assistant</h1>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Quick Questions</CardTitle>
            <CardDescription>
              Tap any of these to get instant financial insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {predefinedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => handleQuestionClick(question.text, question.category)}
                >
                  <question.icon className="w-4 h-4 mr-2 shrink-0" />
                  <span className="text-sm">{question.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-lg p-3 ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* Insight Card for Bot Messages */}
                {message.insight && (
                  <Card className="mt-3 bg-white border">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(message.insight.category)}
                          <h4 className="font-semibold text-sm text-gray-900">
                            {message.insight.title}
                          </h4>
                        </div>
                        <Badge className={getPriorityColor(message.insight.priority)}>
                          {message.insight.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className={`flex items-center gap-2 mt-1 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                {message.isBot ? (
                  <Bot className="w-4 h-4 text-gray-400" />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-gray-400" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask me about your finances..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !currentMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};