"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-primary/20 bg-primary/5 px-8 py-16 sm:px-16 sm:py-20 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Ready to think{" "}
              <span className="text-gradient">differently?</span>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              Join thousands of people who use NovaMind to work smarter every day.
            </p>
            <div className="mt-8">
              <Button size="lg" className="glow-sm group">
                Get Started — It's Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
