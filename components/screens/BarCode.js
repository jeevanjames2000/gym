import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import Footer from "./Footer";
const BarCode = ({ navigation }) => {
  const backgroundImageUri =
    "https://images.unsplash.com/photo-1560272551-034aee57a87e";
  return (
    <>
      <View style={styles.container}>
        {}
        <Image
          source={require("../../assets/websiteplanet-dummy-356X356 (1).png")}
          style={styles.barcodeImage}
          resizeMode="contain"
        />
        {}
      </View>
      {/* <Footer navigation={navigation} /> */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  barcodeImage: {
    height: 400,
    width: "100%",
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
export default BarCode;
