import { Clock } from 'lucide-react';
import { Service } from '../types';

interface ServiceSelectionProps {
  services: Service[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  return (
    <div className="bg-gray-50 p-5 rounded-xl mb-8 border border-gray-200 text-slate-400">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-gray-700" />
        Delivery Option
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedService === service.id
                ? 'border-green-500 bg-green-50 shadow-sm'
                : 'border-gray-200 hover:bg-gray-100'
              }`}
          >
            <div className="flex items-center mb-2">
              <service.icon className={`h-6 w-6 mr-2 ${
                selectedService === service.id ? 'text-green-600' : 'text-gray-600'
                }`} />
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Delivery: {service.time}</div>
            <div className="text-sm font-medium mt-2">₱{service.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
