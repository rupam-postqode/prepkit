'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const interviewTypes = [
  { id: 'javascript', label: 'JavaScript/Frontend', duration: 20, price: 149 },
  { id: 'machine-coding', label: 'Machine Coding', duration: 25, price: 199 },
  { id: 'dsa', label: 'Data Structures & Algorithms', duration: 20, price: 149 },
  { id: 'system-design', label: 'System Design', duration: 30, price: 299 },
  { id: 'behavioral', label: 'Behavioral/HR', duration: 15, price: 99 }
];

const difficultyLevels = [
  { id: 'easy', label: 'Easy', description: 'Beginner level - 5-10 min', price: 99 },
  { id: 'medium', label: 'Medium', description: 'Intermediate - 15-20 min', price: 149 },
  { id: 'hard', label: 'Hard', description: 'Advanced - 20-25 min', price: 199 },
  { id: 'expert', label: 'Expert', description: 'FAANG level - 25-30 min', price: 299 }
];

const focusAreasByType: Record<string, string[]> = {
  'javascript': ['Event Loop', 'Closures', 'Promises', 'React Hooks', 'Performance', 'TypeScript'],
  'machine-coding': ['Component Design', 'State Management', 'API Integration', 'Testing', 'Optimization'],
  'dsa': ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting'],
  'system-design': ['Scalability', 'Database Design', 'Caching', 'Load Balancing', 'Microservices', 'Security'],
  'behavioral': ['Leadership', 'Conflict Resolution', 'Team Collaboration', 'Problem Solving', 'Communication']
};

export default function InterviewSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [type, setType] = useState(searchParams.get('type') || 'javascript');
  const [difficulty, setDifficulty] = useState('medium');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [specificRequirements, setSpecificRequirements] = useState('');
  const [loading, setLoading] = useState(false);

  const currentType = interviewTypes.find(t => t.id === type);
  const currentDifficulty = difficultyLevels.find(d => d.id === difficulty);
  const availableFocusAreas = focusAreasByType[type] || [];

  const handleFocusAreaToggle = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    if (focusAreas.length === 0) {
      toast({
        title: 'Focus areas required',
        description: 'Please select at least one focus area',
        variant: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/interviews/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          difficulty,
          focusAreas,
          specificRequirements: specificRequirements || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Interview created!',
          description: 'Proceeding to payment...'
        });
        // Navigate to payment or directly to interview session
        router.push(`/mock-interview/${data.data.sessionId}/payment`);
      } else {
        throw new Error(data.error || 'Failed to create interview');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to setup interview',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Setup Mock Interview</h1>
        <p className="text-muted-foreground mt-2">
          Configure your interview session and get personalized questions
        </p>
      </div>

      <div className="grid gap-6">
        {/* Interview Type */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Type</CardTitle>
            <CardDescription>Choose the type of interview you want to practice</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={type} onValueChange={setType}>
              <div className="grid gap-3">
                {interviewTypes.map((t) => (
                  <Label
                    key={t.id}
                    htmlFor={t.id}
                    className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                  >
                    <RadioGroupItem value={t.id} id={t.id} />
                    <div className="flex-1">
                      <div className="font-medium">{t.label}</div>
                      <div className="text-sm text-muted-foreground">~{t.duration} minutes</div>
                    </div>
                    <Badge variant="secondary">₹{t.price}</Badge>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Difficulty Level */}
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Level</CardTitle>
            <CardDescription>Select the difficulty that matches your preparation level</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={difficulty} onValueChange={setDifficulty}>
              <div className="grid gap-3">
                {difficultyLevels.map((d) => (
                  <Label
                    key={d.id}
                    htmlFor={d.id}
                    className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                  >
                    <RadioGroupItem value={d.id} id={d.id} />
                    <div className="flex-1">
                      <div className="font-medium">{d.label}</div>
                      <div className="text-sm text-muted-foreground">{d.description}</div>
                    </div>
                    <Badge variant="secondary">₹{d.price}</Badge>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Focus Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Areas</CardTitle>
            <CardDescription>Select topics you want to focus on (select at least one)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableFocusAreas.map((area) => (
                <Label
                  key={area}
                  htmlFor={area}
                  className="flex items-center space-x-2 space-y-0 border rounded-lg p-3 cursor-pointer hover:bg-accent"
                >
                  <Checkbox
                    id={area}
                    checked={focusAreas.includes(area)}
                    onCheckedChange={() => handleFocusAreaToggle(area)}
                  />
                  <span className="text-sm font-medium">{area}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Requirements (Optional)</CardTitle>
            <CardDescription>
              Specify any specific topics, companies, or areas you want to focus on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Preparing for Google L4 interview, focus on distributed systems..."
              value={specificRequirements}
              onChange={(e) => setSpecificRequirements(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Interview Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium">{currentType?.label}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Difficulty:</span>
                <p className="font-medium capitalize">{difficulty}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">~{currentType?.duration} minutes</p>
              </div>
              <div>
                <span className="text-muted-foreground">Focus Areas:</span>
                <p className="font-medium">{focusAreas.length} selected</p>
              </div>
            </div>
            <div className="pt-4 border-t flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold">₹{currentDifficulty?.price}</p>
              </div>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading || focusAreas.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
