import { Platform, Linking, Alert } from "react-native";

export const openMapsByCoords = async (lat, lng, originAddress) => {
  console.log(lat,lng,originAddress)
  const scheme = Platform.select({
    ios: "maps:0,0?q=",
    android: "geo:0,0?q=",
  });

  if (lat == null || lng == null) {
    Alert.alert("Error", "No se encontraron coordenadas de la sede.");
    return;
  }

  // destino: "lat,lng" encodeado
  const destinationParam = encodeURIComponent(`${lat},${lng}`);

  // origen: si viene dirección en texto, la encodeamos
  const url = originAddress
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddress)}&destination=${destinationParam}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${destinationParam}`;

  console.log("URL que voy a abrir:", url);

  try {
    // no uso canOpenURL, voy directo al navegador
    await Linking.openURL(url);
  } catch (e) {
    console.log("Error al abrir Maps:", e);
    Alert.alert("Error", "No se pudo abrir Google Maps");
  }
};

