import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProfitCalculator from "@/components/ProfitCalculator";
import BenefitsSection from "@/components/BenefitsSection";
import CallToActionSection from "@/components/CallToActionSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <ProfitCalculator />
      <BenefitsSection />
      <CallToActionSection />
    </div>
  );
};

export default Index;
