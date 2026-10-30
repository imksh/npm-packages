import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  UIManager,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import ScreenHeader from "../../components/common/ScreenHeader";
import { Txt } from "../../components/common/Typography";
import Input from "../../components/ui/inputs/Input";
import Button from "../../components/ui/buttons/Button";
import Container from "../../components/ui/layout/Container";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../components/ui/feedback/ProgressBar";
import * as FileSystem from "expo-file-system/legacy";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";
import { isExpoGo, hasNativeModule } from "../../utils/env";

const hasPdfViewManager = (): boolean => {
  try {
    return Boolean(
      UIManager.getViewManagerConfig &&
      UIManager.getViewManagerConfig("RNPDFPdfView")
    );
  } catch {
    return false;
  }
};

const getPdfComponent = () => {
  if (
    isExpoGo() ||
    !hasNativeModule("ReactNativeBlobUtil") ||
    !hasPdfViewManager()
  ) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-pdf");
    return mod.default || mod;
  } catch {
    return null;
  }
};

const getWebViewComponent = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-webview");
    return mod.WebView || mod.default || mod;
  } catch {
    return null;
  }
};

export default function DocViewerScreen() {
  const router = useRouter();
  const { url, name } = useLocalSearchParams<{
    url: string;
    name?: string;
  }>();

  useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [localUri, setLocalUri] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const PdfComponent = useMemo(() => getPdfComponent(), []);
  const WebViewComponent = useMemo(() => getWebViewComponent(), []);

  useEffect(() => {
    if (!url) return;

    if (url.startsWith("http")) {
      const downloadFile = async () => {
        try {
          const filename = `doc_${Date.now()}.pdf`;

          const baseDir =
            FileSystem.documentDirectory ||
            FileSystem.cacheDirectory ||
            "";
          const fileUri = `${baseDir}${filename}`;
          const downloadResumable = FileSystem.createDownloadResumable(
            url,
            fileUri,
            {},
            (progressEvent: FileSystem.DownloadProgressData) => {
              const progress =
                progressEvent.totalBytesExpectedToWrite > 0
                  ? progressEvent.totalBytesWritten /
                    progressEvent.totalBytesExpectedToWrite
                  : 0;
              setDownloadProgress(progress);
            }
          );

          const result = await downloadResumable.downloadAsync();
          if (result && result.uri) {
            setLocalUri(result.uri);
            return;
          }

          // Fallback to url directly if local download is unavailable
          setLocalUri(url);
        } catch (error) {
          console.error("Download error:", error);
          // Still fallback to original url
          setLocalUri(url);
        }
      };
      downloadFile();
    } else {
      setLocalUri(url);
    }
  }, [url]);

  const handleShare = async () => {
    try {
      const targetUri = localUri || url;
      if (targetUri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(targetUri, {
          mimeType: "application/pdf",
          dialogTitle: name || "Open Document",
          UTI: "com.adobe.pdf",
        });
      } else if (url && url.startsWith("http")) {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (e) {
      console.warn("Failed to open or share document:", e);
    }
  };

  if (!url) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.base100 }}>
        <ScreenHeader title="Document Viewer" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.baseContent}
            style={{ opacity: 0.5 }}
          />
          <Txt variant="base" className="mt-4 text-center opacity-70">
            No document URL provided.
          </Txt>
        </View>
      </View>
    );
  }

  const handlePasswordSubmit = () => {
    setPassword(inputPassword);
    setIsPasswordRequired(false);
    setErrorMsg("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      <ScreenHeader
        title={name || "Document Viewer"}
        subtitle={totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : undefined}
        onBack={() => router.back()}
        actions={
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-base-200/80 items-center justify-center border border-base-300/10 shadow-sm"
          >
            <Ionicons name="share-outline" color={colors.baseContent} size={20} />
          </TouchableOpacity>
        }
      />

      {isPasswordRequired ? (
        <Container className="flex-1 justify-center items-center px-6">
          <View
            className="p-6 rounded-3xl w-full"
            style={{ backgroundColor: colors.base200 }}
          >
            <Txt variant="xl" className="font-bold text-center mb-2">
              Password Protected
            </Txt>
            <Txt variant="base" className="text-center text-base-content/70 mb-6">
              This document requires a password to open.
            </Txt>
            <Input
              placeholder="Enter password"
              value={inputPassword}
              onChangeText={setInputPassword}
              secureTextEntry
              className="mb-4"
            />
            {errorMsg ? (
              <Txt variant="caption" className="text-error text-center mb-4">
                {errorMsg}
              </Txt>
            ) : null}
            <Button
              label="Unlock Document"
              variant="primary"
              isFullWidth
              onPress={handlePasswordSubmit}
            />
          </View>
        </Container>
      ) : (
        <View style={styles.pdfContainer}>
          {!localUri && !downloadError ? (
            <View className="flex-1 items-center justify-center w-full relative">
              <View className="w-3/4 max-w-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300">
                <ProgressBar
                  progress={downloadProgress * 100}
                  label="Downloading Document"
                />
              </View>
            </View>
          ) : downloadError ? (
            <View className="flex-1 items-center justify-center p-4">
              <Ionicons
                name="close-circle-outline"
                size={48}
                color={colors.error}
                style={{ opacity: 0.8 }}
              />
              <Txt
                variant="base"
                className="mt-4 text-center text-error font-semibold"
              >
                {downloadError}
              </Txt>
              <Button
                label="Go Back"
                variant="outline"
                style={{ marginTop: 20 }}
                onPress={() => router.back()}
              />
            </View>
          ) : PdfComponent ? (
            <PdfComponent
              source={{ uri: localUri!, cache: false }}
              password={password}
              onLoadComplete={(numberOfPages: number) => {
                setTotalPages(numberOfPages);
              }}
              onPageChanged={(page: number) => {
                setCurrentPage(page);
              }}
              onError={(error: unknown) => {
                const err = error as { message?: string };
                if (err?.message?.toLowerCase().includes("password")) {
                  setIsPasswordRequired(true);
                  setErrorMsg("Incorrect password. Please try again.");
                }
              }}
              trustAllCerts={false}
              style={[styles.pdf, { backgroundColor: colors.base200 }]}
            />
          ) : Platform.OS === "ios" && WebViewComponent ? (
            <View style={{ flex: 1, width: "100%" }}>
              <WebViewComponent
                source={{ uri: localUri || url }}
                style={[styles.pdf, { backgroundColor: colors.base200 }]}
                originWhitelist={["*"]}
                scalesPageToFit={true}
              />
            </View>
          ) : Platform.OS === "android" &&
            WebViewComponent &&
            url &&
            url.startsWith("http") ? (
            <View style={{ flex: 1, width: "100%" }}>
              <WebViewComponent
                source={{
                  uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`,
                }}
                style={[styles.pdf, { backgroundColor: colors.base200 }]}
                originWhitelist={["*"]}
                scalesPageToFit={true}
              />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center p-6 w-full">
              <View
                className="p-6 rounded-3xl w-full max-w-sm items-center border border-base-300"
                style={{ backgroundColor: colors.base200 }}
              >
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={36}
                    color={colors.primary}
                  />
                </View>
                <Txt variant="lg" className="font-bold text-center mb-1">
                  {name || "Document Ready"}
                </Txt>
                <Txt variant="caption" className="text-center opacity-70 mb-6">
                  Native PDF rendering requires a development build. You can open or
                  share this document in your device reader.
                </Txt>
                <Button
                  label="Open in Device Reader"
                  variant="primary"
                  isFullWidth
                  onPress={handleShare}
                  className="mb-3"
                />
                {url && url.startsWith("http") ? (
                  <Button
                    label="Open in Web Browser"
                    variant="outline"
                    isFullWidth
                    onPress={() => WebBrowser.openBrowserAsync(url)}
                  />
                ) : null}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
