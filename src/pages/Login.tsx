/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useIonRouter();

  const handleLogin = async () => {
    setMessage("");
    setError("");

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      localStorage.setItem("userId", userDoc.id); // guardar sesión
      setMessage("¡Login exitoso!");

      setTimeout(() => router.push("/tabs/home", "forward", "push"), 1000);
    } catch (e: any) {
      setError("Error al iniciar sesión: " + e.message);
    }
  };

  const goToRegister = () => {
    router.push("/register", "forward", "push");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        {error && (
          <IonText color="danger" style={{ display: "block", marginTop: 10 }}>
            {error}
          </IonText>
        )}
        {message && (
          <IonText color="success" style={{ display: "block", marginTop: 10 }}>
            {message}
          </IonText>
        )}

        <IonButton
          expand="block"
          style={{ marginTop: 20 }}
          onClick={handleLogin}
        >
          Iniciar Sesión
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          style={{ marginTop: 10 }}
          onClick={goToRegister}
        >
          Crear cuenta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
