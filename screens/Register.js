import { Button, Input, Text } from "@rneui/base";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();
  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: name,
          photoURL: "https://picsum.photos/200",
        }).catch((error) => {
          console.log("Error updating display name:", error.message);
        });
      })
      .catch((error) => console.log("Error creating user:", error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
    });
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text h3 style={{ marginVertical: 10 }}>
        Become a Signal User
      </Text>
      <View style={styles.inputContainer}>
        <Input
          autoFocus
          placeholder="Full Name"
          type="text"
          value={name}
          onChangeText={(name) => setName(name)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <Button
        raised
        title="Register"
        onPress={register}
        containerStyle={{ width: 200, alignSelf: "center" }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    padding: 10,
    width: 350,
  },
});

export default Register;
