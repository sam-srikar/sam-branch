import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCall = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.17:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Unable to connect to CallGuard server.");
    }
    setLoading(false);
  };

  const getRiskColor = () => {
    if (!result) return "#ccc";
    if (result.risk_level === "High") return "#ff4d4d";
    if (result.risk_level === "Medium") return "#ffaa00";
    return "#4CAF50";
  };

  const getAdvice = () => {
    if (!result) return "";

    if (result.risk_level === "High")
      return "⚠️ This call is very likely a scam. Do NOT share information. Hang up immediately.";

    if (result.risk_level === "Medium")
      return "⚠️ This call may be suspicious. Do not provide sensitive information without verifying independently.";

    return "✅ This call appears low risk. Continue cautiously.";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CallGuard</Text>
      <Text style={styles.subtitle}>
        Protect yourself from scam calls
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Paste call transcript here..."
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={analyzeCall}>
        <Text style={styles.buttonText}>
          {loading ? "Analyzing..." : "Check Call Safety"}
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={[styles.riskBanner, { backgroundColor: getRiskColor() }]}>
          <Text style={styles.riskTitle}>
            {result.risk_level === "High"
              ? "HIGH SCAM RISK"
              : result.risk_level === "Medium"
                ? "POTENTIAL SCAM RISK"
                : "LOW SCAM RISK"}
          </Text>
          <Text style={styles.riskProbability}>
            {Math.round(result.scam_probability)}% likelihood of scam
          </Text>
        </View>
      )}

      {result && (
        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>{getAdvice()}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  header: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 20,
    height: 160,
    fontSize: 18,
    backgroundColor: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  riskBanner: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  riskTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  riskProbability: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  adviceBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
  },
  adviceText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});