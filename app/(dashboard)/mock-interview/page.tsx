import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Layout, 
  GitBranch, 
  Network, 
  Users, 
  Clock,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mock Interview | PrepKit',
  description: 'Practice technical interviews with AI-powered mock interviews',
};

const interviewTypes = [
  {
    id: 'javascript',
    title: 'JavaScript/Frontend',
    description: 'Master JavaScript concepts, React, and frontend development',
    icon: Code,
    lessons: 22,
    difficulty: 'Medium',
    duration: '15-20 min',
    price: 149,
    color: 'text-yellow-600'
  },
  {
    id: 'machine-coding',
    title: 'Machine Coding',
    description: 'Practice coding patterns and real-world implementations',
    icon: Layout,
    lessons: 42,
    difficulty: 'Hard',
    duration: '20-25 min',
    price: 199,
    color: 'text-blue-600'
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Solve algorithmic problems and optimize solutions',
    icon: GitBranch,
    lessons: 130,
    difficulty: 'Medium',
    duration: '15-20 min',
    price: 149,
    color: 'text-green-600'
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Design scalable systems and architect solutions',
    icon: Network,
    lessons: 15,
    difficulty: 'Expert',
    duration: '25-30 min',
    price: 299,
    color: 'text-purple-600'
  },
  {
    id: 'behavioral',
    title: 'Behavioral/HR',
    description: 'Prepare for behavioral questions and soft skills',
    icon: Users,
    lessons: 12,
    difficulty: 'Easy',
    duration: '10-15 min',
    price: 99,
    color: 'text-pink-600'
  }
];

const features = [
  {
    icon: CheckCircle,
    title: 'AI-Powered Questions',
    description: 'Custom questions generated based on your requirements'
  },
  {
    icon: Clock,
    title: 'Real-time Voice Interview',
    description: 'Practice with natural AI voice conversations'
  },
  {
    icon: TrendingUp,
    title: 'Detailed Reports',
    description: 'Get comprehensive analysis and recommendations'
  }
];

export default function MockInterviewPage() {
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">New Feature</Badge>
          <span className="text-sm text-muted-foreground">AI-Powered Mock Interviews</span>
        </div>
        <h1 className="text-4xl font-bold">Mock Interview Practice</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Practice technical interviews with AI-powered mock interviews. Get instant feedback,
          detailed reports, and personalized recommendations to improve your interview skills.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interview Types */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Choose Your Interview Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className={`h-8 w-8 ${type.color}`} />
                    <Badge variant="outline">{type.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{type.lessons} topics</span>
                    <span>{type.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">₹{type.price}</p>
                      <p className="text-sm text-muted-foreground">per interview</p>
                    </div>
                    <Link href={`/mock-interview/setup?type=${type.id}`}>
                      <Button>Start Interview</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Ready to Practice?</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Start your first mock interview now and get detailed feedback to improve your skills.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/mock-interview/setup">
            <Button size="lg" variant="secondary">
              Start New Interview
            </Button>
          </Link>
          <Link href="/mock-interview/history">
            <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/20">
              View History
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
