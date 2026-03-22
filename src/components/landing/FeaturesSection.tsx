"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Code2, Image, FileText, Globe, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Deep Reasoning",
    description: "Tackles complex problems with step-by-step logical thinking and nuanced analysis.",
  },
  {
    icon: Code2,
    title: "Code Generation",
    description: "Writes, debugs, and explains code across 40+ programming languages instantly.",
  },
  {
    icon: Image,
    title: "Vision & Images",
    description: "Understands images, charts, and screenshots — describe what you see or ask questions.",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description: "Upload PDFs, spreadsheets, or articles and get summaries, insights, and answers.",
  },
  {
    icon: Globe,
    title: "Real-Time Knowledge",
    description: "Access up-to-date information with integrated web browsing capabilities.",
  },
  {
    icon: Zap,
    title: "Lightning Responses",
    description: "Optimized inference delivers thoughtful responses in under two seconds.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features" className="relative py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg mx-auto mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Everything you need,{" "}
            <span className="text-gradient">nothing you don't</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Built for professionals, creators, and the deeply curious.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.6,
                delay: 0.08 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group rounded-2xl border border-border/50 bg-card/50 p-6 hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
