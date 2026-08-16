import React from "react";
import { View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Txt } from "@/components/common/Typography";
import BottomModal from "@/components/ui/BottomModal";
import Button from "@/components/ui/buttons/Button";

export type ImagePickerSource = "camera" | "gallery" | "both";

export interface ImagePickerResult {
  uri: string;
  name: string;
  type: string;
}

export interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected?: (image: ImagePickerResult) => void;
  onImagesSelected?: (images: ImagePickerResult[]) => void;
  source?: ImagePickerSource;
  title?: string;
  subtitle?: string;
  allowsEditing?: boolean;
  allowsMultipleSelection?: boolean;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onImageSelected,
  onImagesSelected,
  source = "both",
  title = "Select Image Source",
  subtitle = "Choose where to pick your image from",
  allowsEditing = false,
  allowsMultipleSelection = false,
}: ImagePickerModalProps) {

  const launchPicker = async (type: "gallery" | "camera") => {
    onClose();

    // Delay picker execution to allow the modal dismiss animation to finish smoothly
    setTimeout(async () => {
      try {
        let result: ImagePicker.ImagePickerResult;

        if (type === "gallery") {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) return;

          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: !allowsMultipleSelection && allowsEditing, // multi-select cannot have editing on some OS
            allowsMultipleSelection,
            aspect: allowsEditing ? [16, 9] : undefined, // Assuming a common aspect ratio if cropped
          });
        } else {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return;

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing,
            aspect: allowsEditing ? [16, 9] : undefined,
          });
        }

        if (result && !result.canceled && result.assets && result.assets.length > 0) {
          const mappedAssets = result.assets.map(asset => {
            const filename = asset.uri.split("/").pop() || "image.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const mimeType = match ? `image/${match[1]}` : "image/jpeg";
            return {
              uri: asset.uri,
              name: filename,
              type: mimeType,
            };
          });

          if (allowsMultipleSelection && onImagesSelected) {
            onImagesSelected(mappedAssets);
          } else if (onImageSelected && mappedAssets.length > 0) {
            onImageSelected(mappedAssets[0]);
          }
        }
      } catch (err) {
        console.error("ImagePicker error:", err);
      }
    }, 350);
  };

  return (
    <BottomModal isOpen={isOpen} onClose={onClose}>
      <View className="p-6">
        <Txt variant="lg" className="font-bold mb-1 text-center">
          {title}
        </Txt>
        {subtitle ? (
          <Txt className="text-base-content/60 text-center mb-6 text-sm">
            {subtitle}
          </Txt>
        ) : null}

        <View className="gap-3">
          {(source === "both" || source === "gallery") && (
            <Button
              label="Choose from Gallery"
              leftIcon="images-outline"
              variant="primary"
              onPress={() => launchPicker("gallery")}
            />
          )}

          {(source === "both" || source === "camera") && (
            <Button
              label="Take Photo with Camera"
              leftIcon="camera-outline"
              variant={source === "camera" ? "primary" : "outline"}
              onPress={() => launchPicker("camera")}
            />
          )}
        </View>
      </View>
    </BottomModal>
  );
}
