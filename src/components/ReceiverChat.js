import moment from "moment";
import React, { useState, useEffect } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import headers from "./auth/headers";

const ReceiverChat = ({ msg, socket,domain }) => {
  const [deletedMsg, setDeletedMsg] = useState(false);
  const [deletedForEveryoneMsg, setDeletedForEveryoneMsg] = useState(false);
  const [like, setLike] = useState(false);
  console.log(msg);
  useEffect(() => {
    if (msg.deleteForMe === msg.from._id) {
      setDeletedMsg(true);
    }
    if (msg.deleteForEveryone) {
      setDeletedForEveryoneMsg(true);
    }

    if (msg.reactors) {
      setLike(true);
    }

    socket.on("deleteMessage", (data) => {
      // console.log(data);
      if (msg._id === data.messageId) {
        setDeletedForEveryoneMsg(true);
      }
    });

    socket.on("likeMessage", (data) => {
      // console.log(data, "like");
      if (msg._id === data.messageId) {
        setLike(data.like);
      }
    });
  }, []);

  const likeMessage = async () => {
    const likeData = {
      type: "like",
    };
    const data = {
      like: !like,
      from: msg.to._id,
      to: msg.from._id,
      messageId: msg._id,
    };
    if (!like) {
      try {
        const response = await fetch(
          `${domain}/api/add/message-reactions/${msg._id}`,
          {
            method: "post",
            mode: "cors",
            headers: headers(),
            body: JSON.stringify(likeData),
          }
        );
        const res = await response.json();
        if (res) {
          setLike(true);
          socket.emit("likeMessage", data);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(
          `${domain}/api/delete/message-reactions/${msg._id}`,
          {
            method: "delete",
            mode: "cors",
            headers: headers(),
          }
        );
        const res = await response.json();
        if (res) {
          setLike(false);
          socket.emit("likeMessage", data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {!deletedForEveryoneMsg && (
        <li className="agent clearfix">
          <span className="chat-img left clearfix mx-2">
            <img
              src={
                msg.from.profilePicture
                  ? msg.from.profilePicture
                  : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
              }
              alt=""
              className="rounded-circle"
              width="40"
            />
          </span>
          <div
            className="chat-body clearfix agent-chat"
            onDoubleClick={likeMessage}
          >
            <p>{msg.message}</p>
            {like && (
              <div className="like-icon">
                <FavoriteIcon />
              </div>
            )}
          </div>
          <div>
            <small className="left text-muted">
              <span className="glyphicon glyphicon-time"></span>
              {moment.utc(new Date(msg.createdAt)).fromNow()}
            </small>
          </div>
        </li>
      )}
      {deletedForEveryoneMsg && (
        <li className="deletedMsg clearfix">
          <div className="chat-body delete-agent">
            <p>This message is deleted</p>
          </div>
        </li>
      )}
    </>
  );
};

export default ReceiverChat;
