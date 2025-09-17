import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail, MessageCircle, FileText } from "lucide-react";

const CallToActionSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-hero via-trust-foreground to-hero">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-hero-foreground mb-6">
            Ready to Start Earning Risk-Free Returns?
          </h2>
          <p className="text-xl text-hero-foreground/80 mb-12 max-w-2xl mx-auto">
            Join thousands of users who are already earning guaranteed daily profits through cooperative arbitrage.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-hero-foreground/10 border-hero-foreground/20 text-center">
              <Mail className="w-8 h-8 text-hero-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-hero-foreground mb-2">Join Waitlist</h3>
              <p className="text-hero-foreground/70 text-sm">Get early access and priority onboarding</p>
            </Card>
            
            <Card className="p-6 bg-hero-foreground/10 border-hero-foreground/20 text-center">
              <FileText className="w-8 h-8 text-hero-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-hero-foreground mb-2">Read Whitepaper</h3>
              <p className="text-hero-foreground/70 text-sm">Detailed mathematical proofs and risk analysis</p>
            </Card>
            
            <Card className="p-6 bg-hero-foreground/10 border-hero-foreground/20 text-center">
              <MessageCircle className="w-8 h-8 text-hero-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-hero-foreground mb-2">Join Community</h3>
              <p className="text-hero-foreground/70 text-sm">Connect with other users and get support</p>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4 h-auto font-semibold">
              Join Waitlist Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10">
              Download Whitepaper
            </Button>
          </div>
          
          <div className="mt-12 text-hero-foreground/60 text-sm">
            <p>MVP launching Q2 2024 • Starting with €10 minimum deposits</p>
            <p className="mt-2">Daily limit €500 total matched until insurance pool grows</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;