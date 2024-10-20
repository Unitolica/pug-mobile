import { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Button,
  Image,
  Modal,
  Pressable
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useAuth } from "@/context/auth"
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "../navigation/TabBarIcon";

export function Login() {
  const { login } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit (data) {
    await login(data.email, data.password)
  };

  function forgotPassword () {
    console.log('Esqueceu a senha')
  }

  return (
    <SafeAreaView style={styles.loginView}>
      <View style={styles.container}>
        {/*
        <View style={styles.imageContainer}>
          <View style={styles.imageCircle}>
            <Image
              source={require("@/assets/images/students.png")}
              style={styles.students}
            />
          </View>
        </View>
        */}

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
            <Text>Esqueci a senha</Text>
          </Pressable>
        </View>


        <View style={styles.loginButton}>
          <Pressable style={styles.pressable} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.loginButtonText}>
              Continuar
            </Text>
            <TabBarIcon name="chevron-forward" color="white" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

function ForgotPasswordAlertModal() {
  return (
    <Modal>
    </Modal>
  )
}

const stylesAlertModal = StyleSheet.create({
  container: {
  }
})

const styles = StyleSheet.create({
  loginView: {
    justifyContent: "center",
    flex: 1,
    padding: 32,
  },
  container: {
    flex: 1
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
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
    alignSelf: "flex-end",
  },
  loginButton: {
    marginTop: 20,
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
    color: "white",
  },
})
