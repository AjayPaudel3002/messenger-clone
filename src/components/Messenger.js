import React, { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import headers from "./auth/headers";
import Nav from "./Nav";

const Messenger = ({ socket, authenticated, setAuthenticated, domain }) => {
  const [userDetails, setUserDetails] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(`${domain}/api/user-details`, {
          mode: "cors",
          headers: headers(),
        });
        const res = await response.json();
        // console.log(res);
        setUserDetails(res.data || {});
        socket.emit("connection", res.data._id);
        socket.emit("getOnlineUsers", res.data._id);
        socket.on("getOnlineUsers", (data) => {
          // console.log(data);
          setOnlineUsers([...data]);
        });
        socket.on("connection", (data) => {
          // console.log(data);
          setOnlineUsers(data);
        });

        socket.on("disconnectedUser", (data) => {
          // console.log(data, "dis");
          // console.log(res.data, "ou");
          socket.emit("getOnlineUsers", res.data._id);
          socket.on("getOnlineUsers", (userData) => {
            // console.log(userData);
            setOnlineUsers(userData);
          });
          //   console.log(activeUsers);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, [userDetails._id, socket]);

  // console.log(onlineUsers);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 border " style={{ height: "750px" }}>
            <div className="Nav pb-3">
              <Nav
                user={userDetails}
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
              />
            </div>

            <div className="row chat-history">
              <ChatHistory
                friends={userDetails.friends}
                socket={socket}
                userId={userDetails._id}
                activeUsers={onlineUsers}
                domain={domain}
              />
            </div>
          </div>
          <div
            className="col-md-8 border d d-flex justify-content-center align-items-center"
            style={{ padding: "0 10px 0 0", height: "750px" }}
          >
            <div className="text-center">
              <img
                src="https://res.cloudinary.com/dueq2a3w1/image/upload/c_scale,w_300/v1610612447/messenger_udzp4o.png"
                className="image-responsive center-block"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
