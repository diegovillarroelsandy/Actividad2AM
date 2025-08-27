import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Book } from "../types/book";

interface FavoritesContextProps {
  favorites: Book[];
  refreshFavorites: () => void;
  removeFavorite: (bookId: string) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextProps>({
  favorites: [],
  refreshFavorites: () => {},
  removeFavorite: async () => {},
});

interface Props {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<Props> = ({ children }) => {
  const [favorites, setFavorites] = useState<Book[]>([]);

  const refreshFavorites = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const snapshot = await getDocs(
        collection(db, "users", userId, "favorites")
      );
      setFavorites(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Book),
        }))
      );
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    }
  };

  const removeFavorite = async (bookId: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("No hay usuario logueado");
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "favorites", bookId);
      await deleteDoc(docRef);

      // Actualiza estado local
      setFavorites((prev) => prev.filter((b) => b.id !== bookId));
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, refreshFavorites, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
