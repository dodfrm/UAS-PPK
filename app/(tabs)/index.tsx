import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

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
  contactSubject: {
    id: number;
    subject: {
      id: number;
      subjectName: string;
    }[];
  }[];
}

const ContactApp = () => {
  const colorScheme = useColorScheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Unique filter options
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);
  const [uniqueJabatan, setUniqueJabatan] = useState<string[]>([]);
  const [uniqueContactTypes, setUniqueContactTypes] = useState<string[]>([]);

  const [filterCriteria, setFilterCriteria] = useState({
    subjectName: "",
    jabatan: "",
    contactType: "",
  });

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
        contactSubject: [
          {
            id: 1,
            subject: [
              {
                id: 1,
                subjectName: "Pemrograman Mobile",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        fullName: "Andi Wijaya",
        phone: "08134567890",
        email: "andi.wijaya@stis.ac.id",
        contactType: "DOSEN",
        contactOrganizations: [
          {
            id: 2,
            kelas: "3SI2",
            jabatan: "WALI KELAS",
            periodeJabatan: "2023/2024",
          },
        ],
        contactSubject: [
          {
            id: 2,
            subject: [
              {
                id: 2,
                subjectName: "Data Science",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        fullName: "Siti Nurhaliza",
        phone: "08155678901",
        email: "siti.nurhaliza@stis.ac.id",
        contactType: "STAFF",
        contactOrganizations: [
          {
            id: 3,
            kelas: "Admin",
            jabatan: "SEKRETARIS",
            periodeJabatan: "2022/2023",
          },
        ],
        contactSubject: [],
      },
      {
        id: 4,
        fullName: "Budi Santoso",
        phone: "08167890123",
        email: "budi.santoso@stis.ac.id",
        contactType: "ALUMNI",
        contactOrganizations: [
          {
            id: 4,
            kelas: "3SI3",
            jabatan: "ANGGOTA",
            periodeJabatan: "2021/2022",
          },
        ],
        contactSubject: [
          {
            id: 3,
            subject: [
              {
                id: 3,
                subjectName: "Matematika Terapan",
              },
              {
                id: 4,
                subjectName: "Statistik Inferensial",
              },
            ],
          },
        ],
      },
    ];

    setContacts(dummyData);
    setFilteredContacts(dummyData);

    // Extract unique filter options
    const subjects = [
      ...new Set(
        dummyData.flatMap((contact) =>
          contact.contactSubject.flatMap((cs) =>
            cs.subject.map((s) => s.subjectName)
          )
        )
      ),
    ];

    const jabatan = [
      ...new Set(
        dummyData.flatMap((contact) =>
          contact.contactOrganizations.map((org) => org.jabatan)
        )
      ),
    ];

    const contactTypes = [
      ...new Set(dummyData.map((contact) => contact.contactType)),
    ];

    setUniqueSubjects(subjects);
    setUniqueJabatan(jabatan);
    setUniqueContactTypes(contactTypes);
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    applyFilters(text);
  };

  const applyFilters = (searchText: string = searchTerm) => {
    let result = contacts;

    if (searchText) {
      result = result.filter(
        (contact) =>
          contact.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.phone.includes(searchText)
      );
    }

    if (filterCriteria.subjectName) {
      result = result.filter((contact) =>
        contact.contactSubject.some((cs) =>
          cs.subject.some((s) => s.subjectName === filterCriteria.subjectName)
        )
      );
    }

    if (filterCriteria.jabatan) {
      result = result.filter((contact) =>
        contact.contactOrganizations.some(
          (org) => org.jabatan === filterCriteria.jabatan
        )
      );
    }

    if (filterCriteria.contactType) {
      result = result.filter(
        (contact) => contact.contactType === filterCriteria.contactType
      );
    }

    setFilteredContacts(result);
  };

  const resetFilters = () => {
    setFilterCriteria({
      subjectName: "",
      jabatan: "",
      contactType: "",
    });
    setFilteredContacts(contacts);
    setSearchTerm("");
  };

  const renderFilterDropdown = (
    title: string,
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => (
    <View className="mb-4">
      <Text className="text-black dark:text-white mb-2">{title}:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option === currentValue ? "" : option)}
            className={`p-2 m-1 rounded ${
              currentValue === option
                ? "bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-center ${
                currentValue === option
                  ? "text-white"
                  : "text-black dark:text-white"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Open contact details modal
  const openContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  // Render contact item
  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border border-gray-200 rounded-3xl bg-white shadow-md dark:bg-gray-800 dark:border-gray-700 mb-3"
      onPress={() => openContactDetails(item)}
    >
      {/* Avatar */}
      <View className="w-14 h-14 bg-blue-200 rounded-full items-center justify-center mr-4">
        <Text className="text-2xl font-bold text-blue-800">
          {item.fullName
            .split(" ") 
            .map((word) => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("")}
        </Text>
      </View>

      {/* Contact Info */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-black dark:text-white">
          {item.fullName}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-300">
          {item.contactType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
      {/* Search Bar */}
      <View className="flex-row items-center rounded-3xl mb-4 px-3 py-3">
        <TextInput
          className="flex-1 text-black text-lg pl-4 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl"
          placeholder="Search contacts..."
          placeholderTextColor={colorScheme === "dark" ? "#888" : "#000000"}
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <Feather
          name="search"
          size={24}
          color={colorScheme === "dark" ? "#888" : "#666"}
          className="mx-4 ml-6"
        />
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          className="ml-2"
        >
          <Feather
            name="filter"
            size={24}
            color={colorScheme === "dark" ? "#888" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="text-center pt-56 text-xl font-semibold text-gray-500 dark:text-gray-400">
            Opps!! No contacts found
          </Text>
        }
      />

      {/* Contact Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-3xl p-6 h-1/2">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={() => setModalVisible(false)}
            >
              <Feather
                name="x"
                size={28}
                color={colorScheme === "dark" ? "#888" : "#000000"}
                className="text-black dark:text-white"
              />
            </TouchableOpacity>

            {selectedContact && (
              <View className="mt-8">
                {/* Profile Header */}
                <View className="items-center mb-6">
                  <View className="w-24 h-24 bg-blue-200 rounded-full items-center justify-center">
                    <Text className="text-3xl font-bold text-blue-800">
                      {selectedContact.fullName
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .slice(0, 2)
                        .join("")}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold mt-4 text-black dark:text-white">
                    {selectedContact.fullName}
                  </Text>
                  <Text className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedContact.contactType}
                  </Text>
                </View>

                {/* Contact Details */}
                <View className="space-y-4 px-3">
                  <View className="flex-row items-center mb-3">
                    <Feather
                      name="phone"
                      size={24}
                      color={colorScheme === "dark" ? "#888" : "#000000"}
                      className="mr-4 text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-lg text-black dark:text-white">
                      {selectedContact.phone}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Feather
                      name="mail"
                      size={24}
                      color={colorScheme === "dark" ? "#888" : "#000000"}
                      className="mr-4 text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-lg text-black dark:text-white">
                      {selectedContact.email}
                    </Text>
                  </View>

                  {/* Organizations */}
                  {selectedContact.contactOrganizations.map((org) => (
                    <View key={org.id} className="flex-row items-center mb-3">
                      <Feather
                        name="users"
                        size={24}
                        color={colorScheme === "dark" ? "#888" : "#000000"}
                        className="mr-4 text-gray-600 dark:text-gray-300"
                      />
                      <Text className="text-lg text-black dark:text-white">
                        {org.kelas} - {org.jabatan} ({org.periodeJabatan})
                      </Text>
                    </View>
                  ))}

                  {/* Subjects */}
                  {selectedContact.contactSubject.map((cs) => (
                    <View key={cs.id} className="flex-row items-center mb-3">
                      <Feather
                        name="book"
                        size={24}
                        color={colorScheme === "dark" ? "#888" : "#000000"}
                        className="mr-4 text-gray-600 dark:text-gray-300"
                      />
                      <Text className="text-lg text-black dark:text-white">
                        {cs.subject.map((s) => s.subjectName).join(", ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for Filters */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 h-1/2 pt-12 px-8">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={() => setFilterModalVisible(false)}
            >
              <Feather
                name="x"
                size={28}
                color={colorScheme === "dark" ? "#888" : "#000000"}
                className="text-black dark:text-white"
              />
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-4 text-black dark:text-white">
              Filter Contacts
            </Text>

            {renderFilterDropdown(
              "Mata Kuliah",
              uniqueSubjects,
              filterCriteria.subjectName,
              (value) => {
                setFilterCriteria((prev) => ({ ...prev, subjectName: value }));
                applyFilters();
              }
            )}

            {renderFilterDropdown(
              "Jabatan",
              uniqueJabatan,
              filterCriteria.jabatan,
              (value) => {
                setFilterCriteria((prev) => ({ ...prev, jabatan: value }));
                applyFilters();
              }
            )}

            {renderFilterDropdown(
              "Contact Type",
              uniqueContactTypes,
              filterCriteria.contactType,
              (value) => {
                setFilterCriteria((prev) => ({ ...prev, contactType: value }));
                applyFilters();
              }
            )}

            <TouchableOpacity
              onPress={resetFilters}
              className="bg-red-500 rounded-2xl p-3 mt-4"
            >
              <Text className="text-white text-center">Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContactApp;
