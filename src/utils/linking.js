import * as Linking from 'expo-linking';

const linking = {
  prefixes: [
    Linking.createURL('/'), // expo go
    'myapp://' // standalone build
  ],
  config: {
    screens: {
        MainTabs: {
            screens: {
                Reservas: {
                    screens: {
                    ReservasList: "reservas",
                    }
                }
            }
        }

    }
  }
};

export default linking;
