import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

interface Contact {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  contactType: string;
}

interface Organization {
  id: number;
  organizationName: string;
  contacts: Contact[];
}

const groups = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const colorScheme = useColorScheme();

  // Sample data
  const organizations: Organization[] = [
    {
      id: 1,
      organizationName: "Bulstik",
      contacts: [
        {
          id: 1,
          fullName: "John Doe",
          phone: "+1 123-456-7890",
          email: "john.doe@example.com",
          contactType: "KETUA",
        },
        {
          id: 2,
          fullName: "Jane Doe",
          phone: "+1 123-456-7890",
          email: "john.doe@example.com",
          contactType: "WAKIL KETUA",
        },
      ],
    },
    {
      id: 2,
      organizationName: "Bimbel",
      contacts: [
        {
          id: 1,
          fullName: "John Doe",
          phone: "+1 123-456-7890",
          email: "john.doe@example.com",
          contactType: "KETUA",
        },
        {
          id: 2,
          fullName: "Jane Doe",
          phone: "+1 123-456-7890",
          email: "john.doe@example.com",
          contactType: "WAKIL KETUA",
        },
      ],
    },
  ];

  const renderOrganizationItem = ({ item }: { item: Organization }) => (
    <TouchableOpacity
      onPress={() => setSelectedOrg(item)}
      className="mt-3 flex-row items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <View className="h-14 w-14 rounded-full bg-blue-500 items-center justify-center mr-4">
        <Text className="text-white text-xl font-bold">
          {item.organizationName.charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">
          {item.organizationName}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {item.contacts.length} members
        </Text>
      </View>
      <Text className="text-gray-400 font-bold text-2xl pr-6">›</Text>
    </TouchableOpacity>
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity className="flex-row items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <View className="h-14 w-14 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center mr-4">
        <Text className="text-gray-600 dark:text-gray-300 text-xl font-semibold">
          {item.fullName
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("")}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.fullName}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {item.contactType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedOrg) {
    return (
      <View className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="bg-white dark:bg-gray-800 p-4 flex-row items-center border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={() => setSelectedOrg(null)}
            className="mr-4"
          >
            <Text className="text-blue-500 font-semibold text-lg">‹ Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl pl-4 py-2 font-bold text-gray-900 dark:text-white">
            {selectedOrg.organizationName}
          </Text>
        </View>
        <FlatList
          data={selectedOrg.contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
        <Text className="text-2xl py-2 font-bold text-center text-gray-900 dark:text-white">
          Groups
        </Text>
      </View>
      <FlatList
        data={organizations}
        renderItem={renderOrganizationItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default groups;
