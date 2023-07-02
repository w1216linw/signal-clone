import { SimpleLineIcons } from "@expo/vector-icons";
import { Avatar, Button } from "@rneui/base";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import CustomListItem from "../components/ListItem";
import { db } from "../firebase";

const HomeScreen = ({ navigation }) => {
  const auth = getAuth();
  const [chats, setChats] = useState([]);

  const logout = () => {
    auth.signOut().then(() => navigation.replace("Login"));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      title: "Signal",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerLeft: () => (
        <View>
          <SimpleLineIcons
            name="logout"
            size={24}
            color="black"
            onPress={logout}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => console.log(auth?.currentUser?.displayName)}
        >
          <Avatar source={{ uri: auth?.currentUser?.photoURL }} rounded />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });
      setChats(newData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ height: "100%" }}>
        {chats.length > 0 &&
          chats.map(({ id, data: { chatName } }) => (
            <CustomListItem id={id} chatName={chatName} key={id} />
          ))}
      </ScrollView>
      <Button
        title="New Chat"
        containerStyle={{
          position: "absolute",
          alignSelf: "center",
          bottom: 20,
          width: 200,
        }}
        onPress={() => {
          navigation.navigate("NewChat");
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
