import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

function PublicRoute({ render: Component, ...props }) {
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    const userValue = localStorage.getItem("user");
    setUser(JSON.parse(userValue));
    if (userValue) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);
  if (authenticated === null) {
    return <></>;
  }

  return (
    <Route
      {...props}
      render={(props) =>
        authenticated ? <Redirect to={`/messages`} /> : <Component {...props} />
      }
    ></Route>
  );
}

export default PublicRoute;
