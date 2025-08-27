import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Book } from "../types/book";

const stopwords = [
  "el",
  "la",
  "los",
  "las",
  "de",
  "del",
  "un",
  "una",
  "y",
  "a",
  "en",
  "por",
  "para",
  "con",
  "al",
];

function normalizeTitle(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywordsFromBook(book: Book): string[] {
  const keys: string[] = [];

  if (book.title) {
    const words = book.title
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 2 && !stopwords.includes(w));
    keys.push(...words.slice(0, 3));
  }

  if (book.author && book.author.length > 0) {
    const authorParts = book.author[0].split(/\s+/).slice(0, 2);
    keys.push(authorParts.join(" "));
  }

  return keys;
}

const Recommendations: React.FC = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Estado para filtros
  const [filterType, setFilterType] = useState<"genre" | "author" | "date">(
    "genre"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No hay usuario logueado");
          setLoading(false);
          return;
        }

        const snapshot = await getDocs(
          collection(db, "users", userId, "favorites")
        );
        const favorites = snapshot.docs.map((d) => d.data() as Book);

        if (favorites.length === 0) {
          setRecommendedBooks([]);
          setLoading(false);
          return;
        }

        const favoriteIds = new Set<string>(
          favorites.map((f) => f.id).filter((x): x is string => !!x)
        );
        const favoriteTitleSet = new Set<string>(
          favorites.map((f) => normalizeTitle(f.title))
        );

        const allKeywords = new Set<string>();
        favorites.forEach((f) => {
          extractKeywordsFromBook(f).forEach((k) => allKeywords.add(k));
        });
        const keywordsList = Array.from(allKeywords).slice(0, 5);

        const byId = new Map<string, Book>();
        for (const kw of keywordsList) {
          if (!kw) continue;
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
              kw
            )}&maxResults=10`
          );
          const data = await res.json();
          if (!data?.items) continue;

          for (const item of data.items) {
            const id: string = item.id;
            const title: string = item.volumeInfo?.title ?? "Sin título";
            const authors: string[] = item.volumeInfo?.authors ?? [
              "Desconocido",
            ];
            const cover: string = item.volumeInfo?.imageLinks?.thumbnail ?? "";
            const categories: string[] = item.volumeInfo?.categories ?? [];
            const publishedDate: string =
              item.volumeInfo?.publishedDate ?? "0000";

            const normTitle = normalizeTitle(title);
            if (favoriteIds.has(id) || favoriteTitleSet.has(normTitle))
              continue;

            if (!byId.has(id)) {
              byId.set(id, {
                id,
                title,
                author: authors,
                cover,
                categories,
                publishedDate,
              });
            }
          }
        }

        setRecommendedBooks(Array.from(byId.values()));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // 🔹 Agrupación dinámica según filtro
  let content: JSX.Element | null = null;

  if (filterType === "genre") {
    const groupedByGenre: Record<string, Book[]> = {};
    recommendedBooks.forEach((book) => {
      if (book.categories && book.categories.length > 0) {
        const genre = book.categories[0];
        if (!groupedByGenre[genre]) groupedByGenre[genre] = [];
        groupedByGenre[genre].push(book);
      }
    });

    content = (
      <IonList>
        {Object.entries(groupedByGenre).map(([genre, books]) => (
          <div key={genre}>
            <IonItem color="light">
              <IonLabel>
                <strong>{genre}</strong>
              </IonLabel>
            </IonItem>
            {books.map((book) => (
              <IonItem key={book.id}>
                {book.cover && (
                  <IonThumbnail slot="start">
                    <img src={book.cover} alt={book.title} />
                  </IonThumbnail>
                )}
                <IonLabel>
                  <h2>{book.title}</h2>
                  <p>{book.author.join(", ")}</p>
                </IonLabel>
              </IonItem>
            ))}
          </div>
        ))}
      </IonList>
    );
  } else if (filterType === "author") {
    const groupedByAuthor: Record<string, Book[]> = {};
    recommendedBooks.forEach((book) => {
      const author = book.author[0] || "Desconocido";
      if (!groupedByAuthor[author]) groupedByAuthor[author] = [];
      groupedByAuthor[author].push(book);
    });

    content = (
      <IonList>
        {Object.entries(groupedByAuthor).map(([author, books]) => (
          <div key={author}>
            <IonItem color="light">
              <IonLabel>
                <strong>{author}</strong>
              </IonLabel>
            </IonItem>
            {books.map((book) => (
              <IonItem key={book.id}>
                {book.cover && (
                  <IonThumbnail slot="start">
                    <img src={book.cover} alt={book.title} />
                  </IonThumbnail>
                )}
                <IonLabel>
                  <h2>{book.title}</h2>
                  <p>{book.categories?.join(", ") || "Sin género"}</p>
                </IonLabel>
              </IonItem>
            ))}
          </div>
        ))}
      </IonList>
    );
  } else if (filterType === "date") {
    const sortedBooks = [...recommendedBooks].sort((a, b) => {
      const dateA = parseInt(a.publishedDate?.substring(0, 4) || "0");
      const dateB = parseInt(b.publishedDate?.substring(0, 4) || "0");
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    content = (
      <IonList>
        {sortedBooks.map((book) => (
          <IonItem key={book.id}>
            {book.cover && (
              <IonThumbnail slot="start">
                <img src={book.cover} alt={book.title} />
              </IonThumbnail>
            )}
            <IonLabel>
              <h2>{book.title}</h2>
              <p>{book.publishedDate || "Sin fecha"}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recomendaciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        ) : recommendedBooks.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No se encontraron recomendaciones.
          </p>
        ) : (
          <>
            {/* 🔹 Selector de filtro */}
            <IonSegment
              value={filterType}
              onIonChange={(e) =>
                setFilterType(e.detail.value as "genre" | "author" | "date")
              }
            >
              <IonSegmentButton value="genre">
                <IonLabel>Género</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="author">
                <IonLabel>Autor</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="date">
                <IonLabel>Fecha</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* 🔹 Botón de orden asc/desc solo si está en fecha */}
            {filterType === "date" && (
              <IonSegment
                value={sortOrder}
                onIonChange={(e) =>
                  setSortOrder(e.detail.value as "asc" | "desc")
                }
              >
                <IonSegmentButton value="asc">
                  <IonLabel>Ascendente</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="desc">
                  <IonLabel>Descendente</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            )}

            {content}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Recommendations;
