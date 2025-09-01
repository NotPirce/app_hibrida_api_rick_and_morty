import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const API = "https://rickandmortyapi.com/api";

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({
    characters: null,
    episodes: null,
    locations: null,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [ch, ep, loc] = await Promise.all([
          fetch(`${API}/character`).then((r) => r.json()),
          fetch(`${API}/episode`).then((r) => r.json()),
          fetch(`${API}/location`).then((r) => r.json()),
        ]);
        setStats({
          characters: ch?.info?.count ?? 0,
          episodes: ep?.info?.count ?? 0,
          locations: loc?.info?.count ?? 0,
        });
      } catch {
        setErr("No se pudieron cargar las estadísticas de la API");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick & Morty</Text>
      <Text style={styles.subtitle}>
        App de ejemplo con React Native + Expo. Consumimos la API pública de
        Rick & Morty para listar personajes, ver detalles y guardar favoritos.
      </Text>

      <View style={styles.statsRow}>
        {loading ? (
          <ActivityIndicator />
        ) : err ? (
          <Text style={styles.error}>{err}</Text>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardNum}>{stats.characters}</Text>
              <Text style={styles.cardLbl}>Personajes</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardNum}>{stats.episodes}</Text>
              <Text style={styles.cardLbl}>Episodios</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardNum}>{stats.locations}</Text>
              <Text style={styles.cardLbl}>Ubicaciones</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.ctas}>
        <Pressable
          style={({ pressed }) => [
            styles.btnPrimary,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate("Lista")}
        >
          <Text style={styles.btnPrimaryTxt}>Explorar Listado</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.btnSecondary,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate("Favoritos")}
        >
          <Text style={styles.btnSecondaryTxt}>Ver Favoritos</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        Fuente de datos: Rick and Morty API — GET /character, /episode,
        /location
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center" },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    flexWrap: "wrap",
  },
  card: {
    width: 110,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  cardNum: { fontSize: 22, fontWeight: "900" },
  cardLbl: { fontSize: 12, color: "#6b7280" },

  ctas: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#22c55e",
  },
  btnPrimaryTxt: { color: "#052e16", fontWeight: "800" },
  btnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  btnSecondaryTxt: { color: "#16a34a", fontWeight: "800" },
  pressed: { opacity: 0.9 },

  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
  },
});
