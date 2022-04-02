import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Card,
  Paragraph,
  Button,
  IconButton,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

function NoteCard({ item }) {
  return (
    <Card
      style={{
        margin: "15px",
        padding: "10px",
        borderRadius: "30px",
      }}
    >
      <Card.Title title={item.title} />
      <Card.Content>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </Card.Actions>
    </Card>
  );
}
function Home({ navigation }) {
  const getNotes = async () => {
    const notes = await AsyncStorage.getItem("NOTES");
    if (notes !== null && notes.length > 0) {
      return JSON.parse(notes);
    } else {
      AsyncStorage.setItem("NOTES", JSON.stringify([]));
      return [];
    }
  };

  let [notes, setNotes] = useState([]);
  let [flag, setFlag] = useState(true);
  if (flag) {
    setFlag(false);
    getNotes().then((x) => setNotes(x));
  }
  return (
    <SafeAreaView style={{ backgroundColor: "#f9e79f" }}>
      {notes.map((item, index) => (
        <NoteCard item={item} key={index} />
      ))}
      <IconButton
        icon="plus"
        size={40}
        onPress={() => {
          navigation.navigate("Create note", {
            notes: notes,
            setNotes: setNotes,
          });
        }}
        style={{
          borderRadius: "50%",
          position: "fixed",
          bottom: 10,
          right: 10,
        }}
      />
    </SafeAreaView>
  );
}

function AddNote({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { notes, setNotes } = route.params;
  return (
    <SafeAreaView
      style={{ backgroundColor: "#f9e79f", padding: "30px", height: "100vh" }}
    >
      <TextInput
        style={{ marginBottom: "20px" }}
        label="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={{ marginBottom: "20px" }}
        label="Description"
        value={description}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setDescription(text)}
      />
      <Button
        mode="contained"
        onClick={() => {
          const note = { title: title, description: description };
          setNotes([note, ...notes]);
          navigation.goBack();
        }}
      >
        Create note
      </Button>
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Create note" component={AddNote} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
