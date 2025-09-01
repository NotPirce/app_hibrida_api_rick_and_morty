import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Navbar({ navigation, route, back }) {
  const links = [
    { name: "Home", label: "Home" },
    { name: "Lista", label: "Lista" },
    { name: "Favoritos", label: "Favoritos" },
  ];

  const current = route?.name;

  return (
    <View style={styles.wrapper}>
      <View style={styles.left}>
        {back ? (
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>◀</Text>
          </Pressable>
        ) : null}
        <Text style={styles.brand}>Rick & Morty</Text>
      </View>

      <View style={styles.right}>
        {links.map((l) => {
          const active = current === l.name;
          return (
            <Pressable
              key={l.name}
              onPress={() => navigation.navigate(l.name)}
              style={[styles.navBtn, active && styles.navBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={`Ir a ${l.label}`}
            >
              <Text style={[styles.navTxt, active && styles.navTxtActive]}>
                {l.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  brand: { color: "#e5e7eb", fontSize: 16, fontWeight: "800" },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
  },
  backTxt: { color: "#e5e7eb", fontSize: 16 },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#0b1220",
  },
  navBtnActive: {
    backgroundColor: "#22c55e22",
    borderColor: "#22c55e55",
  },
  navTxt: { color: "#cbd5e1", fontWeight: "600" },
  navTxtActive: { color: "#22c55e" },
});
