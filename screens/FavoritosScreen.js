import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { getFavorites } from "../storage/favoritos";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoritosScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const favs = await getFavorites();
    setData(favs);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Detalles", { character: item })}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: 64, height: 64, borderRadius: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
        <Text style={{ color: "#6b7280" }}>
          {item.status} • {item.species}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", marginTop: 24, color: "#6b7280" }}
          >
            Aún no tienes favoritos.
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
