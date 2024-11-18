import React from 'react';
import { Download, Search } from 'lucide-react';
import type { Category } from '../types';

interface HeaderProps {
  category: Category;
  setCategory: (category: Category) => void;
  date: string;
  setDate: (date: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDownloadCSV: () => void;
  onAddLaborer: () => void;
}

const categories: Category[] = ['Milk', 'Paneer', 'Ice Cream', 'Curd'];

export default function Header({
  category,
  setCategory,
  date,
  setDate,
  searchTerm,
  setSearchTerm,
  onDownloadCSV,
  onAddLaborer,
}: HeaderProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="px-4 py-2 sm:py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 sm:py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full"
            />

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search laborers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-2 sm:py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onDownloadCSV}
              className="inline-flex items-center justify-center px-6 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </button>
            <button
              onClick={onAddLaborer}
              className="inline-flex items-center justify-center px-6 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-full sm:w-auto"
            >
              Add Laborer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}