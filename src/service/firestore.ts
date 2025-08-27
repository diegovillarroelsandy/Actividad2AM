import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Book } from "../types/book";

export async function addFavorite(userId: string, book: Book) {
  if (!book.title || !book.author || !book.cover) {
    console.error("Datos incompletos del libro:", book);
    return;
  }

  try {
    await addDoc(collection(db, "users", userId, "favorites"), {
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
    });

    console.log("Favorito guardado!");
  } catch (e) {
    console.error("Error al guardar favorito: ", e);
  }
}
