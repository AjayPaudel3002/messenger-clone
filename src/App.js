import React, { useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Messenger from "./components/Messenger";
import Login from "./components/Login";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PrivateChat from "./components/PrivateChat";
import io from "socket.io-client";

function App() {
  const user = JSON.parse(localStorage.getItem("user")) || "";
  console.log(user);
  const [authenticated, setAuthenticated] = useState(user || "");
  const socket = io.connect("http://localhost:5000", {
    transports: ["websocket"],
  });
  const domain = process.env.REACT_APP_API_DOMAIN || "";

  return (
    <Router>
      <Switch>
        <PublicRoute
          path="/"
          exact
          render={(props) => (
            <Login {...props} authenticated={authenticated} domain={domain} />
          )}
        />
        <PrivateRoute
          path={`/messages`}
          exact
          render={(props) => (
            <Messenger
              {...props}
              socket={socket}
              authenticated={authenticated}
              setAuthenticated={setAuthenticated}
              domain={domain}
            />
          )}
        />
        <PrivateRoute
          path={`/chat/:receiverId`}
          exact
          render={(props) => (
            <PrivateChat
              {...props}
              authenticated={authenticated}
              socket={socket}
              setAuthenticated={setAuthenticated}
              domain={domain}
            />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
