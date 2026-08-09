import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { getSession, getSessionMessages, addMessage, updateSessionTitle } from '../lib/chat';
import { getTopicById, getSubjectById } from '../lib/data';
import { useAuth } from '../context/AuthContext';
import { queryFlowise } from '../lib/flowise';
import { mockGenerateQuiz, mockEvaluateAnswer } from '../lib/mock-ai';
import { saveQuizQuestion, saveQuizResponse } from '../lib/quiz';
import { Send, Sparkles, Brain, Check, X, Loader2 } from 'lucide-react';
import type { ChatMessage, ChatSession, MessageContent } from '../types';

export function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<{
    questionId: string;
    selected: number | null;
    submitted: boolean;
    isCorrect?: boolean;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    const sess = getSession(sessionId);
    if (!sess) {
      navigate('/');
      return;
    }
    setSession(sess);
    setMessages(getSessionMessages(sessionId));
  }, [sessionId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add system message on first load if empty
  useEffect(() => {
    if (session && messages.length === 0) {
      const topic = getTopicById(session.topicId);
      const levelLabel = user?.educationLevel === 'undergraduate' ? 'Undergraduate' : 'High School';
      const systemContent: MessageContent = {
        type: 'text',
        text: `You are studying **${topic?.name || 'this topic'}** at **${levelLabel}** level. Ask me anything! 💡\n\nI can help explain concepts, answer questions, and generate practice quizzes. Just type your question or click the **Practice** button below.`
      };
      const sysMsg = addMessage(session.id, 'system', systemContent);
      setMessages([sysMsg]);
    }
  }, [session?.id, messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !session || loading) return;
    setInput('');
    setLoading(true);

    // Add user message
    const userMsg = addMessage(session.id, 'user', { type: 'text', text });
    setMessages(prev => [...prev, userMsg]);

    // Auto-title the session
    if (messages.length <= 1) {
      const title = text.length > 50 ? text.slice(0, 50) + '…' : text;
      updateSessionTitle(session.id, title);
      setSession((prev: ChatSession | null) => prev ? { ...prev, title } : null);
    }

    // Get context for Flowise
    const topic = getTopicById(session.topicId);
    const subject = topic ? getSubjectById(topic.subjectId) : null;

    try {
      setError(null);
      const responseText = await queryFlowise(text, {
        userId: user?.id || 'anonymous',
        sessionId: session.id,
        userName: user?.fullName,
        educationLevel: user?.educationLevel || 'high_school',
        subject: subject?.name || topic?.name || '',
        subtopic: topic?.name || '',
      });

      const aiMsg = addMessage(session.id, 'assistant', { type: 'text', text: responseText });
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError('AI Tutor is temporarily unavailable. Please try again.');
      console.error('Flowise error:', errorMsg);

      // Still add a friendly error message to the chat
      const errorContent = `I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 🙏`;
      const aiMsg = addMessage(session.id, 'assistant', { type: 'text', text: errorContent });
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePractice = async () => {
    if (!session || loading) return;
    setLoading(true);

    const topic = getTopicById(session.topicId);
    const quizData = mockGenerateQuiz(topic?.name || '', user?.educationLevel || 'high_school');

    // Save the quiz question
    const question = saveQuizQuestion(
      session.topicId,
      quizData.questionText,
      quizData.options,
      quizData.correctIndex,
      quizData.explanation
    );

    // Add quiz message
    const quizContent: MessageContent = {
      type: 'quiz',
      question: {
        questionText: quizData.questionText,
        options: quizData.options,
        correctIndex: quizData.correctIndex,
        explanation: quizData.explanation,
      },
    };
    const quizMsg = addMessage(session.id, 'assistant', quizContent);

    setQuizState({
      questionId: question.id,
      selected: null,
      submitted: false,
    });
    setMessages(prev => [...prev, quizMsg]);
    setLoading(false);
  };

  const handleAnswer = async (questionId: string, selectedIndex: number, correctIndex: number, explanation: string, questionText: string) => {
    setQuizState(prev => prev ? { ...prev, selected: selectedIndex, submitted: false } : null);

    const isCorrect = selectedIndex === correctIndex;

    // Save response
    saveQuizResponse(questionId, session!.id, selectedIndex, isCorrect);

    const result = mockEvaluateAnswer(selectedIndex, correctIndex, questionText, explanation);

    // Add result as assistant message
    const resultMsg = addMessage(session!.id, 'assistant', { type: 'text', text: result.explanation });

    setQuizState({
      questionId,
      selected: selectedIndex,
      submitted: true,
      isCorrect,
    });

    setMessages(prev => [...prev, resultMsg]);
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    if (msg.content.type === 'quiz') {
      const q = msg.content.question;
      const questionId = quizState?.questionId || '';
      const isActive = quizState && !quizState.submitted;

      return (
        <div key={msg.id} className="bg-card border border-border rounded-xl p-5 max-w-2xl animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">Practice Question</span>
          </div>
          <p className="text-sm font-medium text-foreground mb-4">{q.questionText}</p>
          <div className="space-y-2">
            {q.options.map((option, optIndex) => {
              const isSelected = quizState?.selected === optIndex;
              const showCorrect = quizState?.submitted;
              const isCorrectOption = optIndex === q.correctIndex;
              let optionClass = 'border-border hover:border-accent/50 hover:bg-accent/5';

              if (showCorrect) {
                if (isCorrectOption) {
                  optionClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                } else if (isSelected && !isCorrectOption) {
                  optionClass = 'border-red-400 bg-red-50 dark:bg-red-900/20';
                } else {
                  optionClass = 'border-border opacity-60';
                }
              } else if (isSelected) {
                optionClass = 'border-accent bg-accent/5';
              }

              return (
                <button
                  key={optIndex}
                  onClick={() => isActive && handleAnswer(
                    questionId,
                    optIndex,
                    q.correctIndex,
                    q.explanation,
                    q.questionText
                  )}
                  disabled={!isActive}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-150 cursor-pointer
                    ${optionClass}
                    ${!isActive ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${showCorrect && isCorrectOption ? 'bg-emerald-500 text-white' :
                        showCorrect && isSelected && !isCorrectOption ? 'bg-red-400 text-white' :
                        'bg-muted text-muted-foreground'}`}
                    >
                      {showCorrect && isCorrectOption ? <Check size={14} /> :
                       showCorrect && isSelected && !isCorrectOption ? <X size={14} /> :
                       String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="text-sm text-foreground">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    const isUser = msg.role === 'user';
    const isSystem = msg.role === 'system';

    return (
      <div
        key={msg.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <div
          className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? 'bg-accent text-white rounded-br-md'
              : isSystem
                ? 'bg-accent/5 border border-accent/20 text-foreground rounded-bl-md'
                : 'bg-card border border-border text-foreground rounded-bl-md'
            }`}
        >
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.content.type === 'text' ? msg.content.text : '' }} />
        </div>
      </div>
    );
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] lg:h-[calc(100vh-2rem)] animate-fade-in">
      {/* Header */}
      <div className="shrink-0">
        <Header
          title={session.title}
          onBack={() => navigate('/')}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-0 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Brain size={40} className="text-muted-foreground mb-3" />
            <h3 className="font-semibold text-foreground">Start a conversation</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Ask a question or click the Practice button for a quiz.
            </p>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 text-sm text-red-600 dark:text-red-400 animate-fade-in flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        {messages.map((msg, i) => renderMessage(msg, i))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 size={18} className="animate-spin text-accent" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur-sm px-4 lg:px-0 py-3">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              rows={1}
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-150"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="shrink-0 h-[44px]"
          >
            <Send size={16} />
          </Button>
          <Button
            variant="secondary"
            onClick={handlePractice}
            disabled={loading}
            className="shrink-0 h-[44px]"
            title="Generate a practice question"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Practice</span>
          </Button>
        </div>
      </div>
    </div>
  );
}