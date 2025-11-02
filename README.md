# Expo Local Authentication - Guía de Implementación

## 📱 ¿Qué es Local Authentication?

Expo Local Authentication permite usar la autenticación biométrica del dispositivo (huella digital, Face ID, reconocimiento facial) o el PIN/contraseña del dispositivo para proteger el acceso a tu aplicación.

## 🔧 Implementación

### 1. Instalación del paquete

```bash
npm install expo-local-authentication
```

### 2. Funcionalidades implementadas

En el componente `Home`, se implementó:

#### **Verificación de hardware**
```javascript
const hasHardware = await LocalAuthentication.hasHardwareAsync();
```
Verifica si el dispositivo tiene capacidades biométricas (sensor de huella, Face ID, etc.)

#### **Verificación de credenciales configuradas**
```javascript
const isEnrolled = await LocalAuthentication.isEnrolledAsync();
```
Verifica si el usuario tiene configurada alguna forma de autenticación (huella, Face ID, PIN, patrón, etc.)

#### **Autenticación**
```javascript
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: "Autentícate para acceder",
  fallbackLabel: "Usar código",
  cancelLabel: "Cancelar",
});
```
Muestra el diálogo de autenticación nativo del dispositivo.

## 🎯 Flujo de la aplicación

1. **Usuario ingresa al Home** → Se activa `authenticateUser()`
2. **Verificación de hardware** → Si no tiene, permite acceso
3. **Verificación de credenciales** → Si no tiene configuradas, permite acceso
4. **Solicitud de autenticación** → Muestra diálogo nativo
5. **Resultado exitoso** → Carga la lista de Pokémon
6. **Resultado fallido** → Opción de reintentar o salir

## 📝 Código clave

### Estados de autenticación
```javascript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isAuthenticating, setIsAuthenticating] = useState(true);
```

### Función principal
```javascript
const authenticateUser = async () => {
  try {
    // 1. Verificar hardware
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      // Permitir acceso si no hay hardware
      setIsAuthenticated(true);
      return;
    }

    // 2. Verificar credenciales
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      // Permitir acceso si no hay credenciales
      setIsAuthenticated(true);
      return;
    }

    // 3. Autenticar
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentícate para acceder",
      fallbackLabel: "Usar código",
      cancelLabel: "Cancelar",
    });

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      // Mostrar opciones de reintentar o salir
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsAuthenticating(false);
  }
};
```


### En emulador/simulador:
- **Android**: Configurar huella en Settings → Security → Fingerprint

## 📚 Tipos de autenticación soportados

- 🔐 **Biométrica**: Huella digital, Face ID, reconocimiento facial
- 🔢 **PIN**: Código numérico del dispositivo
- 🔤 **Contraseña**: Contraseña del dispositivo
- 🎨 **Patrón**: Patrón de desbloqueo (Android)



## 📖 Documentación oficial

https://docs.expo.dev/versions/latest/sdk/local-authentication/
