import { CheckCircle2 } from 'lucide-react';

const SuccessMessage: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50 flex items-center">
      <CheckCircle2 className="h-6 w-6 mr-2" />
      Delivery scheduled successfully!
    </div>
  );
};

export default SuccessMessage;
