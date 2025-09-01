import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import {
  getLastSearch,
  setLastSearch,
  getRecentSearches,
  addRecentSearch,
} from "../storage/favoritos";

const API = "https://rickandmortyapi.com/api";
const STATUSES = ["alive", "dead", "unknown"];
const GENDERS = ["female", "male", "genderless", "unknown"];

export default function ListScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState(null);
  const [gender, setGender] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [data, setData] = useState([]);

  const [recent, setRecent] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const abortRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 450);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    (async () => {
      const last = await getLastSearch();
      const r = await getRecentSearches();
      setRecent(r);
      setQuery(last || "");
      setDebouncedQuery(last || "");
      setPage(1);
    })();
  }, []);

  useEffect(() => {
    load(true, 1, debouncedQuery, status, gender);
  }, [debouncedQuery, status, gender]);

  const load = async (reset = false, pageArg, qArg, statusArg, genderArg) => {
    if (loading && !reset) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : pageArg ?? page;
      const q = (qArg ?? query)?.trim();
      const s = statusArg ?? status;
      const g = genderArg ?? gender;

      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      if (q) params.append("name", q);
      if (s) params.append("status", s);
      if (g) params.append("gender", g);

      const res = await fetch(`${API}/character?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        if (res.status === 404) {
          setData(reset ? [] : currentPage === 1 ? [] : data);
          setHasNext(false);
          setPage(currentPage);
          setError("Sin resultados");
        } else {
          throw new Error("Error al cargar");
        }
      } else {
        const json = await res.json();
        setHasNext(Boolean(json.info?.next));
        if (reset) setData(json.results);
        else setData((prev) => [...prev, ...json.results]);
        setPage(currentPage);
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        setError("No se pudo cargar la información");
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  };

  const onSearch = async () => {
    await setLastSearch(query);
    await addRecentSearch(query);
    const r = await getRecentSearches();
    setRecent(r);
    load(true, 1, query, status, gender);
  };

  const onLoadMore = async () => {
    if (!hasNext || loading) return;
    const nextPage = page + 1;
    await load(false, nextPage, debouncedQuery, status, gender);
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

  const Chip = ({ label, active, onPress }) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: active ? "#22c55e" : "#e5e7eb",
        backgroundColor: active ? "#22c55e22" : "#f9fafb",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text
        style={{ color: active ? "#16a34a" : "#111827", fontWeight: "600" }}
      >
        {label}
      </Text>
    </Pressable>
  );

  const Suggestions = () => {
    if (!showSuggestions || recent.length === 0) return null;
    const filtered = query
      ? recent.filter((x) => x.toLowerCase().includes(query.toLowerCase()))
      : recent;
    if (filtered.length === 0) return null;

    return (
      <View
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 8,
          zIndex: 10,
        }}
      >
        {filtered.map((term) => (
          <Pressable
            key={term}
            onPress={() => {
              setQuery(term);
              setShowSuggestions(false);
              onSearch();
            }}
            style={{ padding: 10 }}
          >
            <Text>{term}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ position: "relative", marginBottom: 20 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nombre (ej. rick, morty)…"
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 44,
          }}
          returnKeyType="search"
          onSubmitEditing={onSearch}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <Suggestions />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 24 }}
        contentContainerStyle={{ paddingVertical: 6 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Chip
            label={`Status: ${status ?? "todos"}`}
            active={!!status}
            onPress={() => setStatus((prev) => (prev ? null : "alive"))}
          />
          {STATUSES.map((s) => (
            <Chip
              key={s}
              label={s}
              active={status === s}
              onPress={() => setStatus(s)}
            />
          ))}
          <Chip
            label={`Gender: ${gender ?? "todos"}`}
            active={!!gender}
            onPress={() => setGender((prev) => (prev ? null : "female"))}
          />
          {GENDERS.map((g) => (
            <Chip
              key={g}
              label={g}
              active={gender === g}
              onPress={() => setGender(g)}
            />
          ))}
        </View>
      </ScrollView>

      {loading && data.length === 0 ? (
        <ActivityIndicator />
      ) : error ? (
        <Text style={{ textAlign: "center", color: "#ef4444" }}>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onEndReachedThreshold={0.4}
          onEndReached={onLoadMore}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{ margin: 12 }} /> : null
          }
        />
      )}
    </View>
  );
}
