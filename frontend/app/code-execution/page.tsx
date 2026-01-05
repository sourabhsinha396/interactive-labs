"use client";

import { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Code2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeEditor } from '@/components/code-execution/code-editor';
import { OutputPanel } from '@/components/code-execution/output-panel';
import { CurlDisplay } from '@/components/code-execution/curl-display';
import api from '@/lib/fetchWithAuth';
import { 
  CodeExecutionRequest, 
  CodeExecutionResponse,
  SupportedLanguagesResponse 
} from '@/types/code-execution';
import { getExampleCode } from '@/lib/example-codes';

export default function PlaygroundPage() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [stdin, setStdin] = useState<string>('');
  const [result, setResult] = useState<CodeExecutionResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [showCurl, setShowCurl] = useState(false);

  // Fetch supported languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get('/code-execution/languages', false);
        if (response.ok) {
          const data: SupportedLanguagesResponse = await response.json();
          setLanguages(data.languages);
          // Set default language if available
          if (data.languages.length > 0 && !data.languages.includes(selectedLanguage)) {
            const defaultLang = data.languages.find(l => l === 'python') || data.languages[0];
            setSelectedLanguage(defaultLang);
            setCode(getExampleCode(defaultLang));
          }
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  // Load example code when language changes
  useEffect(() => {
    setCode(getExampleCode(selectedLanguage));
  }, [selectedLanguage]);

  const handleExecute = async () => {
    setIsExecuting(true);
    setResult(null);
    setShowCurl(false);

    try {
      const requestData: CodeExecutionRequest = {
        code,
        language: selectedLanguage,
        ...(stdin && { stdin })
      };

      const response = await api.post('/code-execution/execute', requestData, false);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Execution failed');
      }

      const data: CodeExecutionResponse = await response.json();
      setResult(data);
      setShowCurl(true);
    } catch (error: any) {
      setResult({
        stdout: '',
        stderr: '',
        exit_code: 1,
        execution_time: 0,
        error: error.message || 'Failed to execute code'
      });
      setShowCurl(true);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(getExampleCode(selectedLanguage));
    setStdin('');
    setResult(null);
    setShowCurl(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Code Playground</h1>
              <p className="text-muted-foreground">
                Write, run, and test code in multiple programming languages
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Code Editor</CardTitle>
                    <CardDescription>
                      Write your code below and click Run to execute
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                      disabled={isLoadingLanguages || isExecuting}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingLanguages ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] border-t border-border">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage}
                    readOnly={isExecuting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Input Section */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Standard Input (stdin)
                </CardTitle>
                <CardDescription className="text-xs">
                  Optional: Provide input for your program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter input for your program..."
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  disabled={isExecuting}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExecute}
                disabled={isExecuting || !code.trim()}
                size="lg"
                className="flex-1"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Code
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                disabled={isExecuting}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Curl Display */}
            {showCurl && (
              <CurlDisplay
                code={code}
                language={selectedLanguage}
                stdin={stdin}
              />
            )}
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-1">
            <Card className="border-border sticky top-4">
              <CardContent className="p-0">
                <div className="h-[calc(100vh-200px)] min-h-[600px]">
                  <OutputPanel
                    result={result}
                    isExecuting={isExecuting}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}