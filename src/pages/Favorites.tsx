import React, { useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonImg,
} from "@ionic/react";
import { FavoritesContext } from "../context/FavoriteContext";
import { useHistory } from "react-router-dom";
interface FavoritesProps {
  userId?: string;
}
const Favorites: React.FC<FavoritesProps> = ({ userId }) => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Favoritos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {favorites.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No tienes libros en favoritos
          </p>
        ) : (
          favorites.map((book) => (
            <IonCard
              key={book.id}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
              }}
            >
              {book.cover && (
                <IonImg
                  src={book.cover}
                  style={{
                    width: "60px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <IonCardHeader style={{ padding: "0" }}>
                  <IonCardTitle
                    style={{ fontSize: "16px", margin: "0 0 4px 0" }}
                  >
                    {book.title}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent
                  style={{ padding: "0", fontSize: "14px", color: "#666" }}
                >
                  {book.author.join(", ")}
                </IonCardContent>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <IonButton
                    size="small"
                    color="primary"
                    onClick={() => history.push(`/tabs/book/${book.id}`)}
                  >
                    Ver detalles
                  </IonButton>
                  <IonButton
                    size="small"
                    color="danger"
                    onClick={() => {
                      if (book.id) {
                        removeFavorite(book.id); // 🔹 elimina de favoritos usando el id
                      } else {
                        console.warn("No se puede eliminar, book.id no existe");
                      }
                    }}
                  >
                    Eliminar
                  </IonButton>
                </div>
              </div>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
