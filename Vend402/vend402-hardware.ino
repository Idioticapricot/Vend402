/**
 * Vend402 - Hardware Integration (Arduino/ESP32)
 * WebSocket listener for Supabase Realtime dispense events
 * Integrates into existing QR_CODE.ino
 *
 * Add this code to your existing QR_CODE.ino sketch
 * Requires: ArduinoWebsocket library
 */

// ========== VEND402 HARDWARE INTEGRATION ==========

/**
 * Vend402 configuration and state
 */
struct Vend402State {
  bool enabled = true;
  String gatekeeperUrl = "";
  String machineId = "";
  bool wsConnected = false;
  unsigned long lastWsAttempt = 0;
  const unsigned long WS_RETRY_INTERVAL = 5000; // Retry every 5 seconds
};

Vend402State vend402;

/**
 * Initialize Vend402 (call from setup())
 * 
 * Example:
 *   void setup() {
 *     Serial.begin(115200);
 *     // ... other setup code ...
 *     setupVend402();
 *   }
 */
void setupVend402() {
  vend402.machineId = "machine-" + String(random(1000000)); // Generate unique ID if not set
  
  // Construct gatekeeper URL from active chain configuration
  if (activeChain) {
    vend402.gatekeeperUrl = String("https://") + activeChain->merchantApiBase + "vend402-gatekeeper";
  }
  
  Serial.println("[Vend402] Initialized - Machine ID: " + vend402.machineId);
}

/**
 * Connect to Supabase Realtime for dispense events
 * Call this after WiFi is connected
 * 
 * Listens to channel: machine-<machineId>
 * Events: vend402_dispense, vend402_payment_verified
 */
void connectVend402Realtime() {
  if (!WiFi.isConnected()) {
    Serial.println("[Vend402] WiFi not connected, skipping Realtime");
    return;
  }

  if (!vend402.enabled) {
    Serial.println("[Vend402] Disabled");
    return;
  }

  // Check if we should retry
  if (millis() - vend402.lastWsAttempt < vend402.WS_RETRY_INTERVAL && vend402.wsConnected) {
    return; // Already connected
  }

  vend402.lastWsAttempt = millis();

  Serial.println("[Vend402] Connecting to Supabase Realtime...");

  // In real implementation, use Supabase Realtime WebSocket or MQTT
  // For now, we'll set up a polling mechanism to check dispense status
  
  // Pseudo-code for Supabase Realtime (requires supabase-arduino library):
  // 
  // const char* supabaseUrl = activeChain->supabaseUrl.c_str();
  // supabase.listen("machine-" + vend402.machineId, [](const String& payload) {
  //   Serial.println("[Vend402] Realtime event: " + payload);
  //   
  //   // Parse JSON and check for dispense event
  //   // if (event == "vend402_dispense") {
  //   //   startDispensing();
  //   // }
  // });

  vend402.wsConnected = true;
  Serial.println("[Vend402] Realtime connected (polling mode)");
}

/**
 * Handle Vend402 payment event from frontend
 * Called when payment is verified and dispense is triggered
 * 
 * This would be triggered via Supabase channel broadcast or webhook
 */
void handleVend402PaymentVerified(const String& txHash, const String& challengeId) {
  Serial.println("[Vend402] Payment verified - TX: " + txHash);
  Serial.println("[Vend402] Challenge: " + challengeId);

  // Security: Log payment for audit trail
  if (SPIFFS.exists("/vend402_log.txt")) {
    File logFile = SPIFFS.open("/vend402_log.txt", "a");
    String logEntry = String(millis()) + "," + txHash + "," + challengeId + "\n";
    logFile.print(logEntry);
    logFile.close();
    Serial.println("[Vend402] Payment logged");
  }

  // Trigger dispense
  startDispensing();
}

/**
 * Validate a Vend402 challenge response
 * Called before accepting a payment challenge
 */
bool validateVend402Challenge(const String& payload) {
  // Parse JSON
  // Check required fields: vend402, challengeId, amount, destination, memo, expiresAt
  // Verify expiresAt is in future
  // Check amount matches machine price

  // TODO: Implement JSON parsing (use ArduinoJson library)
  
  return true; // For now, always valid
}

/**
 * Request a payment challenge from the Vend402 gatekeeper
 * (Alternative to using QR code - direct API call)
 */
void requestVend402Challenge() {
  if (!WiFi.isConnected()) {
    Serial.println("[Vend402] Cannot request challenge - WiFi not connected");
    return;
  }

  Serial.println("[Vend402] Requesting challenge from gatekeeper...");

  HTTPClient http;
  String url = vend402.gatekeeperUrl;

  // Build request JSON
  String payload = "{\"deviceId\":\"" + vend402.machineId + "\",\"action\":\"getChallenge\"}";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);
  Serial.printf("[Vend402] Response code: %d\n", httpCode);

  if (httpCode == 402 || httpCode == 200) {
    String response = http.getString();
    Serial.println("[Vend402] Challenge response: " + response);

    // Parse and validate challenge
    if (validateVend402Challenge(response)) {
      // Display payment QR to user
      // (show QR code on display with payment details)
    }
  } else {
    Serial.printf("[Vend402] Error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

/**
 * Poll for dispense signal (fallback if Realtime not available)
 * Call this periodically from loop()
 */
unsigned long lastVend402Poll = 0;
const unsigned long VEND402_POLL_INTERVAL = 1000; // Poll every 1 second

void pollVend402Dispense() {
  if (!vend402.enabled) return;

  if (millis() - lastVend402Poll < VEND402_POLL_INTERVAL) {
    return;
  }

  lastVend402Poll = millis();

  // In real implementation, check Supabase for pending dispense commands
  // For now, this is a placeholder for future enhancement
}

/**
 * ==========  INTEGRATION INTO EXISTING SKETCH  ==========
 *
 * 1. Add to top-level includes:
 *    #include <ArduinoJson.h>           // For JSON parsing
 *    #include <HTTPClient.h>            // Already included
 *
 * 2. Add to setup() function:
 *    setupVend402();
 *
 * 3. Add to WiFi connection handler (after WiFi.status() == WL_CONNECTED):
 *    connectVend402Realtime();
 *
 * 4. Add to loop() function:
 *    pollVend402Dispense();
 *
 * 5. Modify handleWebSocketMessage() to call:
 *    if (event == "vend402_dispense") {
 *      handleVend402PaymentVerified(payload["txHash"], payload["challengeId"]);
 *    }
 *
 * 6. Environment variables (in Preferences or EEPROM):
 *    prefs.putString("vend402_merchant", "GXXXXXX..."); // Merchant Stellar account
 *    prefs.putString("vend402_gatekeeper", "https://..."); // Gatekeeper URL
 */

// ========== END VEND402 HARDWARE INTEGRATION ==========
