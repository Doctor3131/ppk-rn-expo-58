import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline, type LatLng, type Region } from "react-native-maps";
import * as Location from "expo-location";

export default function LiveTrackingScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: Location.LocationSubscription | undefined;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== "granted") {
        setError("Location permission is required for live tracking.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      if (cancelled) return;
      const { latitude, longitude } = loc.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 3000,
          distanceInterval: 5, // update every 5 m
        },
        (pos) => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          setRouteCoords((prev) => [...prev, { latitude, longitude }]);
          setRegion((r) => r ? { ...r, latitude, longitude } : r);
        },
        (reason) => {
          if (!cancelled) setError(reason);
        },
      );

      if (cancelled) subscription.remove();
    })().catch(() => {
      if (!cancelled) setError("Unable to get your location. Check that location services are enabled.");
    });

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  if (error) {
    return <View style={styles.message}><Text>{error}</Text></View>;
  }

  if (!region) return null;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {routeCoords.length > 0 && (
          <>
            <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#007AFF" />
            <Marker coordinate={routeCoords[routeCoords.length - 1]} title="You" />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  message: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
});
