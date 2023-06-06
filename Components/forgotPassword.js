import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  Alert,
  Button,
  View,
  UIManager,
  Pressable,
} from "react-native";

import { useState, useEffect } from "react";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ForgotPassword({ setForgotPassword }) {
  const [email, setEmail] = useState("");

  const handleReset = async () => {

    if(email == "") {
        Alert.alert(
            "Error",
            "Please enter an email address.",
            [
                {
                    text: "OK",
                },
            ],
            { cancelable: false }
        );
        return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Password Reset Email Sent",
          "Please check your email for a link to reset your password.",
          [
            {
              text: "OK",
              onPress: () => setForgotPassword(false),
            },
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ff595e",
          width: "100%",
        }}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View
              style={{
                width: "100%",
                padding: 20,
                shadowColor: "black",
                shadowOpacity: 0.2,
                shadowRadius: 5,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                flex: 0,
              }}
              scrollEnabled={false}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 20,
                  flex: 0,
                  gap: 5,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Forgot Password
                </Text>
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Email
                </Text>
                <TextInput
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    borderRadius: 10,
                    width: "100%",
                    height: 50,
                    backgroundColor: "#f1f1f1",
                  }}
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                  value={email}
                />
                {/* <Button title="Cancel" onPress={setForgotPassword(false)} /> */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                }}>
                  <Pressable
                    style={{
                      flex: 0,
                      justifyContent: "center",
                    }}
                    onPress={() => setForgotPassword(false)}
                  >
                    <Text
                      style={{
                        color: "#ff595e",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                      
                    >
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 0,
                      justifyContent: "center",
                    }}
                    onPress={handleReset}

                  >
                    <Text
                      style={{
                        color: "#ff595e",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      Reset
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
