import colors from "@/constants/colors";
import { Task } from "@/types/interfaces";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Switch, TextInput } from "react-native-gesture-handler";

const NewTask = () => {
  const { id: locationId, taskId } = useLocalSearchParams<{
    id: string;
    taskId: string;
  }>();
  const router = useRouter();
  const db = useSQLiteContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      loadTaskData();
    }
  }, [taskId]);

  const loadTaskData = async () => {
    const task = await db.getFirstAsync<Task>(
      `SELECT * FROM tasks WHERE id = ?`,
      [Number(taskId)]
    );
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIsUrgent(!!task.isUrgent);
      setImageUri(task.imageUri);
    }
  };

  const handleSaveTask = async () => {
    let newTaskId = Number(taskId);

    if (taskId) {
      await db.runAsync(
        `UPDATE tasks SET locationId = ?, title = ?, description = ?, isUrgent = ?, imageUri = ? WHERE id = ?`,
        [
          Number(locationId),
          title,
          description,
          isUrgent ? 1 : 0,
          imageUri,
          Number(taskId),
        ]
      );
    } else {
      const result = await db.runAsync(
        `INSERT INTO tasks (locationId, title, description, isUrgent, imageUri) VALUES (?, ?, ?, ?, ?)`,
        [Number(locationId), title, description, isUrgent ? 1 : 0, imageUri]
      );
      newTaskId = result.lastInsertRowId;
    }

    if (isUrgent) {
      // Notifications
    }

    router.back();
  };

  const handleFinishTask = () => {
    Alert.alert("Finish task", "Are you sure you want to finish this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Finish",
        onPress: async () => {
          await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [Number(taskId)]);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.row}>
        <Text>Urgent</Text>
        <Switch
          value={isUrgent}
          onValueChange={setIsUrgent}
          trackColor={{ false: colors.muted, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
        <Text style={styles.buttonText}>
          {taskId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>

      {taskId && (
        <TouchableOpacity
          style={styles.successButton}
          onPress={handleFinishTask}
        >
          <Text style={styles.successButtonText}>Finish Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightgray,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.primaryText,
    fontWeight: "bold",
  },
  successButton: {
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  successButtonText: {
    color: colors.successText,
    fontWeight: "bold",
  },
});
