import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GraduationCap, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PRESET_SUBJECTS } from '../lib/data';
import type { EducationLevel } from '../types';

export function OnboardingPage() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSubject = (name: string) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleFinish = async () => {
    if (!educationLevel) return;
    setSaving(true);
    updateProfile({
      educationLevel,
      subjects: selectedSubjects,
    });
    setSaving(false);
    navigate('/');
  };

  const steps = [
    // Step 1: Education level
    {
      title: 'What level are you studying at?',
      content: (
        <div className="space-y-3">
          {(['high_school', 'undergraduate'] as EducationLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setEducationLevel(level)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer
                ${educationLevel === level
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-accent/50'
                }`}
            >
              <p className="font-semibold text-foreground">
                {level === 'high_school' ? 'High School' : 'Undergraduate'}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {level === 'high_school'
                  ? 'Grades 9–12, preparing for college'
                  : 'College or university level'
                }
              </p>
            </button>
          ))}
        </div>
      ),
      canProceed: !!educationLevel,
    },
    // Step 2: Subjects
    {
      title: 'Which subjects are you studying?',
      subtitle: 'Select one or more subjects to get started',
      content: (
        <div className="space-y-3">
          {PRESET_SUBJECTS.map(subject => {
            const selected = selectedSubjects.includes(subject.name);
            return (
              <button
                key={subject.name}
                onClick={() => toggleSubject(subject.name)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer flex items-center justify-between
                  ${selected
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                  }`}
              >
                <div>
                  <p className="font-semibold text-foreground">{subject.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {subject.topics.length} topics available
                  </p>
                </div>
                {selected && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ),
      canProceed: selectedSubjects.length > 0,
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{currentStep.title}</h1>
          {'subtitle' in currentStep && currentStep.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{currentStep.subtitle}</p>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-accent w-8' : 'bg-muted w-4'}`}
            />
          ))}
        </div>

        <Card className="p-6">
          {currentStep.content}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                className="flex-1"
                disabled={!currentStep.canProceed}
                onClick={() => setStep(s => s + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                className="flex-1"
                disabled={!currentStep.canProceed || saving}
                onClick={handleFinish}
              >
                {saving ? 'Setting up…' : 'Start studying'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}