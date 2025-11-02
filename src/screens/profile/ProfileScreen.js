import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import styles from './styles';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function ProfileScreen() {

    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {    
        await logout();
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>ProfileScreen</Text>
        <Button mode="contained" onPress={handleLogout}>
            Cerrar Session
        </Button>
        </View>
    );
}