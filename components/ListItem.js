import { Avatar, ListItem } from "@rneui/base";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const CustomListItem = ({ id, name, enterChat }) => {
  const [chatMessage, setChatMessage] = useState([]);

  const messageRef = collection(db, "chats", id, "messages");
  const queryRef = query(messageRef, orderBy("timestamp", "desc"));

  useEffect(() => {
    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      setChatMessage(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <ListItem bottomDivider key={id} onPress={() => enterChat(id, name)}>
      <Avatar rounded source={{ uri: "https://i.pravatar.cc/300" }} />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessage[0]?.data.displayName}: {chatMessage[0]?.data.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;
