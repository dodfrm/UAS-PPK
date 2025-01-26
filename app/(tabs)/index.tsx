import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

// Contact interface
interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const ContactApp = () => {
  const colorScheme = useColorScheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
      nameStartsWith: "",
      startingLetter: "",
    });

  // Fetch contacts from API
  //   useEffect(() => {
  //     const fetchContacts = async () => {
  //       try {
  //         const response = await axios.get("https://localhost:8080/api/contacts");
  //         setContacts(response.data);
  //         setFilteredContacts(response.data);
  //       } catch (error) {
  //         console.error("Error fetching contacts:", error);
  //       }
  //     };

  //     fetchContacts();
  //   }, []);
  useEffect(() => {
    const fetchContacts = async () => {
      // Dummy data
      const dummyData: Contact[] = [
        {
          id: 1,
          name: "Alice Johnson",
          phone: "123-456-7890",
          email: "alice@example.com",
        },
        {
          id: 2,
          name: "Bob Smith",
          phone: "987-654-3210",
          email: "bob@example.com",
        },
        {
          id: 3,
          name: "Charlie Brown",
          phone: "456-789-1230",
          email: "charlie@example.com",
        },
        {
          id: 4,
          name: "Diana Prince",
          phone: "321-654-9870",
          email: "diana@example.com",
        },
        {
          id: 5,
          name: "Eve Adams",
          phone: "654-321-0987",
          email: "eve@example.com",
        },
        {
          id: 6,
          name: "Frank Ocean",
          phone: "111-222-3333",
          email: "frank@example.com",
        },
        {
          id: 7,
          name: "Grace Hopper",
          phone: "444-555-6666",
          email: "grace@example.com",
        },
        {
          id: 8,
          name: "Hank Moody",
          phone: "777-888-9999",
          email: "hank@example.com",
        },
        {
          id: 9,
          name: "Ivy Carter",
          phone: "123-987-6543",
          email: "ivy@example.com",
        },
        {
          id: 10,
          name: "Jack Sparrow",
          phone: "456-321-7890",
          email: "jack@example.com",
        },
        {
          id: 11,
          name: "Karen Page",
          phone: "555-666-7777",
          email: "karen@example.com",
        },
        {
          id: 12,
          name: "Leo Messi",
          phone: "888-999-1111",
          email: "leo@example.com",
        },
        {
          id: 13,
          name: "Mia Wallace",
          phone: "222-333-4444",
          email: "mia@example.com",
        },
        {
          id: 14,
          name: "Nathan Drake",
          phone: "999-111-2222",
          email: "nathan@example.com",
        },
        {
          id: 15,
          name: "Olivia Benson",
          phone: "321-987-6540",
          email: "olivia@example.com",
        },
        {
          id: 16,
          name: "Paul Walker",
          phone: "654-123-0987",
          email: "paul@example.com",
        },
        {
          id: 17,
          name: "Quinn Fabray",
          phone: "456-654-1230",
          email: "quinn@example.com",
        },
        {
          id: 18,
          name: "Rachel Green",
          phone: "321-789-4560",
          email: "rachel@example.com",
        },
        {
          id: 19,
          name: "Steve Rogers",
          phone: "789-123-4567",
          email: "steve@example.com",
        },
        {
          id: 20,
          name: "Tony Stark",
          phone: "987-654-3211",
          email: "tony@example.com",
        },
        {
          id: 21,
          name: "Uma Thurman",
          phone: "654-987-1234",
          email: "uma@example.com",
        },
        {
          id: 22,
          name: "Victor Hugo",
          phone: "111-999-8888",
          email: "victor@example.com",
        },
        {
          id: 23,
          name: "Wendy Darling",
          phone: "222-888-4444",
          email: "wendy@example.com",
        },
        {
          id: 24,
          name: "Xander Cage",
          phone: "333-777-5555",
          email: "xander@example.com",
        },
        {
          id: 25,
          name: "Yvonne Strahovski",
          phone: "444-666-2222",
          email: "yvonne@example.com",
        },
        {
          id: 26,
          name: "Zara Phillips",
          phone: "555-444-3333",
          email: "zara@example.com",
        },
        {
          id: 27,
          name: "Aaron Paul",
          phone: "666-333-1111",
          email: "aaron@example.com",
        },
        {
          id: 28,
          name: "Brianna Taylor",
          phone: "777-111-9999",
          email: "brianna@example.com",
        },
        {
          id: 29,
          name: "Carl Grimes",
          phone: "888-222-5555",
          email: "carl@example.com",
        },
        {
          id: 30,
          name: "Daryl Dixon",
          phone: "999-333-4444",
          email: "daryl@example.com",
        },
        {
          id: 31,
          name: "Eleanor Rigby",
          phone: "111-444-6666",
          email: "eleanor@example.com",
        },
        {
          id: 32,
          name: "Fiona Gallagher",
          phone: "222-555-7777",
          email: "fiona@example.com",
        },
        {
          id: 33,
          name: "George Bailey",
          phone: "333-666-8888",
          email: "george@example.com",
        },
        {
          id: 34,
          name: "Hannah Montana",
          phone: "444-777-9999",
          email: "hannah@example.com",
        },
        {
          id: 35,
          name: "Isabel Lucas",
          phone: "555-888-1111",
          email: "isabel@example.com",
        },
        {
          id: 36,
          name: "Jake Peralta",
          phone: "666-999-2222",
          email: "jake@example.com",
        },
        {
          id: 37,
          name: "Katherine Pierce",
          phone: "777-111-3333",
          email: "katherine@example.com",
        },
        {
          id: 38,
          name: "Liam Hemsworth",
          phone: "888-333-5555",
          email: "liam@example.com",
        },
        {
          id: 39,
          name: "Megan Fox",
          phone: "999-555-7777",
          email: "megan@example.com",
        },
        {
          id: 40,
          name: "Nancy Drew",
          phone: "111-777-9999",
          email: "nancy@example.com",
        },
        {
          id: 41,
          name: "Oscar Wilde",
          phone: "222-999-1111",
          email: "oscar@example.com",
        },
        {
          id: 42,
          name: "Penny Lane",
          phone: "333-111-2222",
          email: "penny@example.com",
        },
        {
          id: 43,
          name: "Quincy Adams",
          phone: "444-222-3333",
          email: "quincy@example.com",
        },
        {
          id: 44,
          name: "Rose Tyler",
          phone: "555-333-4444",
          email: "rose@example.com",
        },
        {
          id: 45,
          name: "Sam Winchester",
          phone: "666-444-5555",
          email: "sam@example.com",
        },
        {
          id: 46,
          name: "Tina Fey",
          phone: "777-555-6666",
          email: "tina@example.com",
        },
        {
          id: 47,
          name: "Ursula Le Guin",
          phone: "888-666-7777",
          email: "ursula@example.com",
        },
        {
          id: 48,
          name: "Violet Beauregarde",
          phone: "999-777-8888",
          email: "violet@example.com",
        },
        {
          id: 49,
          name: "Walter White",
          phone: "111-888-9999",
          email: "walter@example.com",
        },
        {
          id: 50,
          name: "Xena Warrior",
          phone: "222-999-1111",
          email: "xena@example.com",
        },
      ];
      setContacts(dummyData);
      setFilteredContacts(dummyData);
    };

    fetchContacts();
  }, []);

  // Search functionality
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    applyFilters(text);
  };

  // Filter functionality
  const applyFilters = (searchText: string = searchTerm) => {
    let result = contacts;

    // Apply search filter
    if (searchText) {
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.phone.includes(searchText)
      );
    }

    // Apply name starts with filter
    if (filterCriteria.nameStartsWith) {
      result = result.filter((contact) =>
        contact.name
          .toLowerCase()
          .startsWith(filterCriteria.nameStartsWith.toLowerCase())
      );
    }

    // Apply starting letter filter
    if (filterCriteria.startingLetter) {
      result = result.filter((contact) =>
        contact.name
          .toLowerCase()
          .startsWith(filterCriteria.startingLetter.toLowerCase())
      );
    }

    setFilteredContacts(result);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterCriteria({
      nameStartsWith: "",
      startingLetter: "",
    });
    setFilteredContacts(contacts);
    setSearchTerm("");
  };

  // Open contact details modal
  const openContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  // Render contact item
  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 dark:border-gray-700"
      onPress={() => openContactDetails(item)}
    >
      <Text className="text-lg font-semibold text-black dark:text-white">
        {item.name}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400">{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-black">
      {/* Search Bar with Feather Icon */}
      <View className="flex-row items-center rounded-xl mb-4 px-3 py-3">
        <TextInput
          className="flex-1 text-black text-lg pl-4 dark:text-white bg-white dark:bg-gray-800 border border-gray-700 rounded-xl"
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

      {/* Rest of the component remains the same */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 dark:text-gray-400">
            No contacts found
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
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 h-1/2">
            {/* Close Button */}
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
                      {selectedContact.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold mt-4 text-black dark:text-white">
                    {selectedContact.name}
                  </Text>
                </View>

                {/* Contact Details */}
                <View className="space-y-4">
                  <View className="flex-row items-center">
                    <Feather
                      name="phone"
                      size={20}
                      className="mr-4 text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-lg text-black dark:text-white">
                      {selectedContact.phone}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather
                      name="mail"
                      size={20}
                      className="mr-4 text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-lg text-black dark:text-white">
                      {selectedContact.email}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 h-1/2">
            {/* Close Button */}
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

            <Text className="text-xl font-bold mb-4 text-black dark:text-white">
              Filter Contacts
            </Text>

            {/* Name Starts With Filter */}
            <View className="mb-4">
              <Text className="text-black dark:text-white mb-2">
                Names Starting With:
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-xl p-2 text-black dark:text-white"
                value={filterCriteria.nameStartsWith}
                onChangeText={(text) => {
                  setFilterCriteria((prev) => ({
                    ...prev,
                    nameStartsWith: text,
                  }));
                  applyFilters();
                }}
                placeholder="Enter first letters"
              />
            </View>

            {/* Starting Letter Filter */}
            <View className="mb-4">
              <Text className="text-black dark:text-white mb-2">
                Starting Letter:
              </Text>
              <View className="flex-row flex-wrap">
                {[
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                  "M",
                  "N",
                  "O",
                  "P",
                  "Q",
                  "R",
                  "S",
                  "T",
                  "U",
                  "V",
                  "W",
                  "X",
                  "Y",
                  "Z",
                ].map((letter) => (
                  <TouchableOpacity
                    key={letter}
                    onPress={() => {
                      setFilterCriteria((prev) => ({
                        ...prev,
                        startingLetter:
                          filterCriteria.startingLetter === letter
                            ? ""
                            : letter,
                      }));
                      applyFilters();
                    }}
                    className={`p-2 m-1 rounded ${
                      filterCriteria.startingLetter === letter
                        ? "bg-blue-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <Text
                      className={`text-center ${
                        filterCriteria.startingLetter === letter
                          ? "text-white"
                          : "text-black dark:text-white"
                      }`}
                    >
                      {letter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reset Filters Button */}
            <TouchableOpacity
              onPress={resetFilters}
              className="bg-red-500 rounded-xl p-3 mt-4"
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
