"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from "next/link";

interface Module {
  id: string;
  title: string;
  slug: string;
  emoji: string;
}

const EMOJI_OPTIONS = ["🎯", "🚀", "💻", "📚", "🔥", "⚡", "🌟", "🎓", "💡", "🏆"];
const DIFFICULTY_OPTIONS = ["BEGINNER", "EASY", "MEDIUM", "HARD"];
const COMPANY_OPTIONS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla",
  "Uber", "Airbnb", "Spotify", "Adobe", "Salesforce", "Oracle", "IBM"
];

export default function CreatePathTemplatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "🎯",
    durationWeeks: 8,
    difficulty: "MEDIUM",
    targetAudience: "",
    includeModules: [] as string[],
    excludeModules: [] as string[],
    minDifficulty: "",
    maxDifficulty: "",
    lessonsPerDay: 2,
    daysPerWeek: 5,
    estimatedHoursPerDay: 2.0,
    balanceTheoryPractice: true,
    companyFocus: [] as string[],
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/navigation");
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleModuleToggle = (moduleId: string) => {
    const inInclude = formData.includeModules.includes(moduleId);
    const inExclude = formData.excludeModules.includes(moduleId);

    if (!inInclude && !inExclude) {
      // Add to include
      setFormData(prev => ({
        ...prev,
        includeModules: [...prev.includeModules, moduleId]
      }));
    } else if (inInclude) {
      // Move to exclude
      setFormData(prev => ({
        ...prev,
        includeModules: prev.includeModules.filter(id => id !== moduleId),
        excludeModules: [...prev.excludeModules, moduleId]
      }));
    } else {
      // Remove from exclude
      setFormData(prev => ({
        ...prev,
        excludeModules: prev.excludeModules.filter(id => id !== moduleId)
      }));
    }
  };

  const getModuleState = (moduleId: string) => {
    if (formData.includeModules.includes(moduleId)) return "include";
    if (formData.excludeModules.includes(moduleId)) return "exclude";
    return "neutral";
  };

  const handleCompanyToggle = (company: string) => {
    setFormData(prev => ({
      ...prev,
      companyFocus: prev.companyFocus.includes(company)
        ? prev.companyFocus.filter(c => c !== company)
        : [...prev.companyFocus, company]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/path-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const template = await response.json();
        router.push(`/admin/path-templates/${template.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.description && formData.targetAudience && formData.durationWeeks > 0;
      case 2:
        return formData.difficulty && formData.emoji;
      case 3:
        return formData.lessonsPerDay > 0 && formData.daysPerWeek > 0 && formData.estimatedHoursPerDay > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., FAANG Interview Prep - 2 Months"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the learning path this template will generate..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="e.g., Mid-level developers targeting FAANG"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (Weeks) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="52"
                value={formData.durationWeeks}
                onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) || 1 }))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">How many weeks the generated path should span</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Choose an Emoji</Label>
              <div className="grid grid-cols-5 gap-3 mt-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                    className={`p-4 text-2xl rounded-lg border-2 transition-all ${
                      formData.emoji === emoji
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty">Overall Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minDifficulty">Min Lesson Difficulty</Label>
                <Select
                  value={formData.minDifficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, minDifficulty: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No minimum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No minimum</SelectItem>
                    {DIFFICULTY_OPTIONS.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxDifficulty">Max Lesson Difficulty</Label>
                <Select
                  value={formData.maxDifficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, maxDifficulty: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No maximum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No maximum</SelectItem>
                    {DIFFICULTY_OPTIONS.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Target Companies (Optional)</Label>
              <p className="text-sm text-gray-500 mb-2">
                Filter lessons by company relevance
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                {COMPANY_OPTIONS.map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={formData.companyFocus.includes(company)}
                      onCheckedChange={() => handleCompanyToggle(company)}
                    />
                    <Label htmlFor={`company-${company}`} className="text-sm">
                      {company}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Module Selection</Label>
              <p className="text-sm text-gray-500 mb-3">
                Click once to include (green), twice to exclude (red), three times to reset
              </p>
              <div className="space-y-2">
                {modules.map((module) => {
                  const state = getModuleState(module.id);
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleToggle(module.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        state === "include"
                          ? "border-green-500 bg-green-50"
                          : state === "exclude"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{module.emoji}</span>
                          <span className="font-medium">{module.title}</span>
                        </div>
                        {state === "include" && (
                          <span className="text-sm text-green-600 font-medium">Include</span>
                        )}
                        {state === "exclude" && (
                          <span className="text-sm text-red-600 font-medium">Exclude</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lessonsPerDay">Lessons Per Day *</Label>
                <Input
                  id="lessonsPerDay"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.lessonsPerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, lessonsPerDay: parseInt(e.target.value) || 1 }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="daysPerWeek">Days Per Week *</Label>
                <Input
                  id="daysPerWeek"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.daysPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, daysPerWeek: parseInt(e.target.value) || 1 }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hoursPerDay">Hours Per Day *</Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={formData.estimatedHoursPerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHoursPerDay: parseFloat(e.target.value) || 1 }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="balance"
                checked={formData.balanceTheoryPractice}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, balanceTheoryPractice: checked as boolean }))}
              />
              <Label htmlFor="balance" className="text-sm">
                Balance theory and practice lessons
              </Label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Estimated Output</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Total study days: {formData.durationWeeks * formData.daysPerWeek} days</p>
                <p>• Lessons needed: ~{formData.durationWeeks * formData.daysPerWeek * formData.lessonsPerDay} lessons</p>
                <p>• Total hours: ~{formData.durationWeeks * formData.daysPerWeek * formData.estimatedHoursPerDay} hours</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/path-templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Path Template</h1>
              <p className="text-gray-600">Define rules for automatic learning path generation</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}>
                  {step}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step ? "text-indigo-600" : "text-gray-500"
                  }`}>
                    {step === 1 && "Basic Info"}
                    {step === 2 && "Difficulty & Focus"}
                    {step === 3 && "Content & Intensity"}
                  </div>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? "bg-indigo-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          {renderStepContent()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="space-x-3">
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!isStepValid()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Create Template"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
