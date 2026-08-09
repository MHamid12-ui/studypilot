import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { seedPresetData, getAllSubjects, addCustomSubject, getTopicsBySubject } from '../lib/data';
import { getUserSessions } from '../lib/chat';
import { BookOpen, Plus, MessageSquare, Sparkles } from 'lucide-react';
import type { Subject } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [sessions, setSessions] = useState<ReturnType<typeof getUserSessions>>([]);

  const loadData = () => {
    seedPresetData();
    setSubjects(getAllSubjects());
    setSessions(getUserSessions().slice(0, 5));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    addCustomSubject(newSubjectName.trim());
    setNewSubjectName('');
    setShowAddSubject(false);
    loadData();
  };

  const getSubjectTopicsCount = (subjectId: string) => {
    return getTopicsBySubject(subjectId).length;
  };

  const getSubjectSessionCount = (subjectName: string) => {
    return sessions.filter(s => s.title.startsWith(subjectName)).length;
  };

  const subjectIcons: Record<string, string> = {
    'Mathematics': '∑',
    'Computer Science': '💻',
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}
        </h1>
        <p className="text-muted-foreground mt-1">What would you like to study today?</p>
      </div>

      {/* Subjects grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Subjects</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowAddSubject(true)}>
            <Plus size={16} />
            Add subject
          </Button>
        </div>

        {showAddSubject && (
          <Card className="mb-4 p-4 animate-slide-up">
            <div className="flex gap-3">
              <Input
                placeholder="Subject name (e.g. Physics)"
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                autoFocus
              />
              <Button onClick={handleAddSubject} disabled={!newSubjectName.trim()}>Add</Button>
              <Button variant="ghost" onClick={() => { setShowAddSubject(false); setNewSubjectName(''); }}>Cancel</Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((subject, index) => (
            <Card
              key={subject.id}
              hoverable
              onClick={() => navigate(`/subjects/${subject.id}`)}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-lg shrink-0">
                  {subjectIcons[subject.name] || <BookOpen size={20} className="text-accent" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">{subject.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>{getSubjectTopicsCount(subject.id)} topics</span>
                    <span>{getSubjectSessionCount(subject.name)} sessions</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.slice(0, 4).map(session => (
              <Card
                key={session.id}
                hoverable
                onClick={() => navigate(`/chat/${session.id}`)}
                className="flex items-center gap-3 py-3 px-4"
              >
                <MessageSquare size={16} className="text-accent shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <Sparkles size={14} className="text-muted-foreground shrink-0" />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {subjects.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen size={40} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground">No subjects yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Add a subject to get started with your studies.
          </p>
        </Card>
      )}
    </div>
  );
}