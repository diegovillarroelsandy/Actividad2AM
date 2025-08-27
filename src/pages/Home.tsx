import React, { useState, useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { searchBooks } from "../service/booksApi";
import { addFavorite } from "../service/firestore";
import { Book } from "../types/book";
import { FavoritesContext } from "../context/FavoriteContext";

const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState(""); // mensaje de éxito
  const [error, setError] = useState(""); // mensaje de error
  const { refreshFavorites } = useContext(FavoritesContext);
  const history = useHistory();

  const handleSearch = async () => {
    const results = await searchBooks(query);
    const mapped: Book[] = results.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo?.title || "Sin título",
      author: item.volumeInfo?.authors || ["Desconocido"],
      cover: item.volumeInfo?.imageLinks?.thumbnail || "",
    }));
    setBooks(mapped);
  };

  const handleAddFavorite = async (book: Book) => {
    setMessage("");
    setError("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Debes iniciar sesión primero");
      history.push("/login");
      return;
    }

    try {
      await addFavorite(userId, book);
      refreshFavorites();
      setMessage(`Libro "${book.title}" agregado a favoritos`);
    } catch (e: any) {
      setError("No se pudo agregar a favoritos: " + e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    history.push("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recomendador de Libros</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {message && <IonText color="success">{message}</IonText>}
        {error && <IonText color="danger">{error}</IonText>}

        <IonSearchbar
          value={query}
          onIonInput={(e) => setQuery(e.detail.value!)}
          debounce={500}
        />
        <IonButton expand="block" onClick={handleSearch}>
          Buscar
        </IonButton>

        <IonList>
          {books.map((book) => (
            <IonItem key={book.id}>
              {book.cover && (
                <img
                  src={book.cover}
                  alt={book.title}
                  style={{ width: "50px", height: "75px", marginRight: "10px" }}
                />
              )}
              <IonLabel>
                <h2>{book.title}</h2>
                <p>{book.author.join(", ")}</p>
              </IonLabel>
              <IonButton
                fill="outline"
                size="small"
                onClick={() => handleAddFavorite(book)}
              >
                Favorito
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
