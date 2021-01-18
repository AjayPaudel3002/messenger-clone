import React from "react";
import People from "./People";

const ChatHistory = ({ friends, socket, userId ,activeUsers }) => {
  
  return (
    <>
      <div className="container-fluid">
        {friends && friends.length
          ? friends.map((friend) => {
              return (
                <People
                  friend={friend}
                  key={friend._id}
                  userId={userId}
                  socket={socket}
                  activeUsers={activeUsers}
                />
              );
            })
          : ""}
      </div>
    </>
  );
};

export default ChatHistory;
