import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function Otp() {

  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate("Login");
  }

  return (
    <View>
      <Text>OTP</Text>
      <Button onPress={navigateToLogin}>
        To LOGIN
      </Button>
    </View>
  );
};

