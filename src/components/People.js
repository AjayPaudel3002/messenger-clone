import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const People = ({ friend, userId, socket, activeUsers }) => {
  const [isActive, setIsActive] = useState(false);
  const history = useHistory();
  const [msgCount, setMsgCount] = useState(false);

  useEffect(() => {
    const isUser =
      activeUsers &&
      activeUsers.length &&
      activeUsers.find((user) => user.currentUserId === friend._id);

    if (isUser && isUser.lastActive === "current") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }

    socket.on("recentMessage", (msg) => {
      // console.log(msg.userId, friend._id);
      if (msg && msg.userId === friend._id) {
        setMsgCount(true);
      }
    });

    // return function () {
    //   socket.off("getOnlineUsers");
    // };
  }, [friend._id, activeUsers]);

  // console.log(isActive, lastActive);
  return (
    <div
      className="row d-flex align-items-center pt-3 pb-3 people-list"
      onClick={() => history.push(`/chat/${friend._id}`)}
    >
      <div className="col-2">
        <div className="avatar">
          <img
            src={
              friend.profilePicture
                ? friend.profilePicture
                : "https://res.cloudinary.com/dueq2a3w1/image/upload/v1608046828/default-image1_w8javi.jpg"
            }
            alt=""
            className="rounded-circle"
            width="40"
          />
        </div>
        {isActive && <span className="online"></span>}
      </div>
      <div className="col-8">{`${friend.firstName} ${friend.lastName}`}</div>
      {msgCount && (
        <div className="col-2">
          <p className="msg-count"></p>
        </div>
      )}
    </div>
  );
};

export default People;
