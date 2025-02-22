import colors from "@/constants/colors";
import { Location } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  location: Location;
  onDelete: () => void;
};

const LocationListItem = ({ location, onDelete }: Props) => {
  const db = useSQLiteContext();

  const handleDelete = async () => {
    try {
      await db.runAsync(`DELETE FROM locations WHERE id = ?`, [location.id]);
      onDelete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{location.name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
};

export default LocationListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  deleteButton: {},
});
