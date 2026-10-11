import React from "react";
import { View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Txt } from "@/components/common/Typography";
import Drawer from "@/components/ui/Drawer";
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
  aspectRatio?: [number, number];
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
  aspectRatio = [1, 1],
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
            quality: 0.6,
            allowsEditing: !allowsMultipleSelection && allowsEditing, // multi-select cannot have editing on some OS
            allowsMultipleSelection,
            aspect: allowsEditing ? aspectRatio : undefined, // Assuming a common aspect ratio if cropped
          });
        } else {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return;

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.6,
            allowsEditing,
            aspect: allowsEditing ? aspectRatio : undefined,
          });
        }

        if (
          result &&
          !result.canceled &&
          result.assets &&
          result.assets.length > 0
        ) {
          const mappedAssets = await Promise.all(
            result.assets.map(async (asset) => {
              let finalUri = asset.uri;

              // Resize image if it's too large to save bandwidth
              if (asset.width > 1024 || asset.height > 1024) {
                const resizeAction =
                  asset.width > asset.height
                    ? { resize: { width: 1024 } }
                    : { resize: { height: 1024 } };

                const manipResult = await ImageManipulator.manipulateAsync(
                  asset.uri,
                  [resizeAction],
                  { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
                );
                finalUri = manipResult.uri;
              }

              const filename = finalUri.split("/").pop() || "image.jpg";
              const match = /\.(\w+)$/.exec(filename);
              const mimeType = match ? `image/${match[1]}` : "image/jpeg";
              return {
                uri: finalUri,
                name: filename,
                type: mimeType,
              };
            }),
          );

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
    <Drawer isOpen={isOpen} onClose={onClose} position="bottom">
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
    </Drawer>
  );
}
