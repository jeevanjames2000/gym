import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BarCode = ({ route, navigation }) => {
  const [slotsdata, setSlotsData] = useState([]);
  const [storage, setStorage] = useState(null);
  const [resLoading, setResLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("myKey");
      if (value !== null) {
        setStorage(value);
      }
    };
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchGymSchedules = async () => {
        try {
          if (storage) {
            setResLoading(true);
            const response = await fetch(
              `https://g-gym-backend.onrender.com/slot/gym/getGymBookingsByRegdNo/${storage}`
            );
            const data = await response.json();

            const currentDate = new Date().toISOString().split("T")[0];
            const filteredData = data.filter(
              (item) =>
                new Date(item.start_date).toISOString().split("T")[0] ===
                currentDate
            );

            if (filteredData.length > 0) {
              setResLoading(false);
              setSlotsData(filteredData[0]);
            } else {
              setResLoading(false);
              setSlotsData(null);
            }
          }
        } catch (error) {
          setResLoading(false);
        }
      };

      fetchGymSchedules();
    }, [storage])
  );

  const renderQRCodeImage = () => {
    return (
      <View>
        <Image
          style={styles.logo}
          source={{
            uri: slotsdata.qr_code,
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {resLoading ? (
        <View style={styles.modalLoading}>
          <ActivityIndicator
            size="large"
            color="#007367"
            style={{ transform: [{ scale: 2 }] }}
          />
          <Text>Loading</Text>
        </View>
      ) : (
        <>
          {Array.isArray(slotsdata) && slotsdata.length === 0 ? (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                No Slots Booked
              </Text>
            </View>
          ) : (
            renderQRCodeImage()
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: "center",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 400,
    height: 400,
  },
  modalLoading: {
    position: "absolute",
    padding: 20,
    top: 200,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default BarCode;
