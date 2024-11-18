import React, { useCallback, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { LaborerWithHours } from '../types';
import { debounce } from '../utils/debounce';

interface LaborerTableProps {
  laborers: LaborerWithHours[];
  onEdit: (laborer: LaborerWithHours) => void;
  onDelete: (id: string) => void;
  onUpdateHours: (id: string, hours: number) => void;
}

export default function LaborerTable({
  laborers,
  onEdit,
  onDelete,
  onUpdateHours,
}: LaborerTableProps) {
  const [localHours, setLocalHours] = useState<Record<string, number>>({});

  const debouncedUpdateHours = useCallback(
    debounce((id: string, hours: number) => {
      onUpdateHours(id, hours);
    }, 1000),
    [onUpdateHours]
  );

  const handleHoursChange = (laborerId: string, value: string) => {
    const newValue = Number(value);
    if (!isNaN(newValue) && newValue >= 0) {
      setLocalHours(prev => ({ ...prev, [laborerId]: newValue }));
      debouncedUpdateHours(laborerId, newValue);
    }
  };

  const getHoursValue = (laborer: LaborerWithHours) => {
    return localHours[laborer.id] !== undefined 
      ? localHours[laborer.id] 
      : laborer.hours || 0;
  };

  return (
    <div className="mt-4 sm:mt-8">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <div className="block sm:hidden">
              {laborers.map((laborer) => (
                <div key={laborer.id} className="bg-white border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{laborer.name}</h3>
                      <p className="text-sm text-gray-600">Father: {laborer.fatherName}</p>
                      <p className="text-sm text-gray-600">Card No: {laborer.cardNo}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(laborer)}
                        className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
                        aria-label={`Edit ${laborer.name}`}
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(laborer.id)}
                        className="text-red-600 p-2 hover:bg-red-50 rounded-full"
                        aria-label={`Delete ${laborer.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-700 mb-1">Working Hours</label>
                    <input
                      type="number"
                      value={getHoursValue(laborer)}
                      onChange={(e) => handleHoursChange(laborer.id, e.target.value)}
                      className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
              ))}
              {laborers.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No laborers found. Add a new laborer to get started.
                </div>
              )}
            </div>

            <table className="hidden sm:table min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Father's Name</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Card No.</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Working Hours</th>
                  <th scope="col" className="relative px-4 sm:px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {laborers.map((laborer) => (
                  <tr key={laborer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {laborer.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {laborer.fatherName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {laborer.cardNo}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <input
                        type="number"
                        value={getHoursValue(laborer)}
                        onChange={(e) => handleHoursChange(laborer.id, e.target.value)}
                        className="w-24 px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                        step="0.5"
                        aria-label={`Working hours for ${laborer.name}`}
                      />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => onEdit(laborer)}
                        className="text-blue-600 hover:text-blue-900 mr-4 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label={`Edit ${laborer.name}`}
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(laborer.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        aria-label={`Delete ${laborer.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {laborers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No laborers found. Add a new laborer to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
