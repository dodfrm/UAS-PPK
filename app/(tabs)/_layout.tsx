import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

//icon names
type TabIconName = "user"|"phone"|"users";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Define a common style for the tab bar
  const tabBarStyle = {
    backgroundColor:
      colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
    borderTopWidth: 0,
    paddingTop: 8,
    height: 70, 
  };

 const tabBarLabelStyle = {
   fontSize: 12,
   fontWeight: "600" as const,
   marginBottom: 5,
   marginTop: 5,
 };


  // Define common screen options
  const screenOptions = {
    tabBarActiveTintColor:
      colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint,
    tabBarInactiveTintColor:
      colorScheme === "dark" ? Colors.dark.gray : Colors.light.gray,
    tabBarStyle,
    tabBarLabelStyle,
    headerShown: false,
  };

  // Reusable tabs configuration
  const tabs: { name: string; title: string; icon: TabIconName }[] = [
    {
      name: "index",
      title: "Contact",
      icon: "phone",
    },
    {
      name: "groups",
      title: "Groups",
      icon: "users",
    },
    {
      name: "profile",
      title: "Profile",
      icon: "user",
    },
  ];

  return (
    <Tabs screenOptions={screenOptions}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Feather name={tab.icon} size={size || 24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
