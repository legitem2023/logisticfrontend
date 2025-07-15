export default function LogisticFormLoading() => {

return (
  <div className="max-w-4xl mx-auto pt-2">
    <div className="bg-white shadow-xl overflow-hidden">
      <div className="bg-green-600 customgrad p-6 text-white">
        <Shimmer width="250px" height="32px" />
        <Shimmer width="180px" height="20px" className="mt-2" />
      </div>
      
      <div className="p-2">
        {/* Pickup Section */}
        <div className="mb-6">
          <Shimmer width="150px" height="24px" className="mb-3" />
          <Shimmer height="72px" rounded />
        </div>
        
        {/* Dropoff Section */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <Shimmer width="160px" height="24px" />
            <Shimmer width="120px" height="32px" rounded />
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Shimmer height="72px" rounded className="flex-1" />
                <Shimmer width="40px" height="40px" rounded="full" className="ml-2" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Vehicle Selection */}
        <div className="mb-6">
          <Shimmer width="120px" height="24px" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-2 rounded-xl overflow-hidden border-gray-200">
                <Shimmer height="100px" />
                <Shimmer height="36px" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Service Selection */}
        <div className="mb-8">
          <Shimmer width="140px" height="24px" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Shimmer key={i} height="100px" rounded />
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <Shimmer height="52px" rounded />
      </div>
    </div>
  </div>
);
}
