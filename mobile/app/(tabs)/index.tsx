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
  const [donePercentage, setDonePercentage] = useState(15);

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
          fill={donePercentage}
          tintColor={Colors.light.primary}
          backgroundColor={Colors.light.gray}
          rotation={0}
        >
          {
            () => (
              <View style={styles.doneTextWrapper}>
                <Text style={styles.doneTextContent}>
                  8/20h
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
              <Text style={styles.modalTitle}>Detalhes da atividade</Text>

              <View style={styles.timeInfo}>
                <Text>Início: {new Date(currentActivity?.initLog?.timestamp || '').toLocaleTimeString()}</Text>
                <Text>Fim: {finishTime ? finishTime.toLocaleTimeString() : ''}</Text>
              </View>

              <Text style={styles.inputLabel}>Descrição da atividade</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Descreva suas atividades..."
                value={activityDetails}
                onChangeText={setActivityDetails}
                multiline
              />

              <Pressable
                style={styles.submitButton}
                onPress={handleFinishActivity}
                disabled={finishActivityMutation.isPending}
              >
                <View style={styles.submitButtonContent}>
                  <Text style={styles.submitButtonText}>Finalizar</Text>
                  {finishActivityMutation.isPending && (
                    <ActivityIndicator size="small" color="white" style={styles.submitButtonLoader} />
                  )}
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
    },
    hoursRegisterTextWithBorder: {
      textAlign: "center",
      textOverflow: "ellipsis",
      borderEndWidth: 1,
      paddingInline: 2
    },
  })

  return (
    <View style={styles.hoursRegisterWrapper}>
      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "25%" }}>
        {register.project.name}
      </Text>

      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "25%" }}>
        {new Date(register.init).toLocaleDateString()}
      </Text>

      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "35%" }}>
        {register.responsible ?? "Sem responsavel"}
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
    padding: 10,
    backgroundColor: Colors.light.gray,
    borderRadius: 10,
    width: "90%",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 20, // Add safe area padding for iOS
    alignItems: 'center', // Center content horizontally
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    width: '100%',
  },
  timeInfo: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center', // Center time info
  },
  descriptionInput: {
    width: '90%',
    height: 150,
    borderWidth: 1,
    borderColor: Colors.light.gray,
    borderRadius: 5,
    padding: 15,
    marginBottom: 30,
    textAlignVertical: 'top',
    alignSelf: 'center', // Center the input
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20, // Adjust bottom padding for iOS
    alignSelf: 'center', // Center the button
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
  historyScrollView: {
    flex: 1,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
});
