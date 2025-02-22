import TaskListItem from "@/components/TaskListItem";
import colors from "@/constants/colors";
import { Location, Task } from "@/types/interfaces";
import {
  Link,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LocationPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [locationName, setLocationName] = useState<string>("");

  const loadLocationData = useCallback(async () => {
    const location = await db.getFirstAsync<Location>(
      `SELECT * FROM locations WHERE id = ?`,
      [Number(id)]
    );
    if (location) {
      setLocationName(location.name);
    }

    const tasks = await db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE locationId = ?`,
      [Number(id)]
    );
    setTasks(tasks);
  }, [id, db]);

  useFocusEffect(
    useCallback(() => {
      loadLocationData();
    }, [loadLocationData])
  );

  return (
    <>
      <Stack.Screen options={{ title: locationName || "Tasks" }} />

      <View style={styles.container}>
        <FlatList
          data={tasks}
          renderItem={({ item }) => <TaskListItem task={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyList}>No tasks found</Text>
          }
        />
        <Link href={`/location/${id}/new-task`} asChild>
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyList: {
    paddingVertical: 16,
    color: colors.muted,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: colors.primaryText,
    fontSize: 24,
  },
});
