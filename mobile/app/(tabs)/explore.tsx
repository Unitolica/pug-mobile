import { useState, useMemo, useCallback } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet, TextInput, Text, ScrollView, Platform } from 'react-native';
import { Colors } from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/context/auth";

export default function TabTwoScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  let timeout;

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setDebouncedSearch(text);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const { isLoading, data: projects, isError, error, refetch } = useQuery({
    queryFn: async () => {
      try {
        const { data } = await api(`/project?${debouncedSearch ? `q=${debouncedSearch}` : ""}`);
        return data;
      } catch (err) {
        console.error("error on get projects", err.message, err)
        throw err
      }
    },
    queryKey: ["projects-explore", debouncedSearch],
  })

  return (
    <View style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
          placeholder="Procurar projetos"
        />
        <View style={styles.iconsContainer}>
        <Ionicons name="search" size={24} color="black" />
          <Ionicons 
            name="refresh" 
            size={24} 
            color="black" 
            onPress={() => refetch()}
            style={styles.refreshIcon}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isError && (
          <>
            <Text>Ocorreu um erro ao buscar os projetos, tente novamente mais tarde!</Text>
            <Text>{JSON.stringify(error, null, 2)}</Text>
          </>
        )}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Carregando projetos...</Text>
          </View>
        ) : (
          projects?.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

type ProjectCartProps = {
  name: string
  description: string
  hours: number
}

function ProjectCard({ name, description, hours }: ProjectCartProps) {
  return (
    <View style={projectStyles.container}>
      <Text style={projectStyles.name}>{name}</Text>
      <Text style={projectStyles.text}>{description}</Text>
      <Text style={projectStyles.text}>Horas totais: {hours}</Text>
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
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: Platform.OS === "android" ? 14 : 16,
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
    width: "80%",
    height: 40,
    fontSize: Platform.OS === "android" ? 14 : 18,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxHeight: "90%",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIcon: {
    marginLeft: 10,
  },
});
