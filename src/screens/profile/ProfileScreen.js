import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from './styles';

export default function ProfileScreen() {

    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {    
        await logout();
    };
    
    return (
        <View style={styles.container}>
        <Text style={styles.title}>ProfileScreen</Text>
        <Button style={styles.button} onPress={handleLogout}>
            Cerrar Session
        </Button>
        </View>
    );
}