'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATEPACKAGE } from "../../../../graphql/mutation";
import { showToast } from '../../../../utils/toastify';
import { PackagePlus } from "lucide-react";

type Packages = {
  packageType: string;
  weight: string;
  dimensions: string;
  specialInstructions: string;
};

const CreatePackageForm = ({ deliveryId, Package }: { deliveryId: string; Package: Packages }) => {
 console.log(Package,"<<<");
  const [form, setForm] = useState({
    packageType: Package.packageType || '',
    weight: Package.weight || '',
    dimensions: Package.dimensions || '',
    specialInstructions: Package.specialInstructions || '',
  });

  const [createPackage, { loading }] = useMutation(CREATEPACKAGE, {
    onCompleted: (data) => {
      showToast(`✅ ${data.createPackage.statusText}`, 'success');
    },
    onError: (error) => {
      showToast(`❌ ${error.message}`, 'error');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createPackage({
      variables: {
        deliveryId,
        packageType: form.packageType,
        weight: parseFloat(form.weight),
        dimensions: form.dimensions,
        specialInstructions: form.specialInstructions,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white to-gray-50 p-4 max-w-xl mx-auto space-y-6 border border-gray-200"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Package Type</label>
          <input
            name="packageType"
            type="text"
            placeholder="e.g. Fragile, Express"
            value={form.packageType}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            name="weight"
            type="number"
            step="0.01"
            placeholder="e.g. 2.5"
            value={form.weight}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Dimensions</label>
          <input
            name="dimensions"
            type="text"
            placeholder="e.g. 10x20x30 cm"
            value={form.dimensions}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Special Instructions</label>
          <textarea
            name="specialInstructions"
            placeholder="Write any handling notes here..."
            value={form.specialInstructions}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white customgrad hover:bg-blue-700 transition-all shadow-lg ${
          loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Submitting...' : 'Save Package'}
      </button>
    </form>
  );
};

export default CreatePackageForm;
