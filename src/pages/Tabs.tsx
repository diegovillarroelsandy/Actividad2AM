import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { home, star, chatbubbles } from "ionicons/icons";
import { Route, Redirect } from "react-router-dom";

import Home from "./Home";
import Favorites from "./Favorites";
import Recommendations from "./Recommendations";

interface TabsProps {
  userId?: string;
}

const Tabs: React.FC<TabsProps> = ({ userId }) => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route
          path="/tabs/home"
          render={() => <Home userId={userId} />}
          exact
        />
        <Route
          path="/tabs/favorites"
          render={() => <Favorites userId={userId} />}
          exact
        />
        <Route
          path="/tabs/recommendations"
          render={() => <Recommendations userId={userId} />}
          exact
        />
        <Redirect exact from="/tabs" to="/tabs/home" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorites" href="/tabs/favorites">
          <IonIcon icon={star} />
          <IonLabel>Favoritos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="recommendations" href="/tabs/recommendations">
          <IonIcon icon={chatbubbles} />
          <IonLabel>Recomendaciones</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
