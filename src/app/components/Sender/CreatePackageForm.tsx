'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATEPACKAGE } from "../../../../graphql/mutation";
import { showToast } from '../../../../utils/toastify';

export const CreatePackageForm = ({ deliveryId }: { deliveryId: string }) => {
  const [form, setForm] = useState({
    packageType: '',
    weight: '',
    dimensions: '',
    specialInstructions: '',
  });

  const [createPackage, { loading }] = useMutation(CREATEPACKAGE, {
    onCompleted: (data) => {
      showToast(`Success: ${data.createPackage.statusText}`, 'success');
    },
    onError: (error) => {
      showToast(`Error: ${error.message}`, 'error');
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-lg font-bold">Create Package</h2>

      <input
        name="packageType"
        type="text"
        placeholder="Package Type"
        value={form.packageType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="weight"
        type="number"
        step="0.01"
        placeholder="Weight (kg)"
        value={form.weight}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="dimensions"
        type="text"
        placeholder="Dimensions (e.g. 10x20x30cm)"
        value={form.dimensions}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <textarea
        name="specialInstructions"
        placeholder="Special Instructions"
        value={form.specialInstructions}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Create Package'}
      </button>
    </form>
  );
};
