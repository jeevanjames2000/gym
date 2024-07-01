import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/gitam-logo1.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.scannerContainer}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}></View>
        </CameraView>
      </View>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => {
          setScanned(false);
          setScannedData("");
          setAccessMessage("");
        }}
      >
        <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
      </TouchableOpacity>
      {scannedData ? (
        <View style={styles.card}>
          <Text style={styles.scannedData}>{scannedData}</Text>
          <Text
            style={[
              styles.accessMessage,
              {
                color: accessMessage === "Access Granted" ? "green" : "red",
              },
            ]}
          >
            {accessMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: 100,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scannerContainer: {
    height: 300,
    width: 300,
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#000",
  },
  card: {
    width: "80%",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  scannedData: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  accessMessage: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scanButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007367",
    borderRadius: 5,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 15,
  },
});
export default Scanner;
