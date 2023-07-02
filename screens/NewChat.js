import { Button, Input } from "@rneui/base";
import { addDoc, collection } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

const NewChat = ({ navigation }) => {
  const [input, setInput] = useState();

  const createChat = async () => {
    try {
      await addDoc(collection(db, "chats"), {
        chatName: input,
      });
      navigation.goBack();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "New Chat",
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>NewChat</Text>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={createChat}
        type="text"
      />
      <Button
        containerStyle={{ width: 200, alignSelf: "center" }}
        onPress={createChat}
        title="Create New Chat"
        type="outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default NewChat;
