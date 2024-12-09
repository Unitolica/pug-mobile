import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Text, TextInput, Platform, ActionSheetIOS, Alert, Modal, ActivityIndicator } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { initDatabase } from "@/database/initDatabase";
import { datesToDurationString } from "@/utils/date";
import { ActivityManager } from "@/database/activityManager";
import { ProjectActivity } from "@/database/types";
import { useAuth } from "@/context/auth";

export default function HomeScreen() {
  const { user, fetchMe } = useAuth()

  const [activityDetails, setActivityDetails] = useState("");

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showFinishActivityModal, setShowFinishActivityModal] = useState(false)
  const [finishTime, setFinishTime] = useState<Date | null>(null)

  const [currentActivity, setCurrentActivity] = useState<ProjectActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const finishActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/project/activity', {
        ...data,
        projectId: selectedProject,
        description: activityDetails
      });
    },
    onSuccess: () => {
      setShowFinishActivityModal(false);
      setActivityDetails("");
    },
    onError: (error) => {
      console.error("error while finishing activity", error)
      Alert.alert("Error", "Failed to finish activity");
    }
  });

  async function refreshActivityState() {
    const activity = await ActivityManager.getCurrentActivity();
    fetchMe()
    setCurrentActivity(activity);
  };

  function openIOSPicker() {
    const labels = user!.UsersOnProjects.map(({ project }) => project.name);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...labels, "Cancelar"],
        cancelButtonIndex: labels.length,
      },
      (buttonIndex) => {
        if (buttonIndex !== labels.length) {
          const newSelectedProject = user!.UsersOnProjects[buttonIndex].project.id
          setSelectedProject(newSelectedProject);
          listActivities(undefined, newSelectedProject)
        }
      }
    );
  };

  async function listActivities(projects?: Record<string, any>, projectSelected?: string) {
    // TODO: move this into useQuery
  }

  async function handleActivity() {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permissão", "Permissão de localização negada! Precisamos de acesso a sua localização para o registro de novas atividades.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      let success: boolean;

      if (!currentActivity) {
        success = await ActivityManager.startActivity(selectedProject!, locationData);
        if (success) {
          Alert.alert("Sucesso", "Atividade iniciada com sucesso");
        } else {
          Alert.alert("Falha", "Falhar ao iniciar a atividade");
        }
      } else {
        setFinishTime(new Date())
        setShowFinishActivityModal(true)
      }

      await refreshActivityState();
      await listActivities();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  async function handleFinishActivity() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      const { data: activityData } = await ActivityManager.endActivity(locationData);

      await finishActivityMutation.mutateAsync(activityData);

      await refreshActivityState();
      await listActivities();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  }


  useEffect(() => {
    const init = async () => {
      setSelectedProject(user!.UsersOnProjects[0].project.id)
      await initDatabase();
      await refreshActivityState();
    };

    init();
  }, []);

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollViewContent}>
      {Platform.OS === "ios" && (
        <Pressable
          onPress={openIOSPicker}
        >
          <View style={styles.projectSelectorWrapper}>
            <Text style={styles.projectSelectorText}>{user?.UsersOnProjects.find(({ project }) => project.id === selectedProject)?.project.name} <Ionicons name="chevron-down" color={Colors.light.icon} /></Text>
          </View>
        </Pressable>
      )}

      {Platform.OS === "android" && (
        <Picker
          selectedValue={selectedProject}
          onValueChange={(itemValue) => {
            setSelectedProject(itemValue);
          }}
          dropdownIconColor={Colors.light.primary}
          dropdownIconRippleColor={Colors.light.primary}
          style={{
            width: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {user?.UsersOnProjects.map(({ project }) => (
            <Picker.Item key={project.id} label={project.name} value={project.id} />
          ))}
        </Picker>
      )}

      <View style={styles.doneWrapper}>
        <AnimatedCircularProgress
          size={Platform.OS === "android" ? 200 : 250}
          width={Platform.OS === "android" ? 25 : 35}
          fill={user!.percentage}
          tintColor={Colors.light.primary}
          backgroundColor={Colors.light.gray}
          rotation={0}
        >
          {
            () => (
              <View style={styles.doneTextWrapper}>
                <Text style={styles.doneTextContent}>
                  {user!.totalHours.toFixed(1)}/20h
                </Text>
                <Text style={styles.doneTextContent}>
                  Mensais
                </Text>
                <Pressable
                  onPress={() => {
                    Alert.alert("Informações", "Você deve completar 20 horas mensais!")
                  }}
                  style={styles.doneTextWrapperInfo}
                >
                  <Ionicons size={20} name="information-circle" color={Colors.light.gray} />
                </Pressable>
              </View>
            )
          }
        </AnimatedCircularProgress>
      </View>

      <View style={styles.addHoursWrapper}>
        <Text style={styles.addHoursText}>
          {currentActivity ? "Encerrar atividade" : "Iniciar atividade"}
        </Text>
        <Pressable onPress={() => handleActivity()} style={[
          styles.addHoursButton,
          currentActivity && currentActivity.initLog.projectId !== selectedProject ?
            styles.disabledButton : {}
        ]}
          disabled={currentActivity && currentActivity?.initLog?.projectId !== selectedProject}
        >
          {
            isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              currentActivity
                ? (
                  <Ionicons name="checkmark" size={30} color="white" />
                )
                : (
                  <Ionicons name="add" size={30} color="white" />
                )
            )
          }
        </Pressable>

        <Modal
          visible={showFinishActivityModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFinishActivityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Finalizar Atividade</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowFinishActivityModal(false)}
                >
                  <Ionicons name="close" size={24} color={Colors.light.gray} />
                </Pressable>
              </View>

              <View style={styles.timeInfo}>
                <View style={styles.timeInfoRow}>
                  <Text style={styles.timeLabel}>Início</Text>
                  <Text style={styles.timeValue}>
                    {new Date(currentActivity?.initLog?.timestamp || '').toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.timeInfoRow}>
                  <Text style={styles.timeLabel}>Fim</Text>
                  <Text style={styles.timeValue}>
                    {finishTime ? finishTime.toLocaleTimeString() : ''}
                  </Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Descrição da atividade</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Descreva suas atividades..."
                value={activityDetails}
                onChangeText={setActivityDetails}
                multiline
                placeholderTextColor={Colors.light.gray}
              />

              <Pressable
                style={[
                  styles.submitButton,
                  finishActivityMutation.isPending && { opacity: 0.7 }
                ]}
                onPress={handleFinishActivity}
                disabled={finishActivityMutation.isPending}
              >
                <View style={styles.submitButtonContent}>
                  {finishActivityMutation.isPending ? (
                    <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text style={styles.submitButtonText}>
                    {finishActivityMutation.isPending ? 'Finalizando...' : 'Finalizar Atividade'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Modal>


        {currentActivity && currentActivity.initLog.projectId !== selectedProject && (
          <Text style={styles.warningText}>
            Você tem uma atividade em andamento em outro projeto
          </Text>
        )}
      </View>

      {user!.requestedTimeLogs.length !== 0 && (
        <View style={styles.lastsHistoryWrapper}>
          {
            user!.requestedTimeLogs.map(register => (
              <HourRegisterComponent key={`${register.id}-${register.end}`} register={register} />
            ))
          }
        </View>
      )}
    </ScrollView>
  );
}

function HourRegisterComponent({ register }: { register: any }) {
  const getStatus = () => {
    if (register.approvedBy) return "Aprovado";
    if (register.deniedBy) return "Negado";
    return "Pendente";
  };

  const getStatusColor = () => {
    if (register.approvedBy) return "green";
    if (register.deniedBy) return "red";
    return "black";
  };

  const styles = StyleSheet.create({
    hoursRegisterWrapper: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "black",
      textOverflow: "ellipsis",
    },
    hoursRegisterText: {
      textAlign: "center",
      textOverflow: "ellipsis",
      fontWeight: "500"
    },
    hoursRegisterTextWithBorder: {
      textAlign: "center",
      textOverflow: "ellipsis",
      borderEndWidth: 1,
      paddingInline: 2,
      fontWeight: "500"
    },
    statusText: {
      color: getStatusColor(),
      fontWeight: "500"
    }
  })

  return (
    <View style={styles.hoursRegisterWrapper}>
      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "30%" }}>
        {register.project.name}
      </Text>

      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "25%" }}>
        {new Date(register.init).toLocaleDateString()}
      </Text>

      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "30%" }}>
        <Text style={styles.statusText}>{getStatus()}</Text>
      </Text>

      <Text style={{ ...styles.hoursRegisterText, width: "15%" }}>
        {
          register.end ? (
            datesToDurationString(
              new Date(register.end),
              new Date(register.init)
            )
          ) : (
            "-"
          )
        }
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: Platform.OS === "android" ? 30 : 50,
  },
  scrollViewContent: {
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
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxHeight: "90%",
    paddingHorizontal: 16,
  },
  projectSelectorWrapper: {
    padding: 10,
  },
  projectSelectorAndroidPicker: {
  },
  projectSelectorText: {
    fontSize: Platform.OS === "android" ? 16 : 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  doneWrapper: {
    marginTop: Platform.OS === "android" ? 0 : 40,
    padding: 10,
  },
  doneTextWrapperText: {
    justifyContent: "center",
    alignItems: "center",
  },
  doneTextWrapperInfo: {
  },
  doneTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  doneTextContent: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addHoursWrapper: {
    marginTop: Platform.OS === "android" ? 0 : 40,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  addHoursText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  addHoursButton: {
    backgroundColor: Colors.light.primary,
    padding: 8,
    borderRadius: 50,
  },
  lastsHistoryWrapper: {
    marginTop: Platform.OS === "android" ? 10 : 40,
    width: "90%",
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5
  },
  warningText: {
    marginTop: 5,
    color: "red",
    fontSize: 12,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.light.gray,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButtonLoader: {
    marginLeft: 8,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyScrollView: {
    flex: 1,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  timeInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  timeLabel: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  descriptionInput: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginTop: 'auto',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
});
