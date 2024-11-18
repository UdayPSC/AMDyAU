import React, { useState, useEffect } from 'react';
import type { Category, LaborerWithHours } from '../types';

interface EditLaborerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LaborerWithHours) => void;
  laborer: LaborerWithHours | null;
}

export default function EditLaborerModal({
  isOpen,
  onClose,
  onSubmit,
  laborer,
}: EditLaborerModalProps) {
  const [formData, setFormData] = useState<LaborerWithHours | null>(null);

  useEffect(() => {
    if (laborer) {
      setFormData(laborer);
    }
  }, [laborer]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto my-8">
        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            Edit Laborer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>

            {/* Father's Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Father's Name
              </label>
              <input
                type="text"
                required
                value={formData.fatherName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherName: e.target.value })
                }
                className="block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>

            {/* Card No Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Card No.
              </label>
              <input
                type="text"
                required
                value={formData.cardNo}
                onChange={(e) =>
                  setFormData({ ...formData, cardNo: e.target.value })
                }
                className="block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>

            {/* Button Group */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}