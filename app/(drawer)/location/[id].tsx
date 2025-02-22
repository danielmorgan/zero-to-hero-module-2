import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const Location = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Location: {id}</Text>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({});
