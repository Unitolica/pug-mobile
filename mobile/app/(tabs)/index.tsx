import { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const hourInTimestamp = 60 * 60 * 1000
const hoursRegisters = [
  {
    init: new Date(Date.now()),
    end: new Date(Date.now() + (2 * hourInTimestamp)),
    responsible: "João"
  },
  {
    init: new Date(Date.now()),
    end: new Date(Date.now() + (0.5 * hourInTimestamp)),
    responsible: "Maria"
  },
  {
    init: new Date(Date.now()),
    end: new Date(Date.now() + (4 * hourInTimestamp)),
    responsible: "José"
  },
]

export default function HomeScreen() {
  const [donePercentage, setDonePercentage] = useState(0);
  const [lastsHoursRegisters, setLastsHoursRegisters] = useState([])

  async function openFullHistory () {
    console.log("Historico completo")
  }

  useEffect(() => {
    const percentage = (8 / 20) * 100
    const lastsHoursRegisters = hoursRegisters.slice(0, 3)

    setDonePercentage(percentage)
    setLastsHoursRegisters(lastsHoursRegisters as any)
  }, []);

  return (
    <View style={styles.viewContainer}>
      <View style={styles.projectSelectorWrapper}>
        <Text style={styles.projectSelectorText}>Projeto 1 <Ionicons name="chevron-down" color={Colors.light.icon} /></Text>
      </View>

      <View style={styles.projectSelectorWrapper}>
        <AnimatedCircularProgress
          size={Platform.OS === "android" ? 200 : 250}
          width={30}
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
              </View>
            )
          }
        </AnimatedCircularProgress>
      </View>

      <View style={styles.addHoursWrapper}>
        <Text style={styles.addHoursText}>
          Adicionar horas
        </Text>
        <Pressable style={styles.addHoursButton}>
          <Ionicons name="add" size={30} color="white" />
        </Pressable>
      </View>

      <View style={styles.lastsHistoryWrapper}>
        {
          hoursRegisters.map((hourRegister, index) => (
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
function HourRegister ({ init, end, responsible} : HourRegisterProps) {
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
  projectSelectorText: {
    fontSize: Platform.OS === "android" ? 16 : 24,
    fontWeight: "bold",
    marginVertical: 5,
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
