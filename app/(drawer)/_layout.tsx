import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            title: "Manage locations",
          }}
        />
        <Drawer.Screen name="location" />
      </Drawer>
    </GestureHandlerRootView>
  );
}
