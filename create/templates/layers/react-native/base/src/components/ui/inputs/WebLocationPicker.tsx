import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";
import Button from "../buttons/Button";
import Input from "./Input";
import { toast } from "@/utils/toast";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { LocationLoader } from "../../common/LocationLoader";
import ScreenHeader from "@/components/common/ScreenHeader";

export interface LocationDetails {
  addressLine1: string;
  addressLine2?: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
}

interface WebLocationPickerProps {
  onLocationSelected: (details: LocationDetails) => void;
  initialCoordinate?: { latitude: number; longitude: number };
  renderTrigger?: (onPress: () => void) => React.ReactNode;
}

export default function WebLocationPicker({
  onLocationSelected,
  initialCoordinate,
  renderTrigger,
}: WebLocationPickerProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [positionFetched, setPositionFetched] = useState(false);
  const [showWebView, setShowWebView] = useState(true);

  const [mapCenter, setMapCenter] = useState({
    latitude: initialCoordinate?.latitude || 28.6139,
    longitude: initialCoordinate?.longitude || 77.209,
  });

  const [currentCenter, setCurrentCenter] = useState(mapCenter);

  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (initialCoordinate?.latitude && initialCoordinate?.longitude) {
      setMapCenter(initialCoordinate);
      setCurrentCenter(initialCoordinate);
    }
  }, [initialCoordinate]);

  useEffect(() => {
    if (animationDone && positionFetched) {
      setLoadingLocation(false);
    }
  }, [animationDone, positionFetched]);

  const requestLocationAndOpenMap = async () => {
    setShowWebView(true);
    setModalVisible(true);
    setLoadingLocation(true);
    setAnimationDone(false);
    setPositionFetched(false);

    // Asynchronously fetch current position
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setPositionFetched(true);
          return;
        }

        if (!initialCoordinate?.latitude) {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setMapCenter({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setCurrentCenter({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setPositionFetched(true);
      }
    })();
  };

  const handleConfirmLocation = async () => {
    setLoading(true);
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentCenter.latitude,
        longitude: currentCenter.longitude,
      });

      if (address) {
        const details: LocationDetails = {
          addressLine1: address.street || address.name || "",
          locality: address.subregion || address.district || "",
          city: address.city || address.subregion || "",
          state: address.region || "",
          pinCode: address.postalCode || "",
          latitude: currentCenter.latitude,
          longitude: currentCenter.longitude,
        };

        // Hide WebView first to prevent Android crash when Modal closes
        setShowWebView(false);
        setTimeout(() => {
          onLocationSelected(details);
          setModalVisible(false);
          setLoading(false);
        }, 150);
        return;
      }
    } catch (error) {
      console.warn("Geocoding failed", error);
    }
    setLoading(false);
  };

  const [fetchingCurrentLocation, setFetchingCurrentLocation] = useState(false);

  const handleCurrentLocation = async () => {
    setFetchingCurrentLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      setCurrentCenter({ latitude: lat, longitude: lng });
      webViewRef.current?.injectJavaScript(`
        map.setView([${lat}, ${lng}], 15);
        true;
      `);
    } catch (error) {
      console.warn("Failed to get current location", error);
      toast.error("Failed to get current location");
    } finally {
      setFetchingCurrentLocation(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        setCurrentCenter({ latitude, longitude });
        webViewRef.current?.injectJavaScript(`
          map.setView([${latitude}, ${longitude}], 15);
          true;
        `);
      } else {
        toast.error("Location not found");
      }
    } catch {
      toast.error("Failed to search");
    }
    setSearching(false);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "centerChanged") {
        setCurrentCenter({
          latitude: data.lat,
          longitude: data.lng,
        });
      }
    } catch {}
  };

  const htmlContent = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #f0f0f0; }
        .center-marker {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -100%);
          z-index: 1000;
          font-size: 36px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div class="center-marker">📍</div>
      <script>
        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${mapCenter.latitude}, ${mapCenter.longitude}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        map.on('moveend', function() {
          var center = map.getCenter();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'centerChanged',
            lat: center.lat,
            lng: center.lng
          }));
        });
      </script>
    </body>
    </html>
  `,
    [mapCenter.latitude, mapCenter.longitude],
  );

  return (
    <>
      {renderTrigger ? (
        renderTrigger(requestLocationAndOpenMap)
      ) : (
        <TouchableOpacity
          onPress={requestLocationAndOpenMap}
          className="w-full h-14 bg-base-200 rounded-xl mb-4 flex-row items-center justify-between px-4 border border-base-300"
        >
          <View className="flex-row items-center">
            <Ionicons
              name="map-outline"
              size={24}
              color={theme.primary}
              style={{ marginRight: 12 }}
            />
            <Txt color={theme.baseContent} weight="semibold">
              {initialCoordinate?.latitude
                ? "Update Location"
                : "Pick from map"}
            </Txt>
          </View>
          {loading && !modalVisible ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.secondary}
            />
          )}
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {loadingLocation ? (
          <View style={{ flex: 1 }}>
            <LocationLoader
              onReady={() => {
                setAnimationDone(true);
              }}
            />
          </View>
        ) : (
          <View className="flex-1 bg-base-100">
            <ScreenHeader
              icon="close"
              onBack={() => setModalVisible(false)}
              title="Select Location"
            />

            <View className="px-4 py-3 bg-base-100 flex-row items-center border-b border-base-200 gap-4">
              <View className="flex-1" style={{ marginBottom: -8 }}>
                <Input
                  placeholder="Search Location"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  containerStyle={{ marginBottom: 0 }}
                  leftIcon="search"
                />
              </View>
              <Button
                onPress={handleSearch}
                isLoading={searching}
                label="Go"
                variant="primary"
                soft
                size="md"
                className=""
              />
            </View>

            <View className="flex-1 relative">
              {showWebView && (
                <WebView
                  ref={webViewRef}
                  source={{ html: htmlContent }}
                  onMessage={handleMessage}
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                  scrollEnabled={false}
                  bounces={false}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                  )}
                />
              )}

              <TouchableOpacity
                onPress={handleCurrentLocation}
                disabled={fetchingCurrentLocation}
                className="absolute bottom-6 right-4 w-12 h-12 rounded-full items-center justify-center shadow-lg border border-base-200"
                style={{
                  backgroundColor: theme.base100,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                {fetchingCurrentLocation ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <Ionicons name="locate" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            </View>

            <View className="p-4 bg-base-100 border-t border-base-300 pb-8">
              <Button
                label="Confirm Location"
                onPress={handleConfirmLocation}
                isLoading={loading}
                variant="primary"
              />
            </View>
          </View>
        )}
      </Modal>
    </>
  );
}
