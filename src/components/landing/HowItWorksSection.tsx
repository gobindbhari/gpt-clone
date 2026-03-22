"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Cpu, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Ask your question",
    description: "Type naturally — complex queries, follow-ups, or creative prompts.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI processes deeply",
    description: "Advanced reasoning chains analyze your request from multiple angles.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Get precise answers",
    description: "Receive clear, actionable responses you can use immediately.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps to{" "}
            <span className="text-gradient">clarity</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            No setup, no learning curve. Just start talking.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative text-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-xs font-semibold text-primary/60 tracking-widest uppercase mb-2">
                Step {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px bg-border/60" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
