import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { compileRepoStruct, IEvent, Repo } from "./utils";


interface AllRepos {
  [repoName: string]: Repo;
}
// sample user: torvalds 
const GITHUB_API__ROOT_URL = "https://api.github.com/users/";
export default function Index() {
  const [username, setUsername] = useState<string>("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [allRepos, setAllRepos] = useState<AllRepos>({});

  const handleSearch = () => {
    fetch(`${GITHUB_API__ROOT_URL}${username}/events`)
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    const allRepos = compileRepoStruct(events, username);
    setAllRepos(allRepos);
  }, [events, username])

  const renderRepo = ({ item }: { item: string }) => {
    const repo = allRepos[item]
    const orderedEvents = Object.keys(repo.events)
      .sort((a, b) => repo.events[b] - repo.events[a])

    return (
      <View style={styles.repo}>
        <Text>Repo: {item}</Text>
        <Text>Is own repo: {repo.isOwnRepo ? "true" : "false"}</Text>
        <Text>Most common activity:</Text>
        {orderedEvents.slice(0, 3).map((value) => (
          <Text key={value}>
            {value}: {repo.events[value]}
          </Text>
        ))}
      </View>
    )
  }

  return (
    <View
      style={styles.container}
    >
      <View style={styles.inputContainer}>
      <TextInput
        placeholder="Enter a GitHub username"
        onChangeText={(text) => setUsername(text)}
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="gray"
      />
      <TouchableOpacity onPress={handleSearch} style={styles.button}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      </View>
      <FlatList
        data={Object.keys(allRepos)}
        renderItem={renderRepo}
        keyExtractor={item => item}
        contentContainerStyle={styles.repoList}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "white",
    marginRight: 10,
    height: 40,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  repo: {
    padding: 20,
  },
  repoList: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
  }
});