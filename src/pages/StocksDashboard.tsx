import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StocksDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stocks Dashboard</h1>
            <p className="text-muted-foreground">Stock arbitrage opportunities coming soon</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </div>

        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Under Construction</h2>
          <p className="text-muted-foreground">
            Stock arbitrage dashboard will be available soon. We're working on integrating real-time stock data and opportunities.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default StocksDashboard;