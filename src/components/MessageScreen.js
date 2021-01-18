import React, { useState, useEffect } from "react";
import "./Styles.css";
import SendIcon from "@material-ui/icons/Send";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import headers from "./auth/headers";
import { useHistory } from "react-router-dom";
import SenderChat from "./SenderChat";
import ReceiverChat from "./ReceiverChat";
import moment from "moment";
import PhoneIcon from "@material-ui/icons/Phone";
import VideocamIcon from "@material-ui/icons/Videocam";
import InfoIcon from "@material-ui/icons/Info";

const MessageScreen = ({ receiver, socket, user, activeUsers, domain }) => {
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [messageStatus, setMessageStatus] = useState("sent");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await fetch(
          `${domain}/api/private-message/${receiver[0]._id}`,
          {
            mode: "cors",
            headers: headers(),
          }
        );
        const res = await response.json();
        // console.log(res);
        setChat(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (receiver[0]) {
      getMessage();
      const isUser =
        activeUsers &&
        activeUsers.find((user) => user.currentUserId === receiver[0]._id);

      if (isUser) {
        setActiveStatus(isUser.lastActive);
      } else {
        setActiveStatus(null);
      }
    }

    socket.on("newMessage", (msg) => {
      setChat((chat) => {
        const isAvailable = chat.find((message) => {
          return message._id === msg._id;
        });

        if (
          !isAvailable &&
          receiver &&
          receiver[0] &&
          msg.from._id === receiver[0]._id
        ) {
          return [...chat, msg];
        } else {
          return [...chat];
        }
      });
    });

    socket.on("typing", (data) => {
      // console.log(data , user , receiver)
      if (
        receiver[0] &&
        data.user === receiver[0]._id &&
        data.receiver === user._id
      ) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
        }, 5000);
      } else {
        setTyping(false);
      }
    });
  }, [receiver, activeUsers]);

  const sendMessage = async (e) => {
    e.preventDefault();
    // console.log(message);
    if (message) {
      const msgData = {
        from: user._id,
        to: receiver[0]._id,
        message,
        messageStatus,
      };
      // console.log(msgData);
      try {
        const response = await fetch(
          `${domain}/api/add-message/${receiver[0]._id}`,
          {
            mode: "cors",
            headers: headers(),
            method: "post",
            body: JSON.stringify(msgData),
          }
        );
        const res = await response.json();
        // console.log(res);
        setChat((chat) => [...chat, res.data]);
        const messageDetials = {
          message: res.data,
          location: history.location.pathname,
        };
        socket.emit("createMessage", res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please Enter some message");
    }
    setMessage("");
  };

  const getActiveUser = () => {
    // console.log(activeStatus);
    if (activeStatus === "current") {
      return <small style={{ color: "#65676b" }}>Active Now</small>;
    }
    if (activeStatus === null) {
      return;
    }
    if (activeStatus !== "current") {
      return moment.utc(new Date(activeStatus)).fromNow();
    }
  };

  const getTyping = () => {
    const data = {
      user: user._id,
      receiver: receiver[0]._id,
    };
    socket.emit("typing", data);
    console.log(data, receiver, user);
  };

  return (
    <>
      <div className="container-fluid">
        <div class="row message-screen">
          <div class="col-md-12 mx-auto message">
            <div class="card">
              <div class="card-header">
                <div className="row d-flex align-items-center p-2 message-screen-header">
                  <div className="col-1  d-block d-md-none ">
                    <ArrowBackIcon onClick={() => history.push(`/messages`)} />
                  </div>
                  <div className="col-2 col-md-1">
                    <img
                      src={
                        receiver && receiver[0] && receiver[0].profilePicture
                          ? receiver[0].profilePicture
                          : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
                      }
                      alt=""
                      className="rounded-circle"
                      width="40"
                    />
                    {activeStatus && activeStatus === "current" && (
                      <span className="online"></span>
                    )}
                  </div>
                  {receiver && receiver[0] && (
                    <div className="col-5 col-md-7">
                      <p
                        className=""
                        style={{ fontWeight: "bold", lineHeight: "24px" }}
                      >{`${receiver[0].firstName} ${receiver[0].lastName}`}</p>
                      {getActiveUser()}
                    </div>
                  )}
                  <div className="col-4 col-md-4 message-screen-header-icons ">
                    <PhoneIcon />
                    <VideocamIcon />
                    <InfoIcon />
                  </div>
                </div>
              </div>
              <div className="card-body chat-care">
                <ul className="chat">
                  {chat &&
                    chat.map((msg) => {
                      return msg.from._id === user._id ? (
                        <SenderChat
                          msg={msg}
                          user={user}
                          key={msg._id}
                          socket={socket}
                          activeStatus={activeStatus}
                          domain={domain}
                        />
                      ) : (
                        <ReceiverChat
                          msg={msg}
                          user={receiver[0]}
                          key={msg._id}
                          socket={socket}
                          activeStatus={activeStatus}
                          domain={domain}
                        />
                      );
                    })}
                </ul>
              </div>
              {typing && <div className="right-align">typing...</div>}
              <div className="row d-flex align-items-center p-4">
                <div className="col-2 col-sm-1 ">
                  <img
                    src={
                      user && user.profilePicture
                        ? user.profilePicture
                        : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
                    }
                    alt=""
                    className="rounded-circle"
                    width="40"
                  />
                </div>
                <div className="col-9  col-sm-10">
                  <form onSubmit={sendMessage}>
                    <input
                      type="text"
                      className="form-control feed-input"
                      placeholder="send message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        getTyping();
                      }}
                    />
                  </form>
                </div>
                <div className="col-1">
                  <SendIcon onClick={sendMessage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageScreen;
