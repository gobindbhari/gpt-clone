import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          NovaMind
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 NovaMind. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
