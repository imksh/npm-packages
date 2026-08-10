import React from "react";
import { StatusBar } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";

export interface ImageViewerProps {
  images: ImageSource[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
}

export default function ImageViewer({
  images,
  imageIndex,
  visible,
  onRequestClose,
}: ImageViewerProps) {
  return (
    <>
      <StatusBar hidden={visible} />
      <ImageViewing
        images={images}
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={onRequestClose}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        presentationStyle="overFullScreen"
      />
    </>
  );
}
