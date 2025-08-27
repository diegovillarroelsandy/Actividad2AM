import {
  IonApp,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookDetails from "./pages/BookDetails";
import { FavoritesProvider } from "./context/FavoriteContext";
const App: React.FC = () => (
  <FavoritesProvider>
    <IonApp>
      <IonReactRouter>
        <Switch>
          {/* Rutas públicas */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />

          {/* Rutas protegidas con tabs */}
          <Route path="/tabs">
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tabs/home" component={Home} />
                <Route exact path="/tabs/favorites" component={Favorites} />
                <Route
                  exact
                  path="/tabs/recommendations"
                  component={Recommendations}
                />
                <Route
                  exact
                  path="/tabs"
                  render={() => <Redirect to="/tabs/home" />}
                />
                <Route exact path="/tabs/book/:id" component={BookDetails} />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/tabs/home">
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="favorites" href="/tabs/favorites">
                  <IonLabel>Favoritos</IonLabel>
                </IonTabButton>
                <IonTabButton
                  tab="recommendations"
                  href="/tabs/recommendations"
                >
                  <IonLabel>Recomendaciones</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </Route>

          {/* Redirección por defecto */}
          <Route exact path="/" render={() => <Redirect to="/login" />} />
        </Switch>
      </IonReactRouter>
    </IonApp>
  </FavoritesProvider>
);

export default App;
