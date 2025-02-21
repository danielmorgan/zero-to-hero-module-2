import LocationForm from "@/components/LocationForm";
import LocationListItem from "@/components/LocationListItem";
import { Location } from "@/types/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Page = () => {
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const locations = await db.getAllAsync<Location>(
        `SELECT * FROM locations`
      );
      setLocations(locations);
    } catch (error) {
      console.error(error);
    }
  };

  const addLocation = async (name: string) => {
    await db.runAsync(`INSERT INTO locations (name) VALUES (?)`, name);
    loadLocations();
  };

  return (
    <View style={styles.container}>
      <LocationForm onSubmit={addLocation} />

      <FlatList
        data={locations}
        renderItem={({ item }) => (
          <LocationListItem location={item} onDelete={loadLocations} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No locations added yet</Text>
        }
        style={{ marginTop: 16 }}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
});
