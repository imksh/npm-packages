import { Platform } from "react-native";
import { toast } from "./toast";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

/**
 * Downloads a string or base64 data to a file.
 * - On Web: triggers browser download via an anchor element and Blob.
 * - On Android: saves to user-selected folder via StorageAccessFramework.
 * - On iOS: writes to app document directory and opens native iOS Share/Save sheet.
 */
export const downloadFileString = async (
  content: string,
  filename: string,
  mimeType: string,
  isBase64: boolean = false
): Promise<boolean> => {
  if (Platform.OS === "web") {
    try {
      let blob: Blob;
      if (isBase64) {
        const byteCharacters = atob(content);
        const byteArrays: Uint8Array[] = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        blob = new Blob(byteArrays, { type: mimeType });
      } else {
        blob = new Blob([content], { type: mimeType });
      }
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Error", err.message || `Failed to download ${filename}`);
      return false;
    }
  }

  try {
    const encoding = isBase64
      ? FileSystem.EncodingType.Base64
      : FileSystem.EncodingType.UTF8;

    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        toast.info("Cancelled", "Directory permission was not granted.");
        return false;
      }

      const createdFileUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimeType
        );
      await FileSystem.writeAsStringAsync(createdFileUri, content, {
        encoding,
      });
      toast.success("Success", `${filename} saved successfully!`);
      return true;
    }

    // iOS and other native platforms
    const baseDir =
      FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? "";
    const fileUri = `${baseDir}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, content, { encoding });

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: `Save ${filename}`,
        UTI: mimeType,
      });
      toast.success("Success", "File ready to save or share.");
      return true;
    } else {
      toast.error("Error", "Sharing is not available on this device.");
      return false;
    }
  } catch (error: unknown) {
    const err = error as Error;
    toast.error("Error", err.message || `Failed to download ${filename}`);
    return false;
  }
};

/**
 * Downloads a CSV string as a .csv file.
 */
export const downloadCsvString = async (
  csvString: string,
  filename: string = "export.csv"
): Promise<boolean> => {
  return downloadFileString(csvString, filename, "text/csv;charset=utf-8;");
};

/**
 * Downloads JSON data as a formatted .json file.
 */
export const downloadJson = async (
  data: unknown,
  filename: string = "export.json"
): Promise<boolean> => {
  const jsonString = JSON.stringify(data, null, 2);
  return downloadFileString(jsonString, filename, "application/json");
};

/**
 * Downloads a file from a remote URL.
 * - On Web: triggers browser download.
 * - On Mobile: downloads to local filesystem, then prompts to save on Android
 *   via StorageAccessFramework or opens iOS Share sheet.
 */
export const downloadFileFromUrl = async (
  url: string,
  filename: string,
  mimeType: string = "application/octet-stream"
): Promise<boolean> => {
  if (Platform.OS === "web") {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Error", err.message || `Failed to download ${filename}`);
      return false;
    }
  }

  try {
    const baseDir =
      FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "";
    const localUri = `${baseDir}${filename}`;
    const result = await FileSystem.downloadAsync(url, localUri);

    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        toast.info("Cancelled", "Directory permission was not granted.");
        return false;
      }

      const fileBase64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const createdFileUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimeType
        );

      await FileSystem.writeAsStringAsync(createdFileUri, fileBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      toast.success("Success", `${filename} saved successfully!`);
      return true;
    }

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(result.uri, {
        mimeType,
        dialogTitle: `Save ${filename}`,
      });
      toast.success("Success", "File ready to save or share.");
      return true;
    } else {
      toast.error("Error", "Sharing is not available on this device.");
      return false;
    }
  } catch (error: unknown) {
    const err = error as Error;
    toast.error("Error", err.message || `Failed to download ${filename}`);
    return false;
  }
};
