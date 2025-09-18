import HeroSection from "@/components/HeroSection";
import ArbitrageExplanation from "@/components/ArbitrageExplanation";
import PoolingSystemSection from "@/components/PoolingSystemSection";
import MathematicalBreakdown from "@/components/MathematicalBreakdown";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProfitCalculator from "@/components/ProfitCalculator";
import InvestorSection from "@/components/InvestorSection";
import BenefitsSection from "@/components/BenefitsSection";
import CallToActionSection from "@/components/CallToActionSection";

const Info = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ArbitrageExplanation />
      <PoolingSystemSection />
      <MathematicalBreakdown />
      <HowItWorksSection />
      <ProfitCalculator />
      <InvestorSection />
      <BenefitsSection />
      <CallToActionSection />
    </div>
  );
};

export default Info;