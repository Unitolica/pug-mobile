import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet, TextInput, Text, ScrollView, Platform } from 'react-native';
import { Colors } from "@/constants/Colors";

const projects = [
  {
    title: "Projeto 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros ultricies tincidunt. Nullam nec purus nec eros ultricies tincidunt.",
    hours: 10
  },
  {
    title: "Projeto 2",
    description: "Descrição do projeto 2",
    hours: 20
  },
  {
    title: "Projeto 3",
    description: "Descrição do projeto 3",
    hours: 30
  },
  {
    title: "Projeto 4",
    description: "Descrição do projeto 4",
    hours: 40
  },
  {
    title: "Projeto 5",
    description: "Descrição do projeto 5",
    hours: 50
  },
  {
    title: "Projeto 6",
    description: "Descrição do projeto 6",
    hours: 60
  },
]

export default function TabTwoScreen() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Procurar projetos"
        />
        <Ionicons name="search" size={24} color="black" />
      </View>

      <ScrollView style={styles.content}>
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </ScrollView>
    </View>
  );
}

type ProjectCartProps = {
  title: string
  description: string
  hours: number
}

function ProjectCard({ title, description, hours }: ProjectCartProps) {
  return (
    <View style={projectStyles.container}>
      <Text style={projectStyles.text}>{title}</Text>
      <Text style={projectStyles.text}>{description}</Text>
      <Text style={projectStyles.text}>Hotas totais: {hours}</Text>
    </View>
  )
}
const projectStyles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: Colors.light.primary,
    color: "white",
    borderRadius: 10
  },
  text: {
    color: "white"
  }
})

const styles = StyleSheet.create({
  viewContainer: {
    paddingTop: Platform.OS === "android" ? 30 : 50,
    flex: 1,
    alignItems: "center"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 16,
  },
  searchInput: {
    width: "90%",
    height: 40,
    fontSize: Platform.OS === "android" ? 14 : 18,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxHeight: "90%",
    paddingHorizontal: 16,
  }
});
