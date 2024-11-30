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
        <View style={styles.loginView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
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
                    placeholder="Email ou usuario"
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
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry={true}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                  />
                )}
                name="password" // Corrigido para "password"
                rules={{ required: "Insira uma senha valida" }}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>} // Corrigido para "password"

              <View style={styles.forgotPassword}>
                <Pressable onPress={forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Esqueci a senha <Lock height={10} /></Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={styles.loginButtonContainer}>
            <Pressable style={styles.pressable} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.loginButtonText}>
                Continuar
              </Text>
              <Ionicons size={14} name="chevron-forward" color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  loginView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between', // Para garantir que o conteúdo ocupe o espaço
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: "100%",
  },
