import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { Login } from "@/components/Login";
// import { SQLiteProvider } from "expo-sqlite";
// import { initializeDatabase } from "@/database/initDatabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function TabLayout() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || !user) {
    return <Login />
  }

  return (
    <>
      {/* <SQLiteProvider databaseName={`${user?.id}-local-database.db`} onInit={initializeDatabase}> */}
      <QueryClientProvider client={queryClient}>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              backgroundColor: Colors.light.primary
            }
          }}>
          <Tabs.Screen
            name="explore"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? "search" : "search-outline"} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Configuracoes",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />
              ),
            }}
          />
        </Tabs>
      </QueryClientProvider>
      {/* </SQLiteProvider> */}
    </>
  );
}
