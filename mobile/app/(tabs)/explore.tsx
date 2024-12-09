import { useState, useMemo, useCallback } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet, TextInput, Text, ScrollView, Platform, Modal, TouchableOpacity, Alert } from 'react-native';
import { Colors } from "@/constants/Colors";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/context/auth";

export default function TabTwoScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
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
      const { data } = await api(`/project?${debouncedSearch ? `q=${debouncedSearch}` : ""}`);
      return data;
    },
    queryKey: ["projects-explore", debouncedSearch],
  });

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
            <TouchableOpacity key={index} onPress={() => setSelectedProject(project)}>
              <ProjectCard {...project} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </View>
  );
}

type ProjectCartProps = {
  name: string;
  description: string;
  hours: number;
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

type ProjectDetailModalProps = {
  project: ProjectCartProps & { id: string };
  onClose: () => void;
}

function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const { data: linkStatus, isLoading } = useQuery({
    queryKey: ["project-link-status", project.id],
    queryFn: async () => {
      const { data } = await api(`/project/${project.id}/request-link`);
      return data.status;
    },
  });

  const linkMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/project/${project.id}/request-link`);
    },
    onSuccess: () => {
      Alert.alert("Sucesso", "Sua solicitação foi enviada com sucesso.", [
        { text: "OK", onPress: onClose },
      ]);
    },
    onError: (error) => {
      console.error("error while requesting acess to project", error)
      Alert.alert("Falha", "Ocorreu um erro ao solicitar o acesso ao projeto. Tente novamente mais tarde.");
    },
    retry: false
  });

  const isRequested = linkStatus === "REQUESTED" || linkMutation.isSuccess;
  const isAccepted = linkStatus === "ACCEPTED";
  const isRejected = linkStatus === "REJECTED";

  return (
    <Modal
      animationType="slide"
      visible={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={modalStyles.content}>
          <Text style={modalStyles.title}>{project.name}</Text>
          <Text style={modalStyles.description}>{project.description}</Text>
          <Text style={modalStyles.hours}>Horas totais: {project.hours}</Text>
          
          {isAccepted ? (
            <View style={[modalStyles.statusContainer, modalStyles.acceptedStatus]}>
              <Text style={modalStyles.statusText}>Você já está vinculado a este projeto</Text>
            </View>
          ) : isRejected ? (
            <View style={[modalStyles.statusContainer, modalStyles.rejectedStatus]}>
              <Text style={modalStyles.statusText}>Sua solicitação foi rejeitada</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                modalStyles.linkButton,
                isRequested && modalStyles.disabledButton
              ]}
              onPress={() => linkMutation.mutate()}
              disabled={isRequested || isLoading}
            >
              {isLoading || linkMutation.isPending ? (
                <Text style={modalStyles.linkButtonText}>
                  Carregando...
                </Text>
              ) : (
                <Text style={modalStyles.linkButtonText}>
                  {isRequested ? "Solicitação enviada" : "Solicitar acesso ao projeto"}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? 30 : 50,
  },
  closeButton: {
    padding: 16,
    alignSelf: 'flex-end',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  hours: {
    fontSize: 16,
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  linkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  acceptedStatus: {
    backgroundColor: '#4CAF50', // green
  },
  rejectedStatus: {
    backgroundColor: '#F44336', // red
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


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
