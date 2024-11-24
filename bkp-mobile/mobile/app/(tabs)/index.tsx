import { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Text, Platform, ActionSheetIOS, Alert, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { useLocalDatabase } from "@/database/useLocalDatabase";

const hourInTimestamp = 60 * 60 * 1000
const hoursRegisters = [
  {
    init: new Date(Date.now()),
    end: new Date(Date.now() + (2 * hourInTimestamp)),
    responsible: "João"
  },
  {
    init: new Date(Date.now()),
    end: new Date(Date.now() + (1.5 * hourInTimestamp)),
    responsible: "Maria"
  },
  {
    init: new Date(Date.now()),
    end: new Date(Date.now() + (4 * hourInTimestamp)),
    responsible: "José"
  },
]

const usersProjects = [
  {
    id: "project1",
    title: "Projeto 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros}"
  },
  {
    id: "project2",
    title: "Projeto 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros}"
  },
]

export default function HomeScreen() {
  const [donePercentage, setDonePercentage] = useState(0);
  const [lastsHoursRegisters, setLastsHoursRegisters] = useState<typeof hoursRegisters>([])
  const [selectedProject, setSelectedProject] = useState("project1");
  const [isAddHoursModalOpen, setIsAddHoursModalOpen] = useState(false)
  const [currentActionId, setCurrentActionId] = useState<string | null>(null)


  async function openFullHistory() {
    console.log("Historico completo")
  }

  function openIOSPicker() {
    const labels = usersProjects.map(option => option.title);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...labels, "Cancelar"],
        cancelButtonIndex: labels.length,
      },
      (buttonIndex) => {
        if (buttonIndex !== labels.length) {
          setSelectedProject(usersProjects[buttonIndex].id);
        }
      }
    );
  };

  async function handleInit() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permissão negada")
      }

      const location = await Location.getCurrentPositionAsync({
        mayShowUserSettingsDialog: true,
      });

      // const { id } = await localDb.registerInitAction(selectedProject, location)
      const id = await new Promise<string>(resolve => {
        setTimeout(() => {
          // random string id
          resolve(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
        }, 1000)
      })
      setCurrentActionId(id)
      try { getHoursRegisters } catch (_) {}
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Permissão negada") {
          Alert.alert("Permissão negada", "Você deve permitir o acesso a localização para registrar horas de ativadade em projetos")
        }
      }
    }
  }

  // async function getCurrentAction () {
  //   try {
  //     const currentAction = await localDb.getCurrentAction(selectedProject)
  //     console.log("currentAction", currentAction)
  //   } catch (err) {
  //     console.error("error while getting current action on home screen", err)
  //   }
  // }

  // async function getHoursRegisters() {
  //   // const percentage = (8 / 20) * 100
  //   // const lastsHoursRegisters = hoursRegisters.slice(0, 3)
  //   //
  //   // setDonePercentage(percentage)
  //   // setLastsHoursRegisters(lastsHoursRegisters as any)

  //   return []
  // }

  async function fetchInitData() {
    // await getCurrentAction()
    // await getHoursRegisters()
  }

  useEffect(() => {
    setTimeout(() => {
      fetchInitData()
    }, 4000)
  }, []);

  return (
    <View style={styles.viewContainer}>
      {Platform.OS === "ios" && (
        <Pressable
          onPress={openIOSPicker}
        >
          <View style={styles.projectSelectorWrapper}>
            <Text style={styles.projectSelectorText}>Projeto 1 <Ionicons name="chevron-down" color={Colors.light.icon} /></Text>
          </View>
        </Pressable>
      )}

      {Platform.OS === "android" && (
        <Picker
          selectedValue={selectedProject}
          onValueChange={(itemValue) => {
            setSelectedProject(itemValue);
          }}
          style={{
            width: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {usersProjects.map((option) => (
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
          Adicionar horas
        </Text>
        <Pressable onPress={() => setIsAddHoursModalOpen(true)} style={styles.addHoursButton}>
          <Ionicons name="add" size={30} color="white" />
        </Pressable>
        <Modal
          visible={isAddHoursModalOpen}
          animationType="slide"
        >
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
          >
            <Text>Adicionar horas</Text>
            <Pressable onPress={() => setIsAddHoursModalOpen(false)}>
              <Text>Fechar</Text>
            </Pressable>

            <Pressable onPress={handleInit}>
              <Text>Confirmar</Text>
            </Pressable>
          </View>
        </Modal>
      </View>

      <View style={styles.lastsHistoryWrapper}>
        {
          lastsHoursRegisters.map((hourRegister, index) => (
            <HourRegister key={index} {...hourRegister} />
          ))
        }

        <Pressable style={styles.openFullHistoryButton} onPress={openFullHistory}>
          <Text style={styles.openFullHistoryText}>
            Mostrar historico completo
            <Ionicons name="chevron-forward" size={10} color="white" />
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type HourRegisterProps = {
  init: Date
  end: Date
  responsible: string
}
function HourRegister({ init, end, responsible }: HourRegisterProps) {
  const timeSpent = (end.getTime() - init.getTime()) / 1000 / 60 / 60
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
      width: "33%",
    },
    hoursRegisterTextWithBorder: {
      textAlign: "center",
      width: "33%",
      borderStartWidth: 1,
      borderEndWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
    },
  })

  return (
    <View style={styles.hoursRegisterWrapper}>
      <Text style={styles.hoursRegisterText}>
        {init.toLocaleDateString()}
      </Text>

      <Text style={styles.hoursRegisterTextWithBorder}>
        {responsible}
      </Text>

      <Text style={styles.hoursRegisterText}>
        {timeSpent} horas
      </Text>
    </View>
  )
}

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
  },
  openFullHistoryText: {
    color: "white",
    fontSize: 14,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
