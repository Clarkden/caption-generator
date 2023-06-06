import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../lib/firebaseConfig";
import IonIcons from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";

const copyToClipboard = (text) => {
  Clipboard.setString(text);
};

export default function Saved() {
  const [savedCaptions, setSavedCaptions] = useState([]);

  const deleteCaption = (caption) => {
    try {
      const db = getFirestore();
      const uid = auth.currentUser.uid;
      const docRef = doc(db, "user-captions", uid);

      setDoc(docRef, {
        captions: savedCaptions.filter((c) => c !== caption),
      });
    } catch (error) {
      console.log(error);
    }
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

  if (savedCaptions.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Nothing to see here
        </Text>
      </View>
    );
  }
  return (
    <View style={{ height: "100%" }}>
    <StatusBar barStyle="light-content" />
      <ScrollView style={styles.main}>
        {savedCaptions.map((caption, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              padding: 16,
              marginVertical: 8,
              borderRadius: 10,
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.1,
              shadowRadius: 15,
            }}
          >
            <View style={{ flex: 1, padding: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: "400" }} key={index}>
                {caption}
              </Text>
            </View>
            <View style={{ flex: 0, flexDirection: "row", gap: 6 }}>
              <Pressable
                onPress={() => {
                  copyToClipboard(caption);
                  Alert.alert(
                    "Copied to clipboard",
                    "You can now paste this caption anywhere you want."
                  );
                }}
              >
                <IonIcons name="copy-outline" size={24} color="black" />
              </Pressable>
              <Pressable onPress={() => deleteCaption(caption)}>
                <IonIcons name="trash-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 24,
  },
  main: {
    flex: 0,
    width: "100%",
    padding: 24,
    // flex: 1,
    // justifyContent: "center",
    // maxWidth: 960,
    // marginHorizontal: "auto",
  },
});
