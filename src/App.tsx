import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import Header from './components/Header';
import Footer from './components/Footer';
import LaborerTable from './components/LaborerTable';
import AddLaborerModal from './components/AddLaborerModal';
import EditLaborerModal from './components/EditLaborerModal';
import {
  addLaborer,
  getLaborers,
  updateLaborer,
  deleteLaborer,
  updateHours,
  getHours,
  getMonthData,
  checkDuplicateCard,
} from './db';
import type { Category, Laborer, LaborerWithHours } from './types';

export default function App() {
  const [category, setCategory] = useState<Category>('Milk');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState<LaborerWithHours | null>(null);
  const [laborers, setLaborers] = useState<LaborerWithHours[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, [category, date]);

  async function loadData() {
    try {
      setIsLoading(true);
      const laborersList = await getLaborers(category);
      const hoursData = await getHours(date);

      const laborersWithHours = laborersList.map((laborer) => ({
        ...laborer,
        hours: hoursData.find((h) => h.laborerId === laborer.id)?.hours || 0,
      }));

      setLaborers(laborersWithHours);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [category, date]);
  

  const handleAddLaborer = async (data: Omit<Laborer, 'id'>) => {
    try {
      const isDuplicate = await checkDuplicateCard(data.cardNo, data.category);
      if (isDuplicate) {
        alert('Warning: A laborer with this card number already exists in this category!');
        return;
      }
      await addLaborer(data);
      setIsAddModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error adding laborer:', error);
      alert('Error adding laborer. Please try again.');
    }
  };

  const handleUpdateHours = async (laborerId: string, hours: number) => {
    try {
      await updateHours(laborerId, date, hours);
      // Update local state immediately
      setLaborers(prev => 
        prev.map(laborer => 
          laborer.id === laborerId 
            ? { ...laborer, hours } 
            : laborer
        )
      );
    } catch (error) {
      console.error('Error updating hours:', error);
      // Reload data if update fails
      await loadData();
    }
  };

  const sortedFilteredLaborers = useMemo(() => {
    return [...laborers]
      .sort((a, b) => a.cardNo.localeCompare(b.cardNo))
      .filter(
        (laborer) =>
          laborer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          laborer.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          laborer.cardNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [laborers, searchTerm]);

  const handleEdit = (laborer: LaborerWithHours) => {
    setSelectedLaborer(laborer);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (laborer: LaborerWithHours) => {
    try {
      const isDuplicate = await checkDuplicateCard(laborer.cardNo, laborer.category, laborer.id);
      if (isDuplicate) {
        alert('Warning: A laborer with this card number already exists in this category!');
        return;
      }
      await updateLaborer(laborer);
      setIsEditModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error updating laborer:', error);
      alert('Error updating laborer. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this laborer?')) {
      try {
        await deleteLaborer(id);
        await loadData(); // Reload data after deletion
      } catch (error) {
        console.error('Error deleting laborer:', error);
      }
    }
  };
  

  const handleDownloadCSV = async () => {
    try {
      const currentDate = new Date(date);
      const data = await getMonthData(
        category,
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      
      const csvContent = [
        ['Name', 'Father Name', 'Card No.', 'Date', 'Hours'].join(','),
        ...data.flatMap((laborer) =>
          laborer.hours.map((hour) => [
            laborer.name || 'Unknown',
            laborer.fatherName || 'Unknown',
            laborer.cardNo || 'Unknown',
            hour.date || 'Unknown',
            hour.hours || 0,
          ].join(','))
        ),
      ].join('\n');
      

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${category}-${format(currentDate, 'yyyy-MM')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const filteredLaborers = laborers.filter(
    (laborer) =>
      laborer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laborer.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laborer.cardNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        category={category}
        setCategory={setCategory}
        date={date}
        setDate={setDate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onDownloadCSV={handleDownloadCSV}
        onAddLaborer={() => setIsAddModalOpen(true)}
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <LaborerTable
            laborers={sortedFilteredLaborers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateHours={handleUpdateHours}
          />
        )}
      </main>

      <Footer />

      <AddLaborerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLaborer}
        category={category}
      />

      <EditLaborerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        laborer={selectedLaborer}
      />
    </div>
  );
}