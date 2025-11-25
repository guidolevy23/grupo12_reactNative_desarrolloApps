import { Platform, Linking, Alert } from "react-native";

export const openMapsByCoords = async (lat, lng) => {
  const scheme = Platform.select({
    ios: "maps:0,0?q=",
    android: "geo:0,0?q=",
  });

  const latLng = `${lat},${lng}`;
  const url = `${scheme}${latLng}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      return await Linking.openURL(url);
    } else {
      // Fallback a URL web de Google Maps
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      return await Linking.openURL(webUrl);
    }
  } catch (err) {
    Alert.alert("Error", "No se pudo abrir Google Maps");
  }
};
