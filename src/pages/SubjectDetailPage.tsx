import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Header } from '../components/layout/Sidebar';
import { getSubjectById, getTopicsBySubject, addCustomTopic } from '../lib/data';
import { getUserSessions, createSession } from '../lib/chat';
import { BookOpen, Plus, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import type { Subject, Topic } from '../types';

export function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sessions, setSessions] = useState<ReturnType<typeof getUserSessions>>([]);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  useEffect(() => {
    if (!subjectId) return;
    const subj = getSubjectById(subjectId);
    if (!subj) {
      navigate('/');
      return;
    }
    setSubject(subj);
    setTopics(getTopicsBySubject(subjectId));
    setSessions(getUserSessions());
  }, [subjectId, navigate]);

  const handleStartSession = (topic: Topic) => {
    const session = createSession(topic.id, topic.name);
    navigate(`/chat/${session.id}`);
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim() || !subjectId) return;
    addCustomTopic(subjectId, newTopicName.trim());
    setNewTopicName('');
    setShowAddTopic(false);
    setTopics(getTopicsBySubject(subjectId));
  };

  const getTopicSessions = (topicId: string) => {
    return sessions.filter(s => s.topicId === topicId);
  };

  const presetTopics = topics.filter(t => t.isPreset);
  const customTopics = topics.filter(t => !t.isPreset);

  if (!subject) return null;

  return (
    <div className="animate-fade-in">
      <Header
        title={subject.name}
        onBack={() => navigate('/')}
      />

      <div className="mt-6 space-y-6">
        {/* Preset topics */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Topics</h2>
          <div className="space-y-2">
            {presetTopics.map((topic, index) => {
              const topicSessions = getTopicSessions(topic.id);
              const lastSession = topicSessions[0];
              return (
                <Card
                  key={topic.id}
                  hoverable
                  onClick={() => handleStartSession(topic)}
                  className="flex items-center gap-4 py-3 px-4 animate-slide-up"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{topic.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {topicSessions.length > 0 && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare size={12} />
                          {topicSessions.length} session{topicSessions.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {lastSession && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(lastSession.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom topics */}
        {customTopics.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Custom Topics</h3>
            <div className="space-y-2">
              {customTopics.map((topic, index) => (
                <Card
                  key={topic.id}
                  hoverable
                  onClick={() => handleStartSession(topic)}
                  className="flex items-center gap-4 py-3 px-4 animate-slide-up"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{topic.name}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add topic button */}
        {!showAddTopic ? (
          <Button variant="secondary" className="w-full" onClick={() => setShowAddTopic(true)}>
            <Plus size={16} />
            Add custom topic
          </Button>
        ) : (
          <Card className="p-4 animate-slide-up">
            <div className="flex gap-3">
              <Input
                placeholder="Topic name (e.g. Differential Equations)"
                value={newTopicName}
                onChange={e => setNewTopicName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                autoFocus
              />
              <Button onClick={handleAddTopic} disabled={!newTopicName.trim()}>Add</Button>
              <Button variant="ghost" onClick={() => { setShowAddTopic(false); setNewTopicName(''); }}>Cancel</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}