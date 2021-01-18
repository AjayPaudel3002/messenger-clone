import React from "react";
import { useHistory } from "react-router-dom";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "./Styles.css";

const Nav = ({ user, setAuthenticated }) => {
  const history = useHistory();
  const logOut = () => {
    localStorage.removeItem("user");
    setAuthenticated(false);
    // window.location = "/";
    history.push("/");
  };
  return (
    <>
      <div className=" nav pt-3">
        <div className="row row d-flex align-items-center">
          <div className="col-2 col-lg-1" onClick={() => history.push("/")}>
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
              }
              alt=""
              className="rounded-circle"
              width="40"
            />
          </div>
          <div className="col-4 col-lg-3 Nav-profile pl-5">Chats</div>
          <div
            className="col-5 col-lg-7 Nav-icons pl-5  "
            style={{ padding: "0px" }}
          >
            {/* <MoreHorizIcon /> */}
            <div className="dropdown">
              <button
                class="btn dropdown-toggle dropbtn"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <div className="dropdown-content ">
                <a onClick={logOut}>Logout</a>
              </div>
            </div>
            <VideoCallIcon />
            <AddCircleIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
