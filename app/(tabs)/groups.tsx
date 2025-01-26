import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
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
  contactOrganizations: {
    id: number;
    kelas: string;
    jabatan: string;
    periodeJabatan: string;
  }[];
}

const groups = () => {
  const colorScheme = useColorScheme();
  const [contactGroups, setContactGroups] = useState<{
    [key: string]: Contact[];
  }>({});

  useEffect(() => {
    const dummyData: Contact[] = [
      {
        id: 1,
        fullName: "Dodi Firmansyah",
        phone: "08123456789",
        email: "222212572@stis.ac.id",
        contactType: "MAHASISWA",
        contactOrganizations: [
          {
            id: 1,
            kelas: "3SI1",
            jabatan: "KETUA",
            periodeJabatan: "2024/2025",
          },
        ],
      },
      
    ];

    // Group by contact type
    const typeGroups = dummyData.reduce((acc, contact) => {
      const key = contact.contactType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(contact);
      return acc;
    }, {} as { [key: string]: Contact[] });

    // Group by jabatan
    const jabatanGroups = dummyData.reduce((acc, contact) => {
      const jabatan = contact.contactOrganizations[0]?.jabatan || "Unknown";
      const key = `Jabatan: ${jabatan}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(contact);
      return acc;
    }, {} as { [key: string]: Contact[] });

    setContactGroups({ ...typeGroups, ...jabatanGroups });
  }, []);

  const renderGroupHeader = (title: string) => (
    <Text className="text-xl font-bold p-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
      {title}
    </Text>
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity className="p-4 border-b border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-semibold text-black dark:text-white">
        {item.fullName}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400">{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-black">
      <Text className="pt-4 text-3xl text-center font-bold text-gray-900 dark:text-white">
        Groups
      </Text>

      <FlatList
        data={Object.entries(contactGroups)}
        keyExtractor={([title]) => title}
        renderItem={({ item: [title, contacts] }) => (
          <View>
            {renderGroupHeader(title)}
            <FlatList
              data={contacts}
              renderItem={renderContactItem}
              keyExtractor={(contact) => contact.id.toString()}
            />
          </View>
        )}
      />
    </View>
  );
};

export default groups;
