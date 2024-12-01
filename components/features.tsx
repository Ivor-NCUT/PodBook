import {
  Brain,
  FileType,
  Gauge,
  Languages,
  Sparkles,
  Wand2,
} from "lucide-react";

const features = [
  {
    icon: FileType,
    title: "Multi-format Support",
    description: "Process podcasts, videos, audio files, and documents",
  },
  {
    icon: Brain,
    title: "Smart Voice Recognition",
    description: "Advanced AI accurately transcribes multiple speakers",
  },
  {
    icon: Wand2,
    title: "AI-powered Optimization",
    description: "Intelligent content structuring and enhancement",
  },
  {
    icon: Sparkles,
    title: "Professional Results",
    description: "Publication-ready articles with proper formatting",
  },
  {
    icon: Languages,
    title: "Multi-language Support",
    description: "Process content in multiple languages",
  },
  {
    icon: Gauge,
    title: "Real-time Processing",
    description: "Fast and efficient content transformation",
  },
];

export function Features() {
  return (
    <section className="container py-24 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Key Features
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Powerful capabilities to transform your content effectively
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary transition-colors"
          >
            <div className="space-y-4">
              <feature.icon className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}