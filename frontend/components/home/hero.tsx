"use client"

import Link from "next/link"
import { 
  Eye, 
  Play,
  Trophy,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MorphingText } from "@/components/animate-ui/primitives/texts/morphing"
import { Shine } from "@/components/animate-ui/primitives/effects/shine"
import { CodeBlockComponent } from "@/components/home/codeblock"

const morphingText = [
  "Django",
  "FastAPI",
  "React",
  "Next.js",
  "Tailwind CSS",
  "TypeScript",
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
]

const topics = [
  "FastAPI",
  "Django",
  "React",
  "Next.js",
  "Python",
  "JavaScript",
]

export function Hero() {
  return (
    <section className="relative bg-background text-foreground border-b border-border">
      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          
          {/* Left Column - Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            
            {/* Main Heading */}
            <h1 className="text-6xl font-extrabold leading-tight text-foreground">
              Interactive Labs
            </h1>
            <div className="flex gap-4">
              <p className="text-6xl font-extrabold leading-tight text-foreground">for</p>
              <MorphingText text={morphingText} loop={true} holdDelay={2500} className="text-teal-500 text-6xl font-extrabold mt-2" />
            </div>
            

            <p className="max-w-lg mx-auto lg:mx-0 text-lg sm:text-xl text-muted-foreground mt-4">
              In Browser Interactive Labs for every tech stack.
            </p>

            <p className="text-primary flex items-center justify-center lg:justify-start gap-2 font-medium mt-4">
              <Trophy className="h-5 w-5" />
              No credit card required
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-6">
              <Link href="/labs">
                <Shine loop={true} duration={3000}>
                  <Button
                    size="lg"
                    className='flex items-center justify-center bg-card hover:bg-accent border-primary border border-r-4 border-b-4 rounded-md text-foreground px-8 py-6 text-base font-semibold w-full cursor-pointer transition-colors'
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try for Free
                  </Button>
                </Shine>
              </Link>

              <Link href="/labs">
                <Button
                  size="lg"
                  className='flex items-center justify-center bg-card hover:bg-accent border-primary border border-r-4 border-b-4 rounded-md text-foreground px-8 py-6 text-base font-semibold w-full cursor-pointer transition-colors'
                >
                  <Eye className="mr-2 h-5 w-5" />
                  See Examples
                </Button>
              </Link>
            </div>

            {/* Topic Pills */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
              {topics.map((topic) => (
                <Link href={`/labs?topic=${topic.toLowerCase()}`} key={topic}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-muted/50 border-border hover:border-primary hover:bg-accent text-foreground transition-all border-primary border-r-4 border-b-4"
                  >
                    {topic}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>100+ interactive labs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>24/7 access</span>
              </div>
            </div>
          </div>

          {/* Right Column - Code Preview */}
          <div className="hidden lg:block lg:w-1/2 lg:pl-8">
            <CodeBlockComponent maxTilt={10} perspective={1500} initialTiltY={-10}/>
          </div>
        </div>
      </div>
    </section>
  )
}