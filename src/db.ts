
import "firebase/firestore";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { Category, Laborer, LaborHours, LaborerWithHours } from './types';
import { startOfMonth, endOfMonth, format } from 'date-fns';
// import { writeBatch } from "firebase/firestore/lite";

// Firestore collection references
const laborersCollection = collection(db, "laborers");
const laborHoursCollection = collection(db, "laborHours");

// Helper function to convert Firestore doc to Laborer
// const convertDocToLaborer = (doc: DocumentSnapshot): Laborer => {
//   const data = doc.data();
//   if (!data) throw new Error('Document data is undefined');

//   return {
//     id: data.id || doc.id, // Use the stored id if present; otherwise use string-based doc.id
//     name: data.name,
//     fatherName: data.fatherName,
//     cardNo: data.cardNo,
//     category: data.category as Category
//   };
// };

// Add a laborer
export async function addLaborer(laborer: Omit<Laborer, 'id'>): Promise<string> {
  const docRef = await addDoc(laborersCollection, {
    ...laborer,
    createdAt: Timestamp.now()
  });

  const id = docRef.id; // Firestore string ID
  // Optionally store the ID explicitly in the document
  await updateDoc(docRef, { id });

  return id;
}

// Get laborers by category
export async function getLaborers(category: Category): Promise<Laborer[]> {
  const q = query(
    laborersCollection, 
    where("category", "==", category),
    orderBy("cardNo", "asc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Laborer));
}

// Update a laborer
export async function updateLaborer(laborer: LaborerWithHours): Promise<void> {
  const { id, hours, ...updatedData } = laborer;
  if (!id) throw new Error('Laborer ID is required for update');

  const docRef = doc(db, "laborers", id);
  await updateDoc(docRef, {
    ...updatedData,
    id, // Ensure the ID is stored in the document
    category: updatedData.category as Category
  });
}

// Delete a laborer
export async function deleteLaborer(id: string): Promise<void> {
  // First delete the laborer document
  const laborerRef = doc(db, "laborers", id);
  await deleteDoc(laborerRef);

  // Then delete all associated hours records
  const hoursQuery = query(laborHoursCollection, where("laborerId", "==", id));
  const snapshot = await getDocs(hoursQuery);
  
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

// Get hours for a specific date
export async function getHours(date: string): Promise<LaborHours[]> {
  const q = query(laborHoursCollection, where("date", "==", date));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    laborerId: doc.data().laborerId,
    date: doc.data().date,
    hours: Number(doc.data().hours)
  }));
}

// Update hours for a laborer on a specific date
export async function updateHours(laborerId: string, date: string, hours: number): Promise<void> {
  try {
    const q = query(
      laborHoursCollection,
      where("laborerId", "==", laborerId),
      where("date", "==", date)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Create new document
      const docRef = await addDoc(laborHoursCollection, {
        laborerId,
        date,
        hours: Number(hours),
        createdAt: Timestamp.now()
      });
      
      // Update with ID after creation
      await updateDoc(docRef, { id: docRef.id });
    } else {
      // Update existing document
      const docRef = doc(db, "laborHours", snapshot.docs[0].id);
      await updateDoc(docRef, { 
        hours: Number(hours),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error in updateHours:', error);
    throw error;
  }
}

// Get month data for CSV export
export async function getMonthData(
  category: Category,
  year: number,
  month: number
): Promise<Array<{
  name: string;
  fatherName: string;
  cardNo: string;
  hours: Array<{ date: string; hours: number }>;
}>> {
  const laborers = await getLaborers(category);

  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));

  const hoursQuery = query(
    laborHoursCollection,
    where("date", ">=", format(startDate, 'yyyy-MM-dd')),
    where("date", "<=", format(endDate, 'yyyy-MM-dd'))
  );
  const hoursSnapshot = await getDocs(hoursQuery);

  const hoursData = hoursSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      laborerId: data.laborerId,
      date: data.date,
      hours: Number(data.hours)
    };
  });

  return laborers.map(laborer => ({
    name: laborer.name,
    fatherName: laborer.fatherName,
    cardNo: laborer.cardNo,
    hours: hoursData
      .filter(hour => hour.laborerId === laborer.id)
      .map(hour => ({
        date: hour.date,
        hours: hour.hours
      }))
  }));
}

// Check for duplicate card numbers
export async function checkDuplicateCard(
  cardNo: string,
  category: Category,
  excludeId?: string
): Promise<boolean> {
  const q = query(
    laborersCollection,
    where("cardNo", "==", cardNo),
    where("category", "==", category)
  );
  const snapshot = await getDocs(q);

  if (excludeId) {
    return snapshot.docs.some(doc => {
      const data = doc.data();
      return data.id !== excludeId;
    });
  }

  return !snapshot.empty;
}
