import React, { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";
import Button from "../buttons/Button";

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

interface LocationPickerProps {
  onLocationSelected: (details: LocationDetails) => void;
  initialCoordinate?: { latitude: number; longitude: number };
}

export default function LocationPicker({
  onLocationSelected,
  initialCoordinate,
}: LocationPickerProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: initialCoordinate?.latitude || 28.6139,
    longitude: initialCoordinate?.longitude || 77.209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentCenter, setCurrentCenter] = useState({
    latitude: region.latitude,
    longitude: region.longitude,
  });

  useEffect(() => {
    if (initialCoordinate?.latitude && initialCoordinate?.longitude) {
       
      setRegion((r) => ({
        ...r,
        latitude: initialCoordinate.latitude,
        longitude: initialCoordinate.longitude,
      }));
      setCurrentCenter(initialCoordinate);
    }
  }, [initialCoordinate]);

  const requestLocationAndOpenMap = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoading(false);
      setModalVisible(true);
      return;
    }

    try {
      if (!initialCoordinate?.latitude) {
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          ...region,
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
    }

    setLoading(false);
    setModalVisible(true);
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
        onLocationSelected(details);
        setModalVisible(false);
      }
    } catch (error) {
      console.warn("Geocoding failed", error);
    }
    setLoading(false);
  };

  return (
    <>
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
              ? "Update Location on Map"
              : "Pick from Map"}
          </Txt>
        </View>
        {loading && !modalVisible ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-base-100">
          <View
            className="h-16 flex-row items-center justify-between px-4 border-b border-base-300 pt-4 bg-base-100"
            style={{ zIndex: 10 }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-2"
            >
              <Ionicons name="close" size={24} color={theme.baseContent} />
            </TouchableOpacity>
            <Txt variant="lg" weight="bold">
              Select Location
            </Txt>
            <View className="w-10" />
          </View>

          <View className="flex-1 relative">
            <MapView
              style={{ flex: 1 }}
              initialRegion={region}
              showsUserLocation={true}
              onRegionChangeComplete={(r) =>
                setCurrentCenter({
                  latitude: r.latitude,
                  longitude: r.longitude,
                })
              }
            />

            {/* Center Pin Overlay */}
            <View
              className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center pointer-events-none"
              pointerEvents="none"
            >
              <View
                className="items-center"
                style={{ transform: [{ translateY: -20 }] }}
              >
                <Ionicons name="location" size={40} color={theme.primary} />
                <View className="w-2 h-2 rounded-full bg-black/20 mt-1" />
              </View>
            </View>
          </View>

          <View className="p-6 bg-base-100 border-t border-base-300 pb-10">
            <Txt
              variant="sm"
              color={theme.secondary}
              className="mb-4 text-center"
            >
              Drag the map to position the pin exactly on your property.
            </Txt>
            <Button
              label="Confirm Location"
              onPress={handleConfirmLocation}
              isLoading={loading}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
