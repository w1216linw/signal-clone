import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Avatar } from "@rneui/base";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth, db } from "../firebase";

const Chat = ({ navigation, route }) => {
  const [input, setInput] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageRef = collection(db, "chats", route.params.id, "messages");
  const queryRef = query(messageRef, orderBy("timestamp", "asc"));

  const sendMessage = async () => {
    // send message to firebase
    Keyboard.dismiss();

    //save input to firebase store
    try {
      await addDoc(messageRef, {
        message: input,
        timestamp: serverTimestamp(),
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      });
    } catch (error) {
      console.log(error);
    }

    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",

      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        >
          <Avatar
            rounded
            source={{
              uri: "https://picsum.photos/200/300",
            }}
          />
          <Text style={{ color: "black" }}>{route.params.name}</Text>
        </View>
      ),
      headerBackVisible: false,
      headerLeft: () => (
        <TouchableOpacity>
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            onPress={navigation.goBack}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{ flexDirection: "row", columnGap: 30, alignItems: "center" }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={style.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={style.messageContainer}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View
                    key={id}
                    style={[style.messageWrapper, { alignSelf: "flex-end" }]}
                  >
                    <View style={style.message}>
                      <Text>{data.message}</Text>
                    </View>
                    <Avatar
                      rounded
                      source={{ uri: auth.currentUser.photoURL }}
                    />
                  </View>
                ) : (
                  <View key={id} style={style.messageWrapper}>
                    <Avatar rounded source={{ uri: data.photoURL }} />
                    <View style={{ maxWidth: "70%" }}>
                      <Text style={{ fontSize: 10 }}>{data.displayName}</Text>
                      <View style={style.message}>
                        <Text>{data.message}</Text>
                      </View>
                    </View>
                  </View>
                )
              )}
            </ScrollView>
            <View style={style.inputContainer}>
              <TextInput
                value={input}
                onSubmitEditing={sendMessage}
                onChangeText={setInput}
                style={style.input}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 20,
    bottom: 0,
  },
  input: {
    minHeight: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ececec",
    borderRadius: 50,
    padding: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 10,
    marginBottom: 10,
  },
  message: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#ececec",
  },
  messageContainer: {
    padding: 15,
  },
});

export default Chat;
