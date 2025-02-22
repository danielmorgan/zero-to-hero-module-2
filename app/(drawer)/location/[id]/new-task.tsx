import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const NewTask = () => {
  const { id: locationId, taskId } = useLocalSearchParams<{
    id: string;
    taskId: string;
  }>();
  console.log({ locationId, taskId });
  return (
    <View>
      <Text>NewTask</Text>
    </View>
  );
};

export default NewTask;

const styles = StyleSheet.create({});
