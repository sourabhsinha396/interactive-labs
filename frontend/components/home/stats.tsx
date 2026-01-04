"use client"

import { 
  BookOpen,
  Rocket,
  Trophy,
  CheckCircle2
} from "lucide-react"

export function Stats() {
  return (
    <section className="bg-background text-foreground">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-t border-border">
          {[
            { value: "50+", label: "Interactive Labs", icon: BookOpen },
            { value: "10,000+", label: "Active Students", icon: Rocket },
            { value: "95%", label: "Success Rate", icon: Trophy },
            { value: "4.8/5", label: "Average Rating", icon: CheckCircle2 }
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}