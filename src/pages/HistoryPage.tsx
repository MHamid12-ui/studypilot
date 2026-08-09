import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getUserSessions } from '../lib/chat';
import { getUserQuizResponses } from '../lib/quiz';
import { getTopicById } from '../lib/data';
import { MessageSquare, Brain, ArrowRight, Calendar, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import type { ChatSession, QuizResponse, QuizQuestion, TabId } from '../types';

export function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('sessions');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [quizResponses, setQuizResponses] = useState<(QuizResponse & { question?: QuizQuestion })[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<{ response: QuizResponse; question: QuizQuestion } | null>(null);

  useEffect(() => {
    setSessions(getUserSessions());
    setQuizResponses(getUserQuizResponses());
  }, []);

  const getTopicName = (topicId: string) => {
    return getTopicById(topicId)?.name || 'Unknown topic';
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-muted-foreground mt-1">Review your past study sessions and quizzes.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'sessions', label: `Sessions (${sessions.length})` },
          { id: 'quizzes', label: `Quizzes (${quizResponses.length})` },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => { setActiveTab(id as TabId); setSelectedQuiz(null); }}
      />

      {activeTab === 'sessions' && (
        <>
          {sessions.length === 0 ? (
            <Card className="text-center py-12">
              <MessageSquare size={40} className="text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">No sessions yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start a study session from the Dashboard.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <Card
                  key={session.id}
                  hoverable
                  onClick={() => navigate(`/chat/${session.id}`)}
                  className="flex items-center gap-4 py-3 px-4 animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <MessageSquare size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="info">{getTopicName(session.topicId)}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(session.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'quizzes' && (
        <>
          {selectedQuiz ? (
            <div className="animate-fade-in space-y-4">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-sm text-accent font-medium hover:underline cursor-pointer"
              >
                ← Back to all quizzes
              </button>
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-accent" />
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">Quiz Question</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-4">{selectedQuiz.question.questionText}</p>

                <div className="space-y-2">
                  {selectedQuiz.question.options.map((opt, i) => {
                    const isCorrectAnswer = i === selectedQuiz.question.correctIndex;
                    const isUserAnswer = i === selectedQuiz.response.selectedIndex;
                    let className = 'border-border';
                    if (isCorrectAnswer) className = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                    else if (isUserAnswer && !isCorrectAnswer) className = 'border-red-400 bg-red-50 dark:bg-red-900/20';

                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border-2 ${className} flex items-center gap-3`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                          ${isCorrectAnswer ? 'bg-emerald-500 text-white' :
                            isUserAnswer && !isCorrectAnswer ? 'bg-red-400 text-white' :
                            'bg-muted text-muted-foreground'}`}
                        >
                          {isCorrectAnswer ? <CheckCircle2 size={14} /> :
                           isUserAnswer && !isCorrectAnswer ? <XCircle size={14} /> :
                           String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm text-foreground">{opt}</span>
                        {isUserAnswer && (
                          <span className="text-xs font-medium ml-auto shrink-0">Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Result: </span>
                    {selectedQuiz.response.isCorrect ? (
                      <Badge variant="success">Correct</Badge>
                    ) : (
                      <Badge variant="danger">Incorrect</Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedQuiz.question.explanation}
                  </p>
                </div>
              </Card>
            </div>
          ) : quizResponses.length === 0 ? (
            <Card className="text-center py-12">
              <Brain size={40} className="text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">No quiz attempts yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Practice quizzes appear here once you try them in a study session.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {quizResponses.map((response, index) => (
                <Card
                  key={response.id}
                  hoverable
                  onClick={() => response.question && setSelectedQuiz({ response, question: response.question })}
                  className="flex items-center gap-4 py-3 px-4 animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Brain size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {response.question?.questionText || 'Quiz question'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {response.isCorrect ? (
                        <Badge variant="success">Correct</Badge>
                      ) : (
                        <Badge variant="danger">Incorrect</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(response.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground shrink-0" />
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}