'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface PathSwitchManagerProps {
  currentPathId: string;
  onPathSwitch: (fromPathId: string, toPathId: string, interviewDate?: string) => Promise<void>;
}

export function PathSwitchManager({ currentPathId, onPathSwitch }: PathSwitchManagerProps) {
  const { data: session } = useSession();
  const [switching, setSwitching] = useState(false);
  const [targetPathId, setTargetPathId] = useState<string>('');
  const [interviewDate, setInterviewDate] = useState<string>('');
  const [switchReason, setSwitchReason] = useState<string>('');
  const [preserveProgress, setPreserveProgress] = useState<boolean>(true);

  const handleSwitch = async () => {
    if (!session?.user?.id || !targetPathId || targetPathId === currentPathId) {
      return;
    }

    try {
      setSwitching(true);
      await onPathSwitch(currentPathId, targetPathId, interviewDate || undefined);
      
      // Reset form
      setTargetPathId('');
      setInterviewDate('');
      setSwitchReason('');
      setPreserveProgress(true);
    } catch (error) {
      console.error('Error switching paths:', error);
    } finally {
      setSwitching(false);
    }
  };

  const getSwitchReasons = () => [
    {
      id: 'timeline_change',
      title: 'Timeline Changed',
      description: 'Interview date has been updated',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'difficulty_adjustment',
      title: 'Difficulty Adjustment',
      description: 'Current path is too easy/hard',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: 'pace_change',
      title: 'Pace Adjustment',
      description: 'Need to speed up or slow down',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'content_focus',
      title: 'Content Focus Change',
      description: 'Different topics need priority',
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Personal preference change',
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Switch Learning Path
          </CardTitle>
          <CardDescription>
            Change your learning path while preserving your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Path Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Current Path</h4>
                <p className="text-sm text-blue-700">Your active learning path</p>
              </div>
              <Badge className="bg-blue-500 text-white">Active</Badge>
            </div>
            <div className="mt-2 text-sm text-blue-800">
              You can switch to a different path while keeping your completed lessons and progress.
            </div>
          </div>

          {/* Switch Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Learning Path
              </label>
              <select
                value={targetPathId}
                onChange={(e) => setTargetPathId(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={switching}
              >
                <option value="">Select a path...</option>
                <option value="timeline-1-month">1 Month Intensive</option>
                <option value="timeline-3-months">3 Months Balanced</option>
                <option value="timeline-6-months">6 Months Comprehensive</option>
                <option value="standard">Standard Path</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Interview Date (Optional)
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-md"
                disabled={switching}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current timeline
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Reason for Switching
              </label>
              <select
                value={switchReason}
                onChange={(e) => setSwitchReason(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={switching}
              >
                <option value="">Select a reason...</option>
                {getSwitchReasons().map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="preserve-progress"
                checked={preserveProgress}
                onChange={(e) => setPreserveProgress(e.target.checked)}
                disabled={switching}
                className="h-4 w-4"
              />
              <label htmlFor="preserve-progress" className="text-sm">
                Preserve my progress and completed lessons
              </label>
            </div>

            {/* Reason Details */}
            {switchReason && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {getSwitchReasons().find(r => r.id === switchReason)?.icon}
                  <span className="font-medium">
                    {getSwitchReasons().find(r => r.id === switchReason)?.title}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {getSwitchReasons().find(r => r.id === switchReason)?.description}
                </p>
              </div>
            )}

            {/* Switch Button */}
            <Button
              onClick={handleSwitch}
              disabled={switching || !targetPathId || targetPathId === currentPathId}
              className="w-full"
            >
              {switching ? 'Switching...' : 'Switch Learning Path'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Smart Switching:</strong> When you switch paths, we&apos;ll automatically:
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Map your completed lessons to the new path</li>
            <li>• Adjust your timeline and milestones accordingly</li>
            <li>• Preserve your study streak and achievements</li>
            <li>• Update content recommendations based on new path type</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Path Comparison */}
      {targetPathId && (
        <Card>
          <CardHeader>
            <CardTitle>Path Comparison</CardTitle>
            <CardDescription>
              See how your paths compare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Current Path</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <Badge variant="outline">Standard</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Intensity:</span>
                    <Badge variant="outline">Moderate</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus:</span>
                    <Badge variant="outline">Comprehensive</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-2">Target Path</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <Badge className="bg-blue-500 text-white">
                      {targetPathId.includes('1-month') ? '1 Month' : 
                       targetPathId.includes('3-months') ? '3 Months' : 
                       targetPathId.includes('6-months') ? '6 Months' : 'Standard'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Intensity:</span>
                    <Badge className="bg-blue-500 text-white">
                      {targetPathId.includes('1-month') ? 'Intensive' : 
                       targetPathId.includes('3-months') ? 'Balanced' : 
                       targetPathId.includes('6-months') ? 'Comprehensive' : 'Moderate'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus:</span>
                    <Badge className="bg-blue-500 text-white">
                      {targetPathId.includes('1-month') ? 'Essential' : 
                       targetPathId.includes('3-months') ? 'Core + Advanced' : 
                       targetPathId.includes('6-months') ? 'Mastery + Specialized' : 'Comprehensive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}