import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import { isFavorite, toggleFavorite } from "../storage/favoritos";

export default function DetallesScreen({ route }) {
  const { character } = route.params;
  const [fav, setFav] = useState(false);

  //Preguntamos al almacenamiento si ese personaje esta en favoritos
  useEffect(() => {
    (async () => setFav(await isFavorite(character.id)))();
  }, [character.id]);

  // Agrega o quita un personaje de favoritos
  const onToggle = async () => {
    const nowFav = await toggleFavorite(character);
    setFav(nowFav);
    Alert.alert(nowFav ? "Añadiendo a favoritos" : "Eliminado de favoritos");
  };

  return (
    <View style={{ flex: 1, padding: 16, alignItems: "center", gap: 8 }}>
      <Image
        source={{ uri: character.image }}
        style={{ width: 220, height: 220, borderRadius: 12 }}
      />
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>{character.name}</Text>
      <Text>
        {character.status} • {character.species}
      </Text>
      {character.type ? <Text>Tipo: {character.type}</Text> : null}
      <Text>Género: {character.gender}</Text>
      <Text>Origen: {character.origin?.name}</Text>
      <Text>Ubicación: {character.location?.name}</Text>

      <View style={{ marginTop: 12, width: "100%" }}>
        <Button
          title={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
          onPress={onToggle}
        />
      </View>
    </View>
  );
}
