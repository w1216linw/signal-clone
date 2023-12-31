import { Button, Image, Input } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth } from "../firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar style="dark" />
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          containerStyle={{ width: 200, height: 200, marginBottom: 20 }}
        />
        <View style={styles.inputContainer}>
          <Input
            antoFocus
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={login}
          />
        </View>
        <Button
          title={"Login"}
          containerStyle={styles.button}
          onPress={login}
        />
        <Button
          title={"Register"}
          containerStyle={styles.button}
          type="outline"
          onPress={() => navigation.navigate("Register")}
        />
        <View style={{ height: 100 }} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});

export default Login;
