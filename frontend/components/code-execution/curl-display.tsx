"use client";

import { Check, Copy, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface CurlDisplayProps {
  code: string;
  language: string;
  stdin?: string;
}

export function CurlDisplay({ code, language, stdin }: CurlDisplayProps) {
  const [copied, setCopied] = useState(false);

  const generateCurl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    const endpoint = `${apiUrl}/code-execution/execute`;
    
    const payload = {
      code,
      language: language.toLowerCase(),
      ...(stdin && { stdin })
    };

    return `curl -X POST '${endpoint}' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(payload, null, 2).replace(/'/g, "\\'")}'`;
  };

  const curlCommand = generateCurl();

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            API Request
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto">
          {curlCommand}
        </pre>
      </CardContent>
    </Card>
  );
}