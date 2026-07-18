import React from "react";
import ImageViewing from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";

export interface ImageViewerProps {
  images: ImageSource[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
}

export default function ImageViewer({ images, imageIndex, visible, onRequestClose }: ImageViewerProps) {
  return (
    <ImageViewing
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={onRequestClose}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
    />
  );
}
