import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonImg,
} from "@ionic/react";
import { GoogleBook } from "../types/googlebook";

interface Params {
  id: string;
}

const BookDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const [book, setBook] = useState<GoogleBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!res.ok) throw new Error("No se pudo obtener el libro");
        const data: GoogleBook = await res.json();
        setBook(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading)
    return (
      <IonPage>
        <IonContent className="ion-padding" style={{ textAlign: "center" }}>
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );

  if (error)
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p style={{ color: "red" }}>{error}</p>
          <IonButton onClick={() => history.goBack()}>Volver</IonButton>
        </IonContent>
      </IonPage>
    );

  if (!book) return null;

  const info = book.volumeInfo;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {info.imageLinks?.thumbnail && (
          <IonImg
            src={info.imageLinks.thumbnail}
            style={{
              width: "150px",
              marginBottom: "12px",
              borderRadius: "4px",
            }}
          />
        )}

        <p>
          <strong>Autores:</strong> {info.authors?.join(", ") || "Desconocido"}
        </p>
        <p>
          <strong>Publicado por:</strong> {info.publisher || "Desconocido"}
        </p>
        <p>
          <strong>Fecha de publicación:</strong> {info.publishedDate || "N/A"}
        </p>
        <p>
          <strong>Páginas:</strong> {info.pageCount || "No disponible"}
        </p>
        <p>
          <strong>Categorías:</strong>{" "}
          {info.categories?.join(", ") || "No clasificadas"}
        </p>
        <p>
          <strong>Idioma:</strong> {info.language?.toUpperCase() || "N/A"}
        </p>

        <p style={{ marginTop: "12px" }}>
          <strong>Descripción:</strong> {info.description || "No disponible"}
        </p>

        {info.previewLink && (
          <IonButton
            expand="block"
            color="secondary"
            onClick={() => window.open(info.previewLink, "_blank")}
          >
            Ver en Google Books
          </IonButton>
        )}

        <IonButton expand="block" onClick={() => history.goBack()}>
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default BookDetails;
