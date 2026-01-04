"use client"

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Tilt, TiltContent } from "@/components/animate-ui/primitives/effects/tilt"
import { Code, CodeHeader, CodeBlock } from '@/components/animate-ui/components/animate/code';

const codeExample = "from fastapi import FastAPI|||from openai import OpenAI|||from pydantic import BaseModel|||  |||app = FastAPI(title='AI Outline Generator')|||client = OpenAI()|||  |||class CourseRequest(BaseModel):|||    topic: str|||  |||@app.post('/generate-course')|||async def generate_course(request: CourseRequest):|||    response = client.chat.completions.create(|||        model='gpt-4',|||        messages=[{'role': 'user', 'content': f'Create a course outline for {request.topic}'}]|||    )|||    return {'outline': response.choices[0].message.content}"

interface CodeBlockComponentProps {
  filename?: string;
  lang?: string;
  duration?: number;
  maxTilt?: number;
  perspective?: number;
  initialTiltY?: number; // Add this prop
}

export function CodeBlockComponent({ 
  filename = "main.py",
  lang = "python",
  duration = 3000,
  maxTilt = 8,
  perspective = 1500,
  initialTiltY = -5 // Default tilt to left (-5 degrees)
}: CodeBlockComponentProps) {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine current theme with fallback chain
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (!mounted) return 'light';
    
    // If theme is explicitly set to light or dark, use it
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    
    // If resolvedTheme is available, use it
    if (resolvedTheme === 'light' || resolvedTheme === 'dark') {
      return resolvedTheme;
    }
    
    // If system theme is available, use it
    if (systemTheme === 'light' || systemTheme === 'dark') {
      return systemTheme;
    }
    
    // Fallback to light
    return 'light';
  };
  
  const currentTheme = getCurrentTheme();

  return (
    <div className="w-full">
      {/* Desktop - Full Interactive CodeBlock */}
      <div className="hidden lg:block">
        <Tilt maxTilt={maxTilt} perspective={perspective} className="w-full">
          <TiltContent 
            className="h-full"
            initial={{ rotateY: initialTiltY }} // Add initial tilt
            animate={{ rotateY: initialTiltY }} // Keep initial tilt until hover
          >
            <div className="relative animate-slide-up">
              {/* Main Card with Code Editor */}
              <div className="relative group">                
                {/* Card with blur fix */}
                <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border transform-gpu will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d] border-teal-500 border-r-4 border-b-4">
                  {/* Code Component */}
                  <Code 
                    key={`code-${currentTheme}-${mounted}`} 
                    code={codeExample.replace(/\|\|\|/g, '\n')}
                    className='border-none'
                  >
                    <CodeHeader>
                      <div className="flex items-center justify-between w-full px-2">
                        <span className="text-sm font-medium text-muted-foreground">{filename}</span>
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        </div>
                      </div>
                    </CodeHeader>
                    <CodeBlock 
                      lang={lang} 
                      theme={currentTheme}
                      writing={mounted}
                      duration={duration}
                    />
                  </Code>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl -z-10 transition-opacity duration-500" />
              </div>
            </div>
          </TiltContent>
        </Tilt>
      </div>
    </div>
  )
}