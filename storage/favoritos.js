import AsyncStorage from "@react-native-async-storage/async-storage";

const FAV_KEY = "@favorites";
const LAST_SEARCH_KEY = "@lastSearch";

export async function getFavorites() {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function setFavorites(list) {
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(list));
}

export async function isFavorite(id) {
  const all = await getFavorites();
  return all.some((c) => c.id === id);
}

export async function toggleFavorite(character) {
  const all = await getFavorites();
  const exists = all.some((c) => c.id === character.id);
  const newList = exists
    ? all.filter((c) => c.id !== character.id)
    : [character, ...all];
  await setFavorites(newList);
  return !exists;
}

export async function getLastSearch() {
  return (await AsyncStorage.getItem(LAST_SEARCH_KEY)) ?? "";
}

export async function setLastSearch(q) {
  await AsyncStorage.setItem(LAST_SEARCH_KEY, q);
}

const RECENT_SEARCHES_KEY = "@recentSearches";

export async function getRecentSearches() {
  const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addRecentSearch(q) {
  const term = (q || "").trim();
  if (!term) return;
  const prev = await getRecentSearches();
  // Deja únicas (case-insensitive), tope 6
  const next = [
    term,
    ...prev.filter((x) => x.toLowerCase() !== term.toLowerCase()),
  ].slice(0, 6);
  await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export async function clearRecentSearches() {
  await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
}
