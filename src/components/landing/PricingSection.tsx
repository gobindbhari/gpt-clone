"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["50 messages per day", "Standard model", "Chat history (7 days)", "Community support"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$18",
    period: "per month",
    description: "For power users and professionals",
    features: [
      "Unlimited messages",
      "Advanced reasoning model",
      "Image & document uploads",
      "Chat history (unlimited)",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$42",
    period: "per seat / month",
    description: "Collaborate with your whole team",
    features: [
      "Everything in Pro",
      "Shared workspaces",
      "Admin dashboard",
      "API access",
      "SSO & compliance",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="pricing" className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, <span className="text-gradient">honest</span> pricing
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Start free. Scale when you're ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-primary/40 bg-primary/5 glow-md"
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.highlighted ? "glow-sm" : ""}`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
