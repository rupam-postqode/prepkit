"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, RotateCcw, Calendar } from "lucide-react";

interface ResetDialogProps {
  children: React.ReactNode;
  pathTitle: string;
  currentWeek?: number;
  onReset: (type: "path" | "week", weekNumber?: number) => Promise<void>;
  isResetting?: boolean;
}

export function ResetDialog({ 
  children, 
  pathTitle, 
  currentWeek, 
  onReset, 
  isResetting = false 
}: ResetDialogProps) {
  const [open, setOpen] = useState(false);
  const [resetType, setResetType] = useState<"path" | "week">("path");
  const [weekNumber, setWeekNumber] = useState(currentWeek?.toString() || "1");
  const [confirmationText, setConfirmationText] = useState("");
  const [step, setStep] = useState(1);

  const handleReset = async () => {
    if (resetType === "path") {
      await onReset("path");
    } else {
      await onReset("week", parseInt(weekNumber));
    }
    setOpen(false);
    setStep(1);
    setConfirmationText("");
  };

  const resetOptions = [
    { 
      value: "path", 
      title: "Reset Entire Path", 
      description: "Reset all progress in this learning path back to the beginning",
      icon: <RotateCcw className="w-4 h-4" />,
      warning: "This will delete all your lesson progress, study time, and achievements for this path."
    },
    { 
      value: "week", 
      title: "Reset Specific Week", 
      description: "Reset progress only for a specific week",
      icon: <Calendar className="w-4 h-4" />,
      warning: "This will delete your progress for all lessons in the selected week only."
    }
  ];

  const selectedOption = resetOptions.find(option => option.value === resetType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Reset Progress
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please choose what you want to reset.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <RadioGroup value={resetType} onValueChange={(value) => setResetType(value as "path" | "week")}>
                {resetOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 rounded-lg border p-3">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="flex items-center gap-2 font-medium cursor-pointer">
                        {option.icon}
                        {option.title}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {resetType === "week" && (
              <div className="space-y-2">
                <Label htmlFor="weekNumber">Week Number</Label>
                <Input
                  id="weekNumber"
                  type="number"
                  min="1"
                  max={52}
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  placeholder="Enter week number"
                />
              </div>
            )}

            {selectedOption && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <strong>Warning:</strong> {selectedOption.warning}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)}
                className="bg-red-600 hover:bg-red-700"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                <strong>Final Confirmation Required</strong>
                <br />
                You are about to reset:
                <br />
                <strong>
                  {resetType === "path" 
                    ? `Entire "${pathTitle}" path` 
                    : `Week ${weekNumber} of "${pathTitle}"`
                  }
                </strong>
                <br />
                This action <strong>cannot be undone</strong>.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <code className="bg-gray-100 px-1 rounded">RESET</code> to confirm:
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type RESET to confirm"
                className="font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleReset}
                disabled={confirmationText !== "RESET" || isResetting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isResetting ? "Resetting..." : "Reset Progress"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
