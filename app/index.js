import {
  StyleSheet,
  Text,
  View,
  Dr,
  Pressable,
  SafeAreaView,
  Sele,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Button,
  Dimensions,
} from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { ENVIRONMENT, REWARDED_INTERSTITIAL, BANNER } from "@env";
import { Picker } from "@react-native-picker/picker";

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedInterstitialAd,
  RewardedAdEventType,
  AdEventType,
} from "react-native-google-mobile-ads";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, setHideStatusBar } from "expo-status-bar";

const adUnitId =
  __DEV__ || ENVIRONMENT !== "production" ? TestIds.BANNER : BANNER;

const adUnitId1 =
  __DEV__ || ENVIRONMENT !== "production"
    ? TestIds.REWARDED_INTERSTITIAL
    : REWARDED_INTERSTITIAL;

const rewardedInterstitial =
  RewardedInterstitialAd.createForAdRequest(adUnitId1);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const categories = [
  { category: "None", backgroundColor: "gray" },
  { category: "💔 Heartbreak", backgroundColor: "#ff6b6b" },
  { category: "🔪 Revenge", backgroundColor: "#ff9f43" },
  { category: "🤝 Friendship", backgroundColor: "#1dd1a1" },
  { category: "❤️ Love", backgroundColor: "#ff6b6b" },
  { category: "✈️ Travel", backgroundColor: "#48dbfb" },
  { category: "💪 Motivation/Inspiration", backgroundColor: "#00d2d3" },
  { category: "💖 Self-Love", backgroundColor: "#ff9ff3" },
  { category: "🏆 Success", backgroundColor: "#feca57" },
  { category: "🌍 Adventure", backgroundColor: "#1dd1a1" },
  { category: "🎉 Party/Fun Times", backgroundColor: "#5f27cd" },
  { category: "🍃 Nature", backgroundColor: "#10ac84" },
  { category: "💪 Fitness/Wellness", backgroundColor: "#00d2d3" },
  { category: "🍔 Food and Drink", backgroundColor: "#ee5253" },
  { category: "🎂 Birthday Wishes", backgroundColor: "#ff9ff3" },
  { category: "🙏 Gratitude", backgroundColor: "#c8d6e5" },
  { category: "📸 Throwback/Nostalgia", backgroundColor: "#576574" },
  { category: "🦸‍♀️ Empowerment", backgroundColor: "#1dd1a1" },
  { category: "👪 Family", backgroundColor: "#0abde3" },
  { category: "🎄 Holiday", backgroundColor: "#2e86de" },
  { category: "💼 Work and Hustle", backgroundColor: "#8395a7" },
  { category: "🎓 Life Lessons", backgroundColor: "#576574" },
  { category: "💭 Mental Health", backgroundColor: "#48dbfb" },
  { category: "🌱 Personal Growth", backgroundColor: "#1dd1a1" },
  { category: "📚 Learning/Education", backgroundColor: "#0abde3" },
  { category: "✊ Social Issues", backgroundColor: "#ee5253" },
  { category: "🎵 Lyrics", backgroundColor: "#10ac84" },
  { category: "🖋️ Poetic", backgroundColor: "#5f27cd" },
  { category: "💬 Quotes", backgroundColor: "#8395a7" },
  { category: "📖 Storytelling", backgroundColor: "#1dd1a1" },
  { category: "❓ Questions", backgroundColor: "#ff9f43" },
  { category: "👩‍🏫 Educational/Informative", backgroundColor: "#0abde3" },
  { category: "📣 Call to Action", backgroundColor: "#c8d6e5" },
  { category: "😀 Emojis", backgroundColor: "#2e86de" },
  { category: "🔖 Hashtags", backgroundColor: "#576574" },
  { category: "🔍 Minimalist", backgroundColor: "#c8d6e5" },
  { category: "🎭 Wordplay/Puns", backgroundColor: "#ff9f43" },
  { category: "📊 Facts/Trivia", backgroundColor: "#0abde3" },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function parseCaptions(captions) {
  // Split the captions string on number patterns, excluding the trailing double quote
  let splitCaptions = captions.split(/\d+\.\s+/);

  // If there's a trailing double quote, remove it
  splitCaptions = splitCaptions.map((caption) =>
    caption.endsWith('"') ? caption.trim().slice(0, -1) : caption.trim()
  );

  // Remove any empty strings resulting from splitting (i.e., if there were trailing newlines or if the string started with a number)
  splitCaptions = splitCaptions.filter((caption) => caption !== "");

  return splitCaptions;
}

export default function Page() {
  const [keyWords, setKeyWords] = useState("");

  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [category, setCategory] = useState(null);
  const [length, setLength] = useState("short");

  const [savedCaptions, setSavedCaptions] = useState([]);
  const [generationCount, setGenerationCount] = useState(3);

  const [categoryModal, setCategoryModal] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const [hideStatusBar, setHideStatusBar] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const generateCaptions = async () => {
    setCaptions([]);
    setLoadError(false);

    try {
      let generationCount = await AsyncStorage.getItem("@generationCount");
      console.log(generationCount);
      // Check if the value exists, if not, initialize it
      if (generationCount === null) {
        generationCount = 3; // Default value
        await AsyncStorage.setItem(
          "@generationCount",
          generationCount.toString()
        );
      } else {
        generationCount = parseInt(generationCount); // Convert the value from string to number
      }

      // Check if generationCount is greater than 0 before decreasing
      if (generationCount > 0) {
        const updatedGenerationCount = generationCount - 1;

        // Set the decreased value in state and in AsyncStorage
        setGenerationCount(updatedGenerationCount);
        await AsyncStorage.setItem(
          "@generationCount",
          updatedGenerationCount.toString()
        );
      } else {
        // Handle the case when generationCount is 0 or less
        console.log("Generation limit reached");
        rewardedInterstitial.show();
        setHideStatusBar(true);
        return;
      }
    } catch (e) {
      // Handle error
      console.log(e);
      rewardedInterstitial.load();
      return;
    }

    try {
      setLoading(true);

      let prompt = "";
      let captionAmount = 1;

      switch (length) {
        case "short":
          captionAmount = 3;
          break;
        case "medium":
          captionAmount = 2;
          break;
        case "long":
          captionAmount = 1;
          break;
        default:
          captionAmount = 1;
      }

      prompt = `Create ${captionAmount} ${length} length captions for an instagram post ${
        keyWords && `based on ${keyWords}`
      } ${category && `with the category ${category}`} `;

      if (category === "💬 Quotes") {
        prompt =
          prompt +
          'Use only real qoutes from famous people and always add the person who said it like this: `1. "Caption" - Person';
      } else if (category === "🎵 Lyrics") {
        prompt =
          prompt +
          'Use only real lyrics from famous songs and always add the song name like this: `1. "Caption" - Song';
      }

      prompt =
        `Create ${captionAmount}` +
        prompt +
        `The caption should be numbered starting with '1.', followed by a space, and then enclosed within double quotes. Each new line of the caption should start after a comma and space, ensuring the entire caption is within the double quotes. ${
          category === "😀 Emojis"
            ? "Use only emojis for the caption."
            : "Don't use any emojis in the caption."
        }.`;

      const response = await axios.post(
        // ENVIRONMENT === "development"
        //   ? "https://generatecaptionstest-napp6sn2ga-uc.a.run.app"
        //   : "https://generatecaptions-napp6sn2ga-uc.a.run.app",
        "https://generatecaptions-napp6sn2ga-uc.a.run.app",
        {
          prompt:
            prompt + '. Always format the caption like this: `1. "Caption`',
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setCaptions(parseCaptions(response.data));
    } catch (error) {
      console.log(error);
      setLoadError(true);
    } finally {
      rewardedInterstitial.load();
      setLoading(false);
    }
  };

  const saveCaption = async (caption) => {
    const db = getFirestore();

    const uid = auth.currentUser.uid;
    try {
      const found = await getDoc(doc(db, "user-captions", uid));

      if (found.exists()) {
        await updateDoc(doc(db, "user-captions", uid), {
          captions: arrayUnion(caption),
        });
      } else {
        await setDoc(doc(db, "user-captions", uid), {
          captions: [caption],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipboard = (caption) => {
    Clipboard.setString(caption);
  };

  useEffect(() => {
    const db = getFirestore();

    const uid = auth.currentUser.uid;

    const unsubscribe = onSnapshot(
      doc(db, "user-captions", uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setSavedCaptions(docSnapshot.data().captions);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const setGenerationCountInUseEffect = async (count) => {
    try {
      await AsyncStorage.setItem("@generationCount", count.toString());
    } catch (e) {
      // Handle error
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {}
    );

    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
        setGenerationCountInUseEffect(reward.amount.toString());
        setHideStatusBar(false);
        rewardedInterstitial.load();
      }
    );

    const unsubscribeError = rewardedInterstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        // If an error occurs, it's possible the ad was closed prematurely
        setHideStatusBar(false);
        rewardedInterstitial.load();
      }
    );

    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
    };
  }, []);

  

  return (
    <>
      <SafeAreaView style={{ height: "100%" }}>
        {/* <SelectDropdown
      data={categories}
      onSelect */}
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <StatusBar barStyle="light-content" hidden={hideStatusBar} />
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <ScrollView style={styles.container}>
              <View style={styles.main}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Helvetica",
                      fontWeight: "600",
                    }}
                  >
                    Caption Length
                  </Text>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 10,
                      // width: "100%"
                      marginVertical: 10,
                      height: 40,
                    }}
                  >
                    <Pressable
                      onPress={() => setLength("short")}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={
                          length === "short"
                            ? styles.customizationButtons
                            : styles.customizationButtonsInactive
                        }
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: "Helvetica",
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          Short
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => setLength("medium")}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={
                          length === "medium"
                            ? styles.customizationButtons
                            : styles.customizationButtonsInactive
                        }
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: "Helvetica",
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          Medium
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => setLength("long")}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={
                          length === "long"
                            ? styles.customizationButtons
                            : styles.customizationButtonsInactive
                        }
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: "Helvetica",
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          Long
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
                <View
                  style={{
                    flex: 0,
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Helvetica",
                      fontWeight: "600",
                    }}
                  >
                    Keywords or Phrase
                  </Text>
                  <TextInput
                    style={{
                      height: 45,
                      backgroundColor: "white",
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#e8e8e8",
                    }}
                    // value={keyWords}
                    onChangeText={(value) => setKeyWords(value)}
                    placeholder="Ex. Basketball"
                  />
                </View>
                <View
                  style={{
                    flex: 0,
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Helvetica",
                      fontWeight: "600",
                    }}
                  >
                    Optional
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                    // width: "100%"
                  }}
                >
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setCategoryModal(true)}
                  >
                    <View style={styles.customizationButtons}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Helvetica",
                          fontWeight: "600",
                          color: "white",
                        }}
                      >
                        {category ? category : "Category"}
                      </Text>
                    </View>
                  </Pressable>
                </View>
                <View
                  style={{
                    flex: 0,
                    borderTopWidth: 1,
                    borderTopColor: "#e8e8e8",
                    paddingTop: 20,
                  }}
                >
                  <Pressable
                    style={{
                      backgroundColor: "#ff595e",
                      padding: 15,
                      borderRadius: 10,
                    }}
                    onPress={() => generateCaptions()}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Helvetica",
                        fontWeight: "600",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Generate
                    </Text>
                  </Pressable>
                </View>
              </View>
              {loadError ? (
                <View
                  style={{
                    marginTop: 20,
                    width: "100%",
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    marginBottom: 40,
                    flex: 0,
                    alignContent: "center",
                    justifyContent: "center",
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Helvetica",
                      fontWeight: "600",
                      marginTop: 20,
                      textAlign: "center",
                    }}
                  >
                    There was an error generating captions.
                  </Text>
                </View>
              ) : null}
              {loading ? (
                <View
                  style={{
                    marginTop: 20,
                    width: "100%",
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    marginBottom: 40,
                    flex: 0,
                    alignContent: "center",
                    justifyContent: "center",
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Helvetica",
                      fontWeight: "600",
                      marginTop: 20,
                      textAlign: "center",
                    }}
                  >
                    Generating Captions...
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Helvetica",
                      fontWeight: "500",
                      marginTop: 10,
                      textAlign: "center",
                      marginBottom: 20,
                    }}
                  >
                    This may take a few seconds.
                  </Text>
                  <ActivityIndicator size="large" color="#595EFF" />
                </View>
              ) : (
                <>
                  {captions.length > 0 && (
                    <View
                      style={{
                        marginTop: 20,
                        width: "100%",
                        backgroundColor: "white",
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        marginBottom: 40,
                        flex: 0,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontFamily: "Helvetica",
                          fontWeight: "600",
                          marginTop: 20,
                          textAlign: "center",
                        }}
                      >
                        Generated Captions
                      </Text>

                      <View
                        style={{
                          width: "100%",
                          flex: 1,
                          height: "auto",
                        }}
                      >
                        {captions.map((caption) => (
                          <View
                            style={{
                              backgroundColor: "#f8f8f8",
                              padding: 16,
                              marginVertical: 8,
                              borderRadius: 8,
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              shadowColor: "#000",
                              shadowOffset: {
                                width: 0,
                                height: 2,
                              },
                              shadowOpacity: 0.25,
                              width: "100%",
                            }}
                            key={caption}
                          >
                            <View
                              style={{
                                flex: 1,
                                paddingHorizontal: 5,
                              }}
                            >
                              <Text>{caption}</Text>
                            </View>
                            <View
                              style={{
                                flex: 0,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: 10,
                              }}
                            >
                              <Pressable onPress={() => saveCaption(caption)}>
                                <IonIcons
                                  name={
                                    savedCaptions.includes(caption)
                                      ? "bookmark"
                                      : "bookmark-outline"
                                  }
                                  size={20}
                                  color={
                                    savedCaptions.includes(caption)
                                      ? "#595EFF"
                                      : "black"
                                  }
                                />
                              </Pressable>
                              <Pressable
                                onPress={() => {
                                  copyToClipboard(caption);
                                  Alert.alert(
                                    "Copied to Clipboard",
                                    "Your caption has been copied to your clipboard."
                                  );
                                }}
                              >
                                <IonIcons
                                  name="copy-outline"
                                  size={20}
                                  color="black"
                                />
                              </Pressable>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </SafeAreaView>
      <Modal
        animationType="slide"
        visible={categoryModal}
        presentationStyle="pageSheet"
        onRequestClose={() => setCategoryModal(false)}
      >
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Helvetica",
              fontWeight: "600",
              color: "black",
            }}
          >
            Select a category
          </Text>
          <Pressable onPress={() => setCategoryModal(false)}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Helvetica",
                fontWeight: "600",
                color: "blue",
              }}
            >
              Done
            </Text>
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flex: 1,
              flexWrap: "wrap",
              flexDirection: "row",
              maxWidth: screenWidth,
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            {categories.map((category) => (
              <Pressable
                key={category.category}
                onPress={() => {
                  if (category.category === "None") setCategory(null);
                  else setCategory(category.category);

                  setCategoryModal(false);
                }}
              >
                <View
                  style={{
                    padding: 15,
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 175,
                    height: 150,
                    backgroundColor: category.backgroundColor,
                    borderRadius: 10,
                    marginBottom: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Helvetica",
                      fontWeight: "600",
                      color: "white",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {category.category}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    marginHorizontal: "auto",
    gap: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },

  customizationButtons: {
    backgroundColor: "#595EFF",
    padding: 5,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  customizationButtonsInactive: {
    backgroundColor: "#595EFF",
    padding: 5,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
});
