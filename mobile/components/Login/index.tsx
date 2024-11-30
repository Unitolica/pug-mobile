import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Text,
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

import Lock from "@/assets/images/lock.svg";
import Stundents from "@/assets/images/students.svg";

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
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.loginView}>
          <View style={styles.container}>
            <View style={styles.circleBackground} />
            <View style={styles.imageContainer}>
              <Stundents style={styles.students} />
            </View>

            <View style={styles.welcomeWrapper}>
              <Text style={styles.welcomeText}>Bem-vindo!</Text>
              <Text style={styles.loginText}>Faça seu login abaixo</Text>
            </View>

            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="nome.sobrenome@catolicasc.edu.br"
                  placeholderTextColor="gray"
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                />
              )}
              name="email"
              rules={{
                required: "Voce precisa inserir um email",
                pattern: {
                  value: /^(?!.*@(?!(catolicasc\.edu\.br))).*$/i,
                  message: "Insira um nome de usuario ou email com dominio valido (@catolicasc.edu.br)"
                }
              }}
            />

            {!!errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}

            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                />
              )}
              name="name"
              rules={{ required: "Insira uma senha valida" }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}

            <View style={styles.forgotPassword}>
              <Pressable onPress={forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueci a senha <Lock height={10} /></Text>
              </Pressable>
            </View>
          </View>
          <View style={{ paddingHorizontal: 32 }}>
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

const styles = StyleSheet.create({
  loginView: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  circleBackground: {
    position: 'absolute',
    top: 110,
    left: '80%',
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: 'black',
    transform: [{ translateX: -200 }],
  },
  imageContainer: {
    width: 340,
    height: 400,
    borderRadius: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  students: {
    width: '90%',
    height: '100%',
    objectFit: 'contain',
  },
  welcomeWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: Platform.OS === "android" ? 24 : 32,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: Platform.OS === "android" ? 14 : 20,
    fontWeight: "bold",
    color: "red",
  },
  input: {
    height: Platform.OS === "android" ? 25 : 40,
    fontSize: Platform.OS === "android" ? 14 : 12,
    borderColor: "black",
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
    paddingHorizontal: 20,
    marginTop: `auto`,
    backgroundColor: Colors.light.primary,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginBottom: 70,
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

