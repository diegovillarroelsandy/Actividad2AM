export interface Book {
  id?: string; // opcional, si quieres guardar el id de firestore
  title: string;
  author: string[];
  cover: string;
  categories?: string[];
  publishedDate?: string;
}
