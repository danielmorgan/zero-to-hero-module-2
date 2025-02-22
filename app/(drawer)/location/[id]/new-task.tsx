import colors from "@/constants/colors";
import { Task } from "@/types/interfaces";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Switch, TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
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

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={pickImage}
      >
        <Text style={[styles.buttonText, styles.secondary]}>
          {imageUri ? "Change Image" : "Add Image"}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity
        style={[styles.button, styles.primary]}
        onPress={handleSaveTask}
      >
        <Text style={[styles.buttonText, styles.primary]}>
          {taskId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>

      {taskId && (
        <TouchableOpacity
          style={[styles.button, styles.success]}
          onPress={handleFinishTask}
        >
          <Text style={[styles.buttonText, styles.success]}>Finish Task</Text>
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

  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    resizeMode: "contain",
  },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },

  primary: {
    backgroundColor: colors.primary,
    color: colors.primaryText,
  },
  secondary: {
    backgroundColor: colors.muted,
    color: colors.white,
  },
  success: {
    backgroundColor: colors.success,
    color: colors.successText,
  },
  danger: {
    backgroundColor: colors.danger,
    color: colors.dangerText,
  },
});
