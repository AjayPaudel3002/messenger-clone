import React, { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import MessageScreen from "./MessageScreen";
import headers from "./auth/headers";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

const PrivateChat = ({ socket, authenticated, setAuthenticated, domain }) => {
  const [userDetails, setUserDetails] = useState({});
  // console.log(history);
  const params = useParams();
  // console.log(params);
  const [receiver, setReceiver] = useState([]);

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
        getReceiverInfo(res.data);
        socket.emit("connection", res.data._id);
        socket.emit("getOnlineUsers", res.data._id);
        socket.on("getOnlineUsers", (data) => {
          // console.log(data);
          setOnlineUsers([...data]);
        });
        socket.on("connection", (data) => {
          console.log(data);
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
    const getReceiverInfo = (user) => {
      const toUser = user.friends.filter(
        (friend) => friend._id === params.receiverId
      );
      setReceiver(toUser);
    };
  }, [params.receiverId]);

  // console.log(params,history, "params");

  return (
    <>
      <div className="container-fluid">
        <div className="row ">
          <div
            className="col-md-3 d-none d-lg-block "
            style={{ height: "750px", padding: "0 0 0 10px" }}
          >
            <div className="Nav pb-3 ">
              <Nav
                user={userDetails}
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
              />
            </div>
            <div className="chat-history">
              <ChatHistory
                className=""
                friends={userDetails.friends}
                socket={socket}
                userId={userDetails._id}
                activeUsers={onlineUsers}
              />
            </div>
          </div>
          <div
            className="col-12 col-md-9 col-lg-6"
            style={{ height: "750px", padding: "0" }}
          >
            <MessageScreen
              receiver={receiver}
              socket={socket}
              user={userDetails}
              activeUsers={onlineUsers}
              domain={domain}
            />
          </div>
          <div className="col-md-3 d-none d-lg-block">
            <div className="row justify-content-md-center pt-3">
              <img
                src={
                  userDetails.profilePicture
                    ? userDetails.profilePicture
                    : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
                }
                alt=""
                className="rounded-circle"
                width="80"
              />
            </div>
            <div className="row justify-content-md-center pt-3 pb-3 ">
              <h5
                style={{ fontWeight: "bold" }}
              >{`${userDetails.firstName} ${userDetails.lastName}`}</h5>
            </div>
            <div className="row pt-3 pl-3  profile-details">
              <p>Customize chat</p>
            </div>
            <div className="row pt-3 pl-3  profile-details">
              <p>Privacy & Support</p>
            </div>
            <div className="row pt-3 pl-3 profile-details">
              <p>Shared Photos</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivateChat;
