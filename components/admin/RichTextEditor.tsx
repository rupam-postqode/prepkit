"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
});

const MDEditorPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  preview?: "live" | "edit" | "preview";
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your lesson content...",
  height = 400,
  preview = "live"
}: RichTextEditorProps) {
  const [currentPreview, setCurrentPreview] = useState<"edit" | "live" | "preview">(preview);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={currentPreview === "edit" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPreview("edit")}
          >
            ✏️ Edit
          </Button>
          <Button
            variant={currentPreview === "live" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPreview("live")}
          >
            👁️ Live Preview
          </Button>
          <Button
            variant={currentPreview === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPreview("preview")}
          >
            📖 Preview Only
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          {value.length} characters
        </div>
      </div>

      {/* Editor */}
      <Card className="overflow-hidden">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          preview={currentPreview}
          hideToolbar={false}
          visibleDragbar={false}
          height={height}
          textareaProps={{
            placeholder,
          }}
          previewOptions={{
            rehypePlugins: [],
            remarkPlugins: [],
          }}
        />
      </Card>

      {/* Help Text */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Markdown Quick Reference:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><code>**bold**</code> → <strong>bold</strong></div>
          <div><code>*italic*</code> → <em>italic</em></div>
          <div><code>`code`</code> → <code>code</code></div>
          <div><code>```code block```</code> → code block</div>
          <div><code>[link](url)</code> → link</div>
          <div><code>![alt](image)</code> → image</div>
          <div><code># Header</code> → Header</div>
          <div><code>- List item</code> → List item</div>
        </div>
      </div>
    </div>
  );
}

// Utility function to convert markdown to HTML (for preview)
export function markdownToHtml(markdown: string): string {
  // This is a basic implementation - in production, you'd use a proper markdown parser
  return markdown
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>");
}

// Word count utility
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Reading time estimate
export function getReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = getWordCount(text);
  return Math.ceil(wordCount / wordsPerMinute);
}
