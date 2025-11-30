"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Save, Target, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

interface TemplateFormData {
  name: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetAudience: string;
  lessonsPerDay: number;
  daysPerWeek: number;
  estimatedHoursPerDay: number;
  includeModules: string[];
  excludeModules: string[];
  minDifficulty?: string;
  maxDifficulty?: string;
  companyFocus: string[];
  balanceTheoryPractice: boolean;
}

const EMOJI_OPTIONS = ["🎯", "🚀", "💻", "📚", "🔥", "⚡", "🌟", "🎓", "💡", "🏆"];
const DIFFICULTY_OPTIONS = ["BEGINNER", "EASY", "MEDIUM", "HARD"];
const COMPANY_OPTIONS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", 
  "Tesla", "Uber", "Airbnb", "Spotify", "Adobe", "Salesforce"
];

export default function CreatePathTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Array<{
    id: string;
    title: string;
    slug: string;
    emoji: string;
  }>>([]);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    emoji: "🎯",
    durationWeeks: 8,
    difficulty: "MEDIUM",
    targetAudience: "",
    lessonsPerDay: 2,
    daysPerWeek: 5,
    estimatedHoursPerDay: 2.0,
    includeModules: [],
    excludeModules: [],
    companyFocus: [],
    balanceTheoryPractice: true,
  });

  // Fetch modules for selection
  useState(() => {
    fetch("/api/navigation")
      .then(response => response.json())
      .then(data => setModules(data))
      .catch(error => console.error("Error fetching modules:", error));
  });

  const handleModuleToggle = (moduleId: string, type: 'include' | 'exclude') => {
    setFormData(prev => {
      const key = type === 'include' ? 'includeModules' : 'excludeModules';
      const currentModules = prev[key];
      
      if (currentModules.includes(moduleId)) {
        return {
          ...prev,
          [key]: currentModules.filter(id => id !== moduleId)
        };
      } else {
        return {
          ...prev,
          [key]: [...currentModules, moduleId]
        };
      }
    });
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
        body: JSON.stringify({
          ...formData,
          rules: {
            includeModules: formData.includeModules,
            excludeModules: formData.excludeModules,
            minDifficulty: formData.minDifficulty,
            maxDifficulty: formData.maxDifficulty,
            companyFocus: formData.companyFocus,
            balanceTheoryPractice: formData.balanceTheoryPractice,
          },
        }),
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

  const isFormValid = () => {
    return formData.name && 
           formData.description && 
           formData.targetAudience &&
           formData.durationWeeks > 0 &&
           formData.lessonsPerDay > 0 &&
           formData.daysPerWeek > 0 &&
           formData.estimatedHoursPerDay > 0;
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
              <p className="text-gray-600">Create a reusable template for learning path generation</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Full-Stack Developer Path"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this template is designed for..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Choose an Emoji</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                      className={`p-3 text-xl rounded-lg border-2 transition-all ${
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
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Beginners in web development"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Configuration */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Configuration
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="durationWeeks">Duration (Weeks) *</Label>
                  <Input
                    id="durationWeeks"
                    type="number"
                    min="1"
                    max="52"
                    value={formData.durationWeeks}
                    onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) || 1 }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lessonsPerDay">Lessons per Day *</Label>
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
                  <Label htmlFor="daysPerWeek">Days per Week *</Label>
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
                  <Label htmlFor="estimatedHoursPerDay">Hours per Day *</Label>
                  <Input
                    id="estimatedHoursPerDay"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={formData.estimatedHoursPerDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHoursPerDay: parseFloat(e.target.value) || 1 }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="balanceTheoryPractice"
                  checked={formData.balanceTheoryPractice}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, balanceTheoryPractice: !!checked }))}
                />
                <Label htmlFor="balanceTheoryPractice">
                  Balance theory and practice content
                </Label>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Rules */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Content Rules
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module Selection */}
            <div>
              <Label className="block text-sm font-medium mb-3">Include Modules</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-3">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`include-${module.id}`}
                      checked={formData.includeModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id, 'include')}
                    />
                    <label htmlFor={`include-${module.id}`} className="text-sm">
                      {module.emoji} {module.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-3">Exclude Modules</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-3">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exclude-${module.id}`}
                      checked={formData.excludeModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id, 'exclude')}
                    />
                    <label htmlFor={`exclude-${module.id}`} className="text-sm">
                      {module.emoji} {module.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Difficulty Range */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="minDifficulty">Minimum Difficulty</Label>
              <Select
                value={formData.minDifficulty || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, minDifficulty: value || undefined }))}
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
              <Label htmlFor="maxDifficulty">Maximum Difficulty</Label>
              <Select
                value={formData.maxDifficulty || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, maxDifficulty: value || undefined }))}
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

          <Separator className="my-6" />

          {/* Company Focus */}
          <div>
            <Label className="block text-sm font-medium mb-3">Company Focus</Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {COMPANY_OPTIONS.map((company) => (
                <div key={company} className="flex items-center space-x-2">
                  <Checkbox
                    id={company}
                    checked={formData.companyFocus.includes(company)}
                    onCheckedChange={() => handleCompanyToggle(company)}
                  />
                  <label htmlFor={company} className="text-sm">
                    {company}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </div>
    </div>
  );
}