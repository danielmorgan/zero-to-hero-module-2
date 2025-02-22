import colors from "@/constants/colors";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  onSubmit: (name: string) => void;
};

const LocationForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
      setName("");
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.button}>Add Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationForm;

const styles = StyleSheet.create({
  formContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightgray,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.primaryText,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: "center",
    borderRadius: 8,
  },
});
