import { ArrowRight, FileText, Mic2, Sparkles, Upload } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload or Input Link",
    description: "Start by uploading your audio file or pasting a URL",
  },
  {
    icon: Mic2,
    title: "AI Speech-to-Text",
    description: "Advanced AI converts spoken words into accurate text",
  },
  {
    icon: Sparkles,
    title: "Smart Editing",
    description: "AI refines and optimizes the content structure",
  },
  {
    icon: FileText,
    title: "Article Generation",
    description: "Get your professionally formatted article",
  },
];

export function HowItWorks() {
  return (
    <section className="container py-24 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          How It Works
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Four simple steps to transform your audio content into polished articles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-6 w-6 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}