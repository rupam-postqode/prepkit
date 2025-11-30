"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Save, BookOpen, Target, Calendar } from "lucide-react";
import Link from "next/link";

interface Module {
  id: string;
  title: string;
  slug: string;
  emoji: string;
  chapters: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      difficulty: string;
      estimatedMinutes: number;
    }[];
  }[];
}

interface PathFormData {
  title: string;
  slug: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetCompanies: string[];
  selectedLessons: string[];
}

const EMOJI_OPTIONS = ["🎯", "🚀", "💻", "📚", "🔥", "⚡", "🌟", "🎓", "💡", "🏆"];
const DIFFICULTY_OPTIONS = ["BEGINNER", "EASY", "MEDIUM", "HARD"];
const COMPANY_OPTIONS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla", 
  "Uber", "Airbnb", "Spotify", "Adobe", "Salesforce", "Oracle", "IBM"
];

export default function CreateLearningPathPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [formData, setFormData] = useState<PathFormData>({
    title: "",
    slug: "",
    description: "",
    emoji: "🎯",
    durationWeeks: 8,
    difficulty: "MEDIUM",
    targetCompanies: [],
    selectedLessons: [],
  });

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

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

  const handleCompanyToggle = (company: string) => {
    setFormData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.includes(company)
        ? prev.targetCompanies.filter(c => c !== company)
        : [...prev.targetCompanies, company]
    }));
  };

  const handleLessonToggle = (lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLessons: prev.selectedLessons.includes(lessonId)
        ? prev.selectedLessons.filter(id => id !== lessonId)
        : [...prev.selectedLessons, lessonId]
    }));
  };

  const handleModuleSelect = (moduleLessons: string[]) => {
    const allSelected = moduleLessons.every(lessonId => 
      formData.selectedLessons.includes(lessonId)
    );
    
    if (allSelected) {
      // Deselect all lessons from this module
      setFormData(prev => ({
        ...prev,
        selectedLessons: prev.selectedLessons.filter(id => !moduleLessons.includes(id))
      }));
    } else {
      // Select all lessons from this module
      setFormData(prev => ({
        ...prev,
        selectedLessons: [...new Set([...prev.selectedLessons, ...moduleLessons])]
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/learning-paths", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const path = await response.json();
        router.push(`/admin/learning-paths/${path.id}/schedule`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create learning path");
      }
    } catch (error) {
      console.error("Error creating learning path:", error);
      alert("Failed to create learning path");
    } finally {
      setLoading(false);
    }
  };

  const getAllLessonIds = () => {
    return modules.flatMap(module => 
      module.chapters.flatMap(chapter => 
        chapter.lessons.map(lesson => lesson.id)
      )
    );
  };

  const getModuleLessonIds = (module: Module) => {
    return module.chapters.flatMap(chapter => 
      chapter.lessons.map(lesson => lesson.id)
    );
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.durationWeeks > 0;
      case 2:
        return formData.difficulty && formData.emoji;
      case 3:
        return formData.selectedLessons.length > 0;
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
              <Label htmlFor="title">Path Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Full-Stack Web Development Interview Prep"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="full-stack-web-development"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what learners will achieve in this path..."
                rows={4}
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
              <Label htmlFor="difficulty">Difficulty Level</Label>
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

            <div>
              <Label>Target Companies</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {COMPANY_OPTIONS.map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={company}
                      checked={formData.targetCompanies.includes(company)}
                      onCheckedChange={() => handleCompanyToggle(company)}
                    />
                    <Label htmlFor={company} className="text-sm">
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
            <div className="flex justify-between items-center">
              <Label>Select Lessons</Label>
              <div className="text-sm text-gray-500">
                {formData.selectedLessons.length} lessons selected
              </div>
            </div>

            <div className="space-y-4">
              {modules.map((module) => {
                const moduleLessonIds = getModuleLessonIds(module);
                const allModuleSelected = moduleLessonIds.every(id => 
                  formData.selectedLessons.includes(id)
                );
                const someModuleSelected = moduleLessonIds.some(id => 
                  formData.selectedLessons.includes(id)
                );

                return (
                  <Card key={module.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{module.emoji}</span>
                        <div>
                          <h3 className="font-medium">{module.title}</h3>
                          <p className="text-sm text-gray-500">
                            {module.chapters.length} chapters, {moduleLessonIds.length} lessons
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModuleSelect(moduleLessonIds)}
                      >
                        {allModuleSelected ? "Deselect All" : "Select All"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {module.chapters.map((chapter) => (
                        <div key={chapter.id} className="ml-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">
                            {chapter.title}
                          </h4>
                          <div className="space-y-1 ml-4">
                            {chapter.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={lesson.id}
                                  checked={formData.selectedLessons.includes(lesson.id)}
                                  onCheckedChange={() => handleLessonToggle(lesson.id)}
                                />
                                <Label htmlFor={lesson.id} className="text-sm flex-1">
                                  {lesson.title}
                                </Label>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.difficulty}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {Math.round(lesson.estimatedMinutes / 60)}h
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
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
            <Link href="/admin/learning-paths">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Learning Path</h1>
              <p className="text-gray-600">Build a structured learning journey for interview preparation</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
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
                    {step === 1 && "Basic Information"}
                    {step === 2 && "Path Configuration"}
                    {step === 3 && "Content Selection"}
                  </div>
                </div>
                {step < 3 && (
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

          <Separator className="my-8" />

          {/* Navigation */}
          <div className="flex justify-between">
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
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Create Path"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}