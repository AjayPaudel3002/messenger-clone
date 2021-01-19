import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Login = ({ authenticated, domain, registrationUrl }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  // const [isRegistration, setIsRegistration] = useState(false);
  const history = useHistory();
  const logIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please Enter Credentials");
    } else {
      const formData = {
        email,
        password,
      };
      try {
        const response = await fetch(`${domain}/api/login`, {
          method: "post",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const user = await response.json();

        if (user.token) {
          localStorage.setItem("user", JSON.stringify(user));
          history.push(`/messages`);
          // window.location.reload();
        } else if (user.message) {
          setErrors(true);
        }
      } catch (error) {
        console.error(error);
        alert("Please check credentials");
      }
    }
  };

  return (
    <>
      <div className="container  ">
        <div className="row text-center justify-content-center mt-3 ">
          <div className="col-md-5 mt-3 ">
            Facebook helps you connect and share with the people in your life.
          </div>
          <div className="col-md-5 mt-3 ">
            <form onSubmit={logIn}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Passwod"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Login
              </button>
              <hr className="mt-4" />
            </form>
            <div>
              <button
                className="btn btn-primary "
                onClick={() => window.open(registrationUrl, "_blank")}
              >
                Register on Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
