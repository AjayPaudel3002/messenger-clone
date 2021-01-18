import React, { useState, useEffect } from "react";
import moment from "moment";
import headers from "./auth/headers";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FavoriteIcon from "@material-ui/icons/Favorite";

const SenderChat = ({ msg, socket, activeStatus, domain }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState(false);
  const [deletedForEveryoneMsg, setDeletedForEveryoneMsg] = useState(false);
  const [msgStatus, setMsgStatus] = useState("sent");
  const [like, setLike] = useState(false);

  // console.log(msg);

  useEffect(() => {
    setMsgStatus(msg.messageStatus);

    const changeMessageStatus = async (messageStatus) => {
      const data = { messageId: msg._id, messageStatus: messageStatus };
      try {
        const response = await fetch(`${domain}/api/message-status/edit`, {
          mode: "cors",
          headers: headers(),
          method: "put",
          body: JSON.stringify(data),
        });
        const res = await response.json();
        if (res.message) {
          setMsgStatus(messageStatus);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (
      activeStatus &&
      activeStatus === "current" &&
      msg.messageStatus === "sent"
    ) {
      // setMsgStatus("delivered");
      changeMessageStatus("delivered");
    }
    if (msg.deleteForMe === msg.from._id) {
      setDeletedMsg(true);
    }

    if (msg.reactors) {
      setLike(true);
    }

    if (msg.deleteForEveryone) {
      setDeletedForEveryoneMsg(true);
    }
    socket.on("deleteMessage", (data) => {
      // console.log(data);
      if (msg._id === data.messageId) {
        setDeletedForEveryoneMsg(true);
      }
    });

    socket.on("likeMessage", (data) => {
      // console.log(data);
      if (msg._id === data.messageId) {
        setLike(data.like);
      }
    });
  }, []);

  const deleteMsg = async (value) => {
    let data = {};
    let url = "";
    // console.log(value);
    if (value === "Delete") {
      data.deleteForMe = msg.from._id;
      data.messageId = msg._id;
      url = `${domain}/api/message/delete`;
    } else {
      data.messageId = msg._id;
      url = `${domain}/api/message/deleteForAll`;
    }

    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: headers(),
        method: "post",
        body: JSON.stringify(data),
      });
      const res = await response.json();
      // console.log(res);
      if (res.message && value === "Delete") {
        // console.log("inside");
        setDeletedMsg(!deletedMsg);
        setOpenDropdown(!openDropdown);
      }
      if (res.message && value === "Delete for all") {
        setDeletedForEveryoneMsg(true);
        setOpenDropdown(!openDropdown);
        const details = {
          messageId: msg._id,
          toUser: msg.to._id,
        };
        socket.emit("deleteMessage", details);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!deletedMsg && !deletedForEveryoneMsg && (
        <li className="admin clearfix" style={{ position: "relative" }}>
          <div
            className="chat-body clearfix admin-chat"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <p>{msg.message}</p>
            {like && (
              <div className="like-icon">
                <FavoriteIcon />{" "}
              </div>
            )}
          </div>
          <span className="chat-img  clearfix  mx-2">
            {msgStatus === "received" && (
              <img
                src={
                  msg.from.profilePicture
                    ? msg.from.profilePicture
                    : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
                }
                alt=""
                className="rounded-circle"
                width="20"
              />
            )}
            {msgStatus === "delivered" && <CheckCircleIcon />}
            {msgStatus === "sent" && <CheckCircleOutlineIcon />}
          </span>

          <div>
            <small
              className="right text-muted"
              style={{ paddingRight: "40px" }}
            >
              <span className="glyphicon glyphicon-time"></span>{" "}
              {moment.utc(new Date(msg.createdAt)).fromNow()}
            </small>
          </div>
          {openDropdown && (
            <div className="msg-dropdown right clearfix">
              <ul>
                <li onClick={() => deleteMsg("Delete")}>Delete</li>
                <li onClick={() => deleteMsg("Delete for all")}>
                  Delete for all
                </li>
              </ul>
            </div>
          )}
        </li>
      )}
      {deletedForEveryoneMsg && (
        <li className="deletedMsg clearfix dl-admin ">
          <div className="chat-body delete-admin">
            <p>This message is deleted</p>
          </div>
        </li>
      )}
    </>
  );
};

export default SenderChat;
