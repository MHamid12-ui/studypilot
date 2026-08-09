import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PRESET_SUBJECTS } from '../lib/data';
import { User, GraduationCap, BookOpen, Check, Mail } from 'lucide-react';
import type { EducationLevel } from '../types';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(user?.educationLevel || 'high_school');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user?.subjects || []);
  const [saving, setSaving] = useState(false);

  const toggleSubject = (name: string) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleSave = () => {
    setSaving(true);
    updateProfile({
      fullName: fullName.trim(),
      educationLevel,
      subjects: selectedSubjects,
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your learning preferences.</p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Account info */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <User size={24} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail size={14} />
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {!editing ? (
          <>
            {/* Education level */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Education Level</h2>
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-accent" />
                <span className="text-sm text-foreground font-medium">
                  {user?.educationLevel === 'undergraduate' ? 'Undergraduate' : 'High School'}
                </span>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subjects of Interest</h2>
              <div className="flex flex-wrap gap-2">
                {user?.subjects.map(subject => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium"
                  >
                    <BookOpen size={14} />
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={() => setEditing(true)}>Edit profile</Button>
          </>
        ) : (
          <div className="space-y-5">
            <Input
              label="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />

            {/* Education level */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Education level</label>
              <div className="space-y-2">
                {(['high_school', 'undergraduate'] as EducationLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setEducationLevel(level)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-150 flex items-center justify-between cursor-pointer
                      ${educationLevel === level ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {level === 'high_school' ? 'High School' : 'Undergraduate'}
                    </span>
                    {educationLevel === level && (
                      <Check size={16} className="text-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Subjects of interest</label>
              <div className="space-y-2">
                {PRESET_SUBJECTS.map(subject => {
                  const selected = selectedSubjects.includes(subject.name);
                  return (
                    <button
                      key={subject.name}
                      onClick={() => toggleSubject(subject.name)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-150 flex items-center justify-between cursor-pointer
                        ${selected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                    >
                      <span className="text-sm font-medium text-foreground">{subject.name}</span>
                      {selected && <Check size={16} className="text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}