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
  // console.log(user);
  const domain = process.env.REACT_APP_API_DOMAIN || "";
  const socketUrl = process.env.REACT_APP_API_DOMAIN || "http://localhost:5000";
  const registrationUrl =
    process.env.REACT_APP_REGISTRATION_URL || "http://localhost:3001/register";
  //Registration is to be done on Facebook clone App .
  const [authenticated, setAuthenticated] = useState(user || "");
  const socket = io.connect(socketUrl, {
    transports: ["websocket"],
  });
  return (
    <Router>
      <Switch>
        <PublicRoute
          path="/"
          exact
          render={(props) => (
            <Login
              {...props}
              authenticated={authenticated}
              domain={domain}
              registrationUrl={registrationUrl}
            />
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
