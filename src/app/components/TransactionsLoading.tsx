// components/TransactionsLoading.tsx
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { CalendarIcon, DownloadIcon, EyeIcon, ChevronLeft, ChevronRight, MoreHorizontal, FileSignature } from "lucide-react";
import Shimmer from "./ui/Shimmer";

const TransactionsLoading = () => {
  // Create 5 skeleton cards (typical loading amount)
  const skeletonCards = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="relative p-1 space-y-4">
      {/* Filter Bar Loading */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3">
          <Shimmer height="40px" width="100%" rounded />
          <Shimmer height="40px" width="140px" rounded />
          <Shimmer height="40px" width="100px" rounded />
        </div>
      </div>

      {/* Items Per Page Selector Loading */}
      <div className="flex items-center justify-end gap-2 text-sm">
        <Shimmer width="100px" height="20px" />
        <Shimmer width="60px" height="32px" rounded />
      </div>

      {/* Delivery Cards Loading */}
      <div className="grid gap-4">
        {skeletonCards.map((index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
              <div className="flex-1 space-y-2">
                <Shimmer width="120px" height="14px" />
                <Shimmer width="180px" height="18px" />
                <div className="space-y-1">
                  <Shimmer width="80%" height="14px" />
                  <Shimmer width="60%" height="14px" />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Shimmer width="80px" height="24px" rounded="full" />
                <Shimmer width="80px" height="32px" rounded />
                <Shimmer width="100px" height="32px" rounded />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls Loading */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
        <Shimmer width="200px" height="20px" />
        
        <div className="flex items-center gap-1">
          <Shimmer width="32px" height="32px" rounded />
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            <Shimmer width="32px" height="32px" rounded />
            <Shimmer width="32px" height="32px" rounded />
            <Shimmer width="32px" height="32px" rounded />
            <Shimmer width="32px" height="32px" rounded />
          </div>
          
          <Shimmer width="32px" height="32px" rounded />
        </div>
      </div>
    </div>
  );
};

export default TransactionsLoading;
