import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BarCode = ({ route, navigation }) => {
  const [slotsdata, setSlotsData] = useState([]);
  const [storage, setStorage] = useState(null);

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
              setSlotsData(filteredData[0]);
            } else {
              setSlotsData(null);
            }
          }
        } catch (error) {}
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

  return <View style={styles.container}>{renderQRCodeImage()}</View>;
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
});

export default BarCode;
