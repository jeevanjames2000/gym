import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import DatePicker from "react-native-neat-date-picker";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
const DatePickermo = () => {
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);

  const [date, setDate] = useState(dayjs());

  const openDatePickerSingle = () => setShowDatePickerSingle(true);

  const onCancelSingle = () => {
    setShowDatePickerSingle(false);
  };

  const onConfirmSingle = (output) => {
    setShowDatePickerSingle(false);

    setDate(output.dateString);
  };

  return (
    <View style={styles.container}>
      {/* Single Date */}
      <Button title={"single"} onPress={openDatePickerSingle} />
      <DateTimePicker
        mode="single"
        date={date}
        onChange={(params) => setDate(params.date)}
      />
      <Text>{date}</Text>

      {/* Date Range */}
      {/* <Button title={"range"} onPress={openDatePickerRange} />
      <DatePicker
        isVisible={showDatePickerRange}
        mode={"range"}
        onCancel={onCancelRange}
        onConfirm={onConfirmRange}
      />
      <Text>{startDate && `${startDate} ~ ${endDate}`}</Text> */}
    </View>
  );
};

export default DatePickermo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
