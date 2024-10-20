import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Text,
  Image,
  Modal,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useAuth } from "@/context/auth"
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export function Login() {
  const { login } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    await login(data.email, data.password)
  };

  function forgotPassword() {
    Alert.alert(
      "Esqueceu sua senha",
      "Caso você tenha esquecido sua senha, você pode redefini-la no portal do aluno."
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.loginView}>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={require("@/assets/images/students.png")}
                style={styles.students}
              />
            </View>

            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Email ou usuario"
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                />
              )}
              name="email"
              rules={{ required: "Voce precisa inserir um email", pattern: { value: /^\S+@\S+$/i, message: "Insira um email valido com o dominio da catolica (@catolicasc.edu.br)" } }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}

            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry={true}
                  onChangeText={field.onChange}
                />
              )}
              name="name"
              rules={{ required: "Insira uma senha valida" }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}

            <View style={styles.forgotPassword}>
              <Pressable onPress={forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
              </Pressable>
            </View>


            <View style={styles.loginButton}>
              <Pressable style={styles.pressable} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.loginButtonText}>
                  Continuar
                </Text>
                <Ionicons size={14} name="chevron-forward" color="white" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const stylesAlertModal = StyleSheet.create({
  container: {
  }
})

const styles = StyleSheet.create({
  loginView: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: "100%",
  },
  students: {
    maxWidth: "100%",
    height: Platform.OS === "android" ? 400 : 500,
    objectFit: "contain",
  },
  input: {
    height: Platform.OS === "android" ? 25 : 40,
    fontSize: Platform.OS === "android" ? 14 : 20,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: Platform.OS === "android" ? 5 : 8,
    width: "100%",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: "center",
    borderBottomWidth: 1,
  },
  forgotPasswordText: {
    fontSize: Platform.OS === "android" ? 14 : 18,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: Colors.light.primary,
    borderRadius: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loginButtonText: {
    fontSize: Platform.OS === "android" ? 14 : 20,
    color: "white",
  },
})
