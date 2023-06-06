import { Stack, Tabs, Slot, Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
  UIManager,
  LayoutAnimation,
  Platform,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import FireImage from "../assets/fire-image.png";
import { Modal } from "react-native";
// import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
// import auth from '@react-native-firebase/auth'

import "expo-dev-client";

// import {
//   InterstitialAd,
//   TestIds,
//   AdEventType,
// } from "react-native-google-mobile-ads";

// const interstitial = InterstitialAd.createForAdRequest(adUnitId);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [initialized, setInitialized] = useState(false);
  const [loadingScreenVisible, setLoadingScreenVisible] = useState(true);
  const [loadingScreenStyle, setLoadingScreenStyle] = useState({
    height: new Animated.Value(Dimensions.get("window").height), // full screen height initially
    borderRadius: new Animated.Value(0), // no border radius initially
    opacity: new Animated.Value(1), // fully opaque initially
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState("login");
  const [verificationId, setVerificationId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setInitialized(true);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  // const deleteAllCaptions = async () => {
  //   const db = getFirestore();
  //   const uid = auth.currentUser.uid;

  //   try {
  //     await setDoc(doc(db, "user-captions", uid), {
  //       captions: [],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // if(!initialized) return <LoadingScreen />;
  useEffect(() => {
    if (initialized) {
      Animated.parallel([
        Animated.timing(loadingScreenStyle.height, {
          toValue: 125, // target height of header bar
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(loadingScreenStyle.borderRadius, {
          toValue: 50, // target border radius of header bar
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(loadingScreenStyle.opacity, {
          toValue: 0, // target opacity
          delay: 700, // delay the start of the opacity animation
          duration: 300, // duration of the opacity animation
          useNativeDriver: false,
        }),
      ]).start(() => setLoadingScreenVisible(false));
    }
  }, [initialized]);

  if (!initialized)
    return (
      <View
        style={{
          backgroundColor: "#ff595e",
          flex: 1,
        }}
      ></View>
    );

  if (verifyingCode)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ff595e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: 200,
          }}
          onChangeText={(text) => setCode(text)}
          value={code}
        />
        <Button title="Confirm" onPress={confirmCode} />
      </View>
    );

  if (user)
    return (
      <>
        <Animated.View
          style={{
            backgroundColor: "#ff595e",
            justifyContent: "center",
            alignItems: "center",
            height: loadingScreenStyle.height,
            borderRadius: loadingScreenStyle.borderRadius,
            opacity: loadingScreenStyle.opacity, // apply the animated opacity
            width: "100%",
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
          }}
        ></Animated.View>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#ff595e",
            tabBarInactiveTintColor: "gray",
            headerStyle: {
              backgroundColor: "#ff595e",
              elevation: 0,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              height: 125,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitle: () => (
              <View>
                <Text>Test</Text>
              </View>
            ),
            headerRight: () => (
              <View style={{ marginRight: 40 }}>
                <Pressable
                  onPress={() => setShowSettingsModal(!showSettingsModal)}
                >
                  <IonIcons name="settings" size={24} color="white" />
                </Pressable>
              </View>
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarLabel: "Home",
              headerTitle: "Home",
              tabBarIcon: ({ focused, color }) => (
                <IonIcons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="(tabs)/saved"
            options={{
              tabBarLabel: "Saved",
              headerTitle: "Saved",
              tabBarIcon: ({ focused, color }) => (
                <IonIcons
                  name={focused ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>

        <Modal
          animationType="slide"
          visible={showSettingsModal}
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSettingsModal(false)}
        >
          <View style={{ padding: 20, flex: 1, flexDirection: "column" }}>
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Settings
              </Text>
              <Pressable onPress={() => setShowSettingsModal(false)}>
                <Text
                  style={{
                    color: "blue",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                Alert.alert(
                  "Delete all captions?",
                  "This action cannot be undone.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: () => {
                        // deleteAllCaptions();
                        setShowSettingsModal(false);
                      },
                      style: "destructive",
                    },
                  ]
                );
              }}
              style={{
                backgroundColor: "#ff595e",
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
                height: 50,
                flex: 0,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Delete all captions
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Alert.alert("Logout?", "Are you sure you want to logout?", [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Logout",
                    onPress: () => {
                      setShowSettingsModal(false);
                      // handleLogout();
                    },
                    style: "destructive",
                  },
                ]);
              }}
              style={{
                backgroundColor: "#ff595e",
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
                height: 50,
                flex: 0,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Logout
              </Text>
            </Pressable>
          </View>
        </Modal>
      </>
    );
  else
    return (
      <>
        <StatusBar barStyle="light-content" />

        <SafeAreaView
          style={{
            backgroundColor: "#ff595c",
            height: "100%",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              <Animated.View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 50,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Capsta
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    opacity: 0.8,
                    marginBottom: 20,
                  }}
                >
                  Fire captions are a click away
                </Text>
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
                    <View
                      style={{
                        flex: 0,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#F5F5F5",
                        borderRadius: 10,
                        padding: 5,
                        marginBottom: 20,
                      }}
                    >
                      {/* Login and register tabs */}
                      <Pressable
                        onPress={() => {
                          setLoginOrRegister("login");
                          Keyboard.dismiss();
                          setEmail("");
                          setPassword("");
                          setConfirmPassword("");
                        }}
                        style={{
                          backgroundColor:
                            loginOrRegister === "login" ? "#ff666b" : null,
                          padding: 10,
                          borderRadius: 10,
                          flex: 1,
                          marginLeft: 5,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              loginOrRegister === "login" ? "white" : "#808080",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          Login
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setLoginOrRegister("register");
                          Keyboard.dismiss();
                          setEmail("");
                          setPassword("");
                          setConfirmPassword("");
                        }}
                        style={{
                          backgroundColor:
                            loginOrRegister === "register" ? "#ff666b" : null,
                          padding: 10,
                          borderRadius: 10,
                          flex: 1,
                          marginLeft: 5,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              loginOrRegister === "register"
                                ? "white"
                                : "#808080",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          Register
                        </Text>
                      </Pressable>
                    </View>

                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      Email
                    </Text>
                    <TextInput
                      placeholder="Email"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      style={styles.authTextInput}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      Password
                    </Text>

                    <TextInput
                      placeholder="Password"
                      secureTextEntry={true}
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      style={styles.authTextInput}
                    />
                    {loginOrRegister === "register" ? (
                      <>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          Confirm Password
                        </Text>
                        <TextInput
                          placeholder="Confirm Password"
                          secureTextEntry={true}
                          value={confirmPassword}
                          onChangeText={(text) => setConfirmPassword(text)}
                          style={styles.authTextInput}
                        />
                        <Pressable
                          // onPress={() => handleRegister()}
                          style={{
                            backgroundColor: "#ff595e",
                            padding: 10,
                            borderRadius: 10,
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 20,
                            }}
                          >
                            Register
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <>
                        <Pressable
                          // onPress={() => handleLogin()}
                          style={{
                            backgroundColor: "#ff595e",
                            padding: 10,
                            borderRadius: 10,
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 20,
                            }}
                          >
                            Login
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    );
}

const styles = StyleSheet.create({
  mainView: {
    padding: 10,
    flex: 1,
  },
  footerView: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
    backgroundColor: "#fdfcdc",
    content: "fill",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 25,
    minHeight: 60,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  authTextInput: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    height: 50,
    backgroundColor: "#f1f1f1",
  },
});
