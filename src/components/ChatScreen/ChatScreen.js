import React, { useContext, useEffect, useState } from "react";
import direct from "./direct.svg";
import Sender from "../MsgContainers/Sender";
import Receiver from "../MsgContainers/Receiver";
import "./ChatScreen.scss";
import { UserContext } from "../../contexts/UserContext";
import { invokeFirestore } from "../../firebase";
import { useParams } from "react-router";

function ChatScreen() {
  const { user, dispatch } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();

  useEffect(() => {
    invokeFirestore
      .collection("rooms")
      .doc(roomId)
      .onSnapshot((snapshot) => {
        setRoomName(snapshot.data().name);

        invokeFirestore
          .collection("rooms")
          .doc(roomId)
          .collection("chats")
          .orderBy("timestamp", "asc")
          .onSnapshot((snapshot) => {
            setChats(snapshot.docs.map((doc) => doc.data()));
          });
      });
  }, [roomId]);

  return (
    <div className="screen">
      <div className="screen__header">
        <img
          className="screen__header-image"
          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
          alt="chat-room"
        />
        <div className="screen__header-details">
          <h3 className="screen__header-details--name">{roomName}</h3>
          <p className="screen__header-details--time">Last Seen at ...</p>
        </div>
      </div>

      <div className="screen__container">
        <Sender />
        <Receiver />
        <Sender />
        <Receiver />
        <Sender />
        <Sender />
        <Sender />
        <Receiver />
      </div>

      <div className="screen__sendbox">
        <form className="screen__sendbox-form">
          <input
            className="screen__sendbox-form--inputbox"
            placeholder="Type message"
          />
          <button className="screen__sendbox-form--btn">
            <img
              className="screen__sendbox-form--btn__img"
              src={direct}
              alt="send"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatScreen;
