export type Category = 'Milk' | 'Paneer' | 'Ice Cream' | 'Curd';

export interface Laborer {
  id: string; // Make id required instead of optional
  name: string;
  fatherName: string;
  cardNo: string;
  category: Category;
}
export interface LaborHours {
  id?: string; // If Firestore or other database generates a unique ID
  laborerId: string; // Changed from `number` to `string`
  date: string;
  hours: number;
}


export interface LaborerWithHours extends Laborer {
  hours: number;
}