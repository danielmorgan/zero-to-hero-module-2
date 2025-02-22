import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Location } from "@/types/interfaces";
import Logo from "@/assets/images/logo.png";
import colors from "@/constants/colors";

const db = SQLite.openDatabaseSync("reports.db");

const LOGO_URI = Image.resolveAssetSource(Logo).uri;

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const db = SQLite.useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const isDrawerOpen = useDrawerStatus();
  const pathName = usePathname();

  useEffect(() => {
    if (isDrawerOpen) {
      loadLocations();
    }
  }, [isDrawerOpen]);

  const loadLocations = async () => {
    try {
      const locations = await db.getAllAsync<Location>(
        `SELECT * FROM locations`
      );
      setLocations(locations);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <Image source={{ uri: LOGO_URI }} style={styles.logo} />
        <DrawerItemList {...props} />
        <View style={styles.locationContainer}>
          <Text style={styles.title}>Locations</Text>
          {locations.map((location) => {
            const isActive = pathName === `/location/${location.id}`;

            return (
              <DrawerItem
                key={location.id}
                label={location.name}
                onPress={() => router.navigate(`/location/${location.id}`)}
                focused={isActive}
                activeTintColor={colors.primary}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View style={[styles.footer, { paddingBottom: 20 + bottom }]}>
        <Text style={styles.footerText}>&copy; Daniel Morgan 2025</Text>
      </View>
    </View>
  );
};

export default function Layout() {
  useDrizzleStudio(db);

  return (
    <GestureHandlerRootView>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: colors.primary,
        }}
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Manage Locations",
          }}
        />
        <Drawer.Screen
          name="location"
          options={{
            drawerItemStyle: { display: "none" },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 32,
  },
  locationContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 16,
    color: colors.muted,
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.lightgray,
    paddingTop: 16,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
  },
});
