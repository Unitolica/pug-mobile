import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Text, Platform, ActionSheetIOS, Alert, Modal, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import db from "@/database/initDatabase";
import { initDatabase } from "@/database/initDatabase";
import { datesToDurationString } from "@/utils/date";
import { ActivityManager } from "@/database/activityManager";
import { ProjectActivity } from "@/database/types";

const HOUR_IN_TIMESTAMP = 60 * 60 * 1000
const USERS_PROJECTS = [
  {
    id: "project1",
    title: "Projeto 1"
  },
  {
    id: "project2",
    title: "Projeto 2"
  }
]

type UserProject = {
  id: string
  title: string
}

type HourRegister = {
  projectTitle: string
  projectId: string
  description: string
  init: number
  end: number
  approvedDate?: number
  responsible: string
  timeSpent: number
}

type TimeLog = {
  id: string
  project_ijd: string
  init_id: string
  time: number
}


export default function HomeScreen() {
  const [donePercentage, setDonePercentage] = useState(0);

  const [hoursRegisters, setHoursRegister] = useState<HourRegister[]>([])

  const [userProjects, setUserProjects] = useState<Record<string, UserProject>>({})
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showFinishActivityModal, setShowFinishActivityModal] = useState(false)

  const [currentActivity, setCurrentActivity] = useState<ProjectActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function openFullHistory() {
    console.log("Historico completo")
  }

  async function refreshActivityState() {
    const activity = await ActivityManager.getCurrentActivity();
    setCurrentActivity(activity);
  };

  function openIOSPicker() {
    const labels = USERS_PROJECTS.map(option => option.title);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...labels, "Cancelar"],
        cancelButtonIndex: labels.length,
      },
      (buttonIndex) => {
        if (buttonIndex !== labels.length) {
          const newSelectedProject = Object.values(userProjects)[buttonIndex].id
          setSelectedProject(newSelectedProject);
          listActivities(undefined, newSelectedProject)
        }
      }
    );
  };

  async function listActivities(projects?: Record<string, UserProject>, projectSelected?: string) {
    try {
      const result = await db.getAllAsync<HourRegister>(`
        SELECT
            i.id AS init_id,
            i.projectId,
            i.timestamp AS init,
            i.registerType AS init_registerType,
            e.id AS end_id,
            e.timestamp AS end,
            e.approvedDate,
            e.description,
            CASE
                WHEN e.id IS NOT NULL THEN 1
                ELSE 0
            END AS isFinished,
            CASE
                WHEN e.id IS NOT NULL THEN (e.timestamp - i.timestamp)
                ELSE NULL
            END AS timeSpent
        FROM
            time_logs i
        LEFT JOIN
            time_logs  e
        ON
            i.id = e.init_id AND e.registerType = "end"
        WHERE
            i.registerType = "init"
            AND
            i.projectId = ?
        ;
      `, [String(projectSelected ?? selectedProject)]);

      console.info("result")

      const projectsToUse = projects ?? userProjects
      const formatted = result.reduce((acc, curr) => {
        curr.projectTitle = projectsToUse[curr.projectId].title
        acc.push(curr)

        return acc
      }, [] as HourRegister[])
      setHoursRegister(formatted)
    } catch (error) {
      console.error("Error checking existing activity:", error);
      Alert.alert("Error", "Falha ao listar as suas atividades, entre em contato com o seu gerente de projeto.");
    }
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
        success = await ActivityManager.endActivity(locationData);
        if (success) {
          Alert.alert("Sucesso", "Atividade finalizada com sucesso");
        } else {
          Alert.alert("Falha", "Falha ao finalizar atividade");
        }
      }

      if (success) {
        await refreshActivityState();
        await listActivities();
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchProjects() {
    const usersProjectsFormatted = USERS_PROJECTS.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<string, UserProject>)

    setUserProjects(usersProjectsFormatted)
    setSelectedProject(USERS_PROJECTS[0].id)
    await listActivities(usersProjectsFormatted)
  }

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await refreshActivityState();
      await fetchProjects();
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
            <Text style={styles.projectSelectorText}>{userProjects[selectedProject ?? ""]?.title} <Ionicons name="chevron-down" color={Colors.light.icon} /></Text>
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
          {USERS_PROJECTS.map((option) => (
            <Picker.Item key={option.id} label={option.title} value={option.id} />
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
        {currentActivity && currentActivity.initLog.projectId !== selectedProject && (
          <Text style={styles.warningText}>
            Você tem uma atividade em andamento em outro projeto
          </Text>
        )}
      </View>

      {hoursRegisters.length > 0 && (
        <View style={styles.lastsHistoryWrapper}>
          {
            hoursRegisters.splice(0, 4).map(register => (
              <HourRegisterComponent key={`${register.projectId}-${register.end}`} register={register} />
            ))
          }
          <Pressable style={styles.openFullHistoryButton} onPress={openFullHistory}>
            <Text style={styles.openFullHistoryText}>
              Mostrar historico completo
              <Ionicons name="chevron-forward" size={10} color="white" />
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function HourRegisterComponent({ register }: { register: HourRegister }) {
  const styles = StyleSheet.create({
    hoursRegisterWrapper: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    hoursRegisterText: {
      textAlign: "center",
    },
    hoursRegisterTextWithBorder: {
      textAlign: "center",
      borderEndWidth: 1,
      paddingInline: 2
    },
  })

  return (
    <View style={styles.hoursRegisterWrapper}>
      <Text style={{ ...styles.hoursRegisterTextWithBorder, width: "25%" }}>
        {register.projectTitle}
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
  openFullHistoryButton: {
    marginTop: 10,
    marginHorizontal: "auto",
    padding: 10,
    borderRadius: 50,
    backgroundColor: Colors.light.primary,
    width: "100%",
    alignItems: "center",
  },
  openFullHistoryText: {
    color: "white",
    fontSize: 14,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
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
  }
});
