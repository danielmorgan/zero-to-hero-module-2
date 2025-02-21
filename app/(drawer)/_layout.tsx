import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const db = SQLite.openDatabaseSync("reports.db");

export default function Layout() {
  useDrizzleStudio(db);

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
