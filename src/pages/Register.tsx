import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonText,
} from "@ionic/react";
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useHistory } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Mensaje de éxito o error
  const [error, setError] = useState("");
  const history = useHistory();

  const handleRegister = async () => {
    setMessage(""); // Limpiar mensaje previo
    setError(""); // Limpiar error previo

    try {
      // Verificar si el email ya existe
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("El usuario ya existe");
        return;
      }

      // Crear usuario en Firestore
      await addDoc(collection(db, "users"), {
        email,
        password, // ⚠️ para producción conviene hashear
      });

      setMessage("Usuario creado con éxito! Redirigiendo al login...");

      // Opcional: redirigir después de 2 segundos
      setTimeout(() => history.push("/login"), 2000);
    } catch (e: any) {
      setError("No se pudo registrar el usuario: " + e.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
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

        {/* Mensajes de éxito y error */}
        {message && <IonText color="success">{message}</IonText>}
        {error && <IonText color="danger">{error}</IonText>}

        <IonButton
          expand="block"
          onClick={handleRegister}
          style={{ marginTop: "20px" }}
        >
          Crear Cuenta
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          onClick={() => history.push("/login")}
          style={{ marginTop: "10px" }}
        >
          Volver al Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
