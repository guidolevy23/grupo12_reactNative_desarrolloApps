import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRGeneratorScreen = ({ navigation }) => {
  const [customQRData, setCustomQRData] = useState("");
  
  // Sample test data for different scenarios
  const testScenarios = [
    {
      title: "✅ Valid QR Code",
      description: "Simulates a valid class QR code",
      data: JSON.stringify({
        classId: 123,
        sessionId: "session-456",
        timestamp: new Date().toISOString(),
        type: "checkin",
      }),
    },
    {
      title: "⏰ Early Check-in",
      description: "Class starts in 30 minutes",
      data: JSON.stringify({
        classId: 124,
        sessionId: "session-457",
        timestamp: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        type: "checkin",
      }),
    },
    {
      title: "⚠️ Expired QR",
      description: "Old QR code (1 day ago)",
      data: JSON.stringify({
        classId: 125,
        sessionId: "session-458",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: "checkin",
      }),
    },
    {
      title: "🔢 Simple ID",
      description: "Just a class ID",
      data: "CLASS-123",
    },
  ];

  const [selectedScenario, setSelectedScenario] = useState(testScenarios[0]);

  const handleScanCustom = () => {
    if (!customQRData.trim()) {
      Alert.alert("Error", "Por favor ingresa datos para el QR");
      return;
    }
    setSelectedScenario({
      title: "🔧 Custom QR",
      description: "Datos personalizados",
      data: customQRData,
    });
  };

  const copyToClipboard = (data) => {
    Alert.alert("Datos del QR", data, [
      {
        text: "OK",
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Generador de QR para Testing</Text>
        <Text style={styles.subtitle}>
          Escanea estos códigos con tu Android para probar el check-in
        </Text>
      </View>

      {/* Current QR Display */}
      <View style={styles.qrContainer}>
        <Text style={styles.scenarioTitle}>{selectedScenario.title}</Text>
        <Text style={styles.scenarioDescription}>
          {selectedScenario.description}
        </Text>
        
        <View style={styles.qrCodeWrapper}>
          <QRCode
            value={selectedScenario.data}
            size={250}
            backgroundColor="white"
            color="black"
          />
        </View>

        <TouchableOpacity
          style={styles.dataButton}
          onPress={() => copyToClipboard(selectedScenario.data)}
        >
          <Text style={styles.dataButtonText}>📋 Ver datos del QR</Text>
        </TouchableOpacity>
      </View>

      {/* Test Scenarios */}
      <View style={styles.scenariosContainer}>
        <Text style={styles.sectionTitle}>📱 Escenarios de Prueba</Text>
        
        {testScenarios.map((scenario, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.scenarioCard,
              selectedScenario.title === scenario.title && styles.scenarioCardSelected,
            ]}
            onPress={() => setSelectedScenario(scenario)}
          >
            <Text style={styles.scenarioCardTitle}>{scenario.title}</Text>
            <Text style={styles.scenarioCardDescription}>
              {scenario.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom QR Generator */}
      <View style={styles.customContainer}>
        <Text style={styles.sectionTitle}>🔧 Generar QR Personalizado</Text>
        
        <TextInput
          style={styles.input}
          placeholder='Ejemplo: {"classId": 999, "type": "checkin"}'
          placeholderTextColor="#999"
          value={customQRData}
          onChangeText={setCustomQRData}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleScanCustom}
        >
          <Text style={styles.generateButtonText}>Generar QR</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.sectionTitle}>📖 Cómo Usar</Text>
        
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>1️⃣</Text>
          <Text style={styles.stepText}>
            Abre esta pantalla en un dispositivo (computadora o tablet)
          </Text>
        </View>
        
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>2️⃣</Text>
          <Text style={styles.stepText}>
            En tu Android, ve a Reservas → Check In
          </Text>
        </View>
        
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>3️⃣</Text>
          <Text style={styles.stepText}>
            Escanea el código QR mostrado en esta pantalla
          </Text>
        </View>
        
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>4️⃣</Text>
          <Text style={styles.stepText}>
            Prueba diferentes escenarios para validar errores
          </Text>
        </View>
      </View>

      {/* Backend Info */}
      <View style={styles.backendInfoContainer}>
        <Text style={styles.sectionTitle}>⚙️ Info para Backend</Text>
        <Text style={styles.backendInfoText}>
          El QR code debe contener información del evento/clase. Sugerido:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`{
  "classId": 123,
  "sessionId": "unique-session",
  "timestamp": "ISO-8601-date",
  "type": "checkin"
}`}
          </Text>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  qrContainer: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scenarioTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  scenarioDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  qrCodeWrapper: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#667eea",
  },
  dataButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  dataButtonText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  scenariosContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  scenarioCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  scenarioCardSelected: {
    borderColor: "#667eea",
    backgroundColor: "#f0f4ff",
  },
  scenarioCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  scenarioCardDescription: {
    fontSize: 14,
    color: "#666",
  },
  customContainer: {
    padding: 15,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 80,
    textAlignVertical: "top",
  },
  generateButton: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsContainer: {
    padding: 15,
    backgroundColor: "white",
    margin: 15,
    borderRadius: 15,
  },
  instructionStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  stepNumber: {
    fontSize: 20,
    marginRight: 10,
  },
  stepText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
  backendInfoContainer: {
    padding: 15,
    backgroundColor: "#fff3cd",
    margin: 15,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  backendInfoText: {
    fontSize: 14,
    color: "#856404",
    marginBottom: 10,
  },
  codeBlock: {
    backgroundColor: "#2d2d2d",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#00ff00",
    lineHeight: 18,
  },
  spacer: {
    height: 30,
  },
});

export default QRGeneratorScreen;

