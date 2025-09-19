import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterCriteria {
  sport: string;
  minTime: string;
  maxTime: string;
  minProfitMargin: string;
  maxProfitMargin: string;
  minPoolSize: string;
  maxPoolSize: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterCriteria) => void;
  currentFilters: FilterCriteria;
}

const FilterDialog = ({ open, onOpenChange, onApplyFilters, currentFilters }: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterCriteria>(currentFilters);

  const sports = [
    { value: "all", label: "All Sports" },
    { value: "Football", label: "Football" },
    { value: "Basketball", label: "Basketball" },
    { value: "Tennis", label: "Tennis" }
  ];

  const handleInputChange = (field: keyof FilterCriteria, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = {
      sport: "all",
      minTime: "",
      maxTime: "",
      minProfitMargin: "",
      maxProfitMargin: "",
      minPoolSize: "",
      maxPoolSize: ""
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Opportunities</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Sport Filter */}
          <div>
            <Label htmlFor="sport">Sport</Label>
            <Select value={filters.sport} onValueChange={(value) => handleInputChange("sport", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Filter */}
          <div>
            <Label>Remaining Time (minutes)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minTime" className="text-xs text-muted-foreground">Min</Label>
                <Input
                  id="minTime"
                  type="number"
                  placeholder="0"
                  value={filters.minTime}
                  onChange={(e) => handleInputChange("minTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxTime" className="text-xs text-muted-foreground">Max</Label>
                <Input
                  id="maxTime"
                  type="number"
                  placeholder="∞"
                  value={filters.maxTime}
                  onChange={(e) => handleInputChange("maxTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Profit Margin Filter */}
          <div>
            <Label>Profit Margin (%)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minProfit" className="text-xs text-muted-foreground">Min</Label>
                <Input
                  id="minProfit"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={filters.minProfitMargin}
                  onChange={(e) => handleInputChange("minProfitMargin", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxProfit" className="text-xs text-muted-foreground">Max</Label>
                <Input
                  id="maxProfit"
                  type="number"
                  step="0.1"
                  placeholder="∞"
                  value={filters.maxProfitMargin}
                  onChange={(e) => handleInputChange("maxProfitMargin", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Pool Size Filter */}
          <div>
            <Label>Pool Size ($)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minPool" className="text-xs text-muted-foreground">Min</Label>
                <Input
                  id="minPool"
                  type="number"
                  placeholder="0"
                  value={filters.minPoolSize}
                  onChange={(e) => handleInputChange("minPoolSize", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxPool" className="text-xs text-muted-foreground">Max</Label>
                <Input
                  id="maxPool"
                  type="number"
                  placeholder="∞"
                  value={filters.maxPoolSize}
                  onChange={(e) => handleInputChange("maxPoolSize", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;