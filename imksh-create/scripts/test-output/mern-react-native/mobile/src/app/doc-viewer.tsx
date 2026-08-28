import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Pdf from "react-native-pdf";
import { useColorScheme } from "nativewind";
import { Colors } from "../constants/Colors";
import ScreenHeader from "../components/common/ScreenHeader";
import { Txt } from "../components/common/Typography";
import Input from "../components/ui/inputs/Input";
import Button from "../components/ui/buttons/Button";
import Container from "../components/ui/layout/Container";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../components/ui/feedback/ProgressBar";
import * as FileSystem from "expo-file-system/legacy";

export default function DocViewerScreen() {
  const router = useRouter();
  const { url, name } = useLocalSearchParams<{
    url: string;
    name?: string;
  }>();
  
  const insets = useSafeAreaInsets();
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

  useEffect(() => {
    if (!url) return;
    
    if (url.startsWith('http')) {
      const downloadFile = async () => {
        try {
          const filename = `doc_${Date.now()}.pdf`;
          const fileUri = FileSystem.documentDirectory + filename;
          
          const downloadResumable = FileSystem.createDownloadResumable(
            url,
            fileUri,
            {},
            (progressEvent) => {
              const progress = progressEvent.totalBytesWritten / progressEvent.totalBytesExpectedToWrite;
              setDownloadProgress(progress);
            }
          );
          
          const result = await downloadResumable.downloadAsync();
          if (result && result.uri) {
            setLocalUri(result.uri);
          } else {
            setDownloadError('Failed to download document');
          }
        } catch (error) {
          console.error('Download error:', error);
          setDownloadError('Error downloading document');
        }
      };
      downloadFile();
    } else {
      setLocalUri(url);
    }
  }, [url]);

  if (!url) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.base100 }}>
        <ScreenHeader title="Document Viewer" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle-outline" size={48} color={colors.baseContent} style={{ opacity: 0.5 }} />
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
        title={name || 'Document Viewer'}
        subtitle={totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : 'Loading...'}
        onBack={() => router.back()}
      />

      {isPasswordRequired ? (
        <Container className="flex-1 justify-center items-center px-6">
          <View className="p-6 rounded-3xl w-full" style={{ backgroundColor: colors.base200 }}>
            <Txt variant="xl" className="font-bold text-center mb-2">Password Protected</Txt>
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
              <Txt variant="caption" className="text-error text-center mb-4">{errorMsg}</Txt>
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
                <ProgressBar progress={downloadProgress * 100} label="Downloading Document" />
              </View>
            </View>
          ) : downloadError ? (
            <View className="flex-1 items-center justify-center p-4">
              <Ionicons name="close-circle-outline" size={48} color={colors.error} style={{ opacity: 0.8 }} />
              <Txt variant="base" className="mt-4 text-center text-error font-semibold">
                {downloadError}
              </Txt>
              <Button 
                label="Go Back" 
                variant="outline" 
                style={{ marginTop: 20 }} 
                onPress={() => router.back()} 
              />
            </View>
          ) : (
            <Pdf
              source={{ uri: localUri!, cache: false }}
              password={password}
              onLoadComplete={(numberOfPages) => {
                setTotalPages(numberOfPages);
              }}
              onPageChanged={(page) => {
                setCurrentPage(page);
              }}
              onError={(error: any) => {

                if (error?.message?.toLowerCase().includes('password')) {
                  setIsPasswordRequired(true);
                  setErrorMsg('Incorrect password. Please try again.');
                }
              }}
              trustAllCerts={false}
              style={[styles.pdf, { backgroundColor: colors.base200 }]}
            />
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
