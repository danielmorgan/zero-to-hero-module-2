import colors from "@/constants/colors";
import { Task } from "@/types/interfaces";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  task: Task;
};

const TaskListItem = ({ task }: Props) => {
  return (
    <Link
      href={`/location/${task.locationId}/new-task?taskId=${task.id}`}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.iconsContainer}>
            <Text>{task.isUrgent ? "⚠️" : "○"}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TaskListItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
    backgroundColor: "#fff",
    gap: 16,
  },
  iconsContainer: {
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: colors.muted,
  },
});
