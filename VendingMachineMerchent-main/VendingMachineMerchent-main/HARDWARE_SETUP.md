# Hardware Setup Guide

## Overview
Your ESP32 Vending Machine firmware is designed to be **provisioned wirelessly**. You do NOT need to hardcode the API Key or Machine ID into the code.

## Prerequisites
1.  **Configure Firmware**: Open `QR_CODE.ino` and update:
    *   `stellarConfig.merchantApiBase`: Your deployed app URL + `/api/` (e.g., `vend402.vercel.app/api/`).
    *   `stellarConfig.paymentUrlBase`: Your deployed app URL + `/pay/` (e.g., `vend402.vercel.app/pay/`).
2.  **Setup Arduino IDE**:
    *   **Install ESP32 Board**: File -> Preferences -> Additional Boards Manager URLs -> `https://dl.espressif.com/dl/package_esp32_index.json`. Then Tools -> Board -> Boards Manager -> Install `esp32` by Espressif.
    *   **Install Libraries**: Tools -> Manage Libraries -> Install:
        *   `TFT_eSPI` (by Bodmer)
        *   `ArduinoJson` (by Benoit Blanchon)
        *   `WebSockets` (by Markus Sattler)
        *   `qrcode_espi` (if not found, copy the library folder manually or download .zip).
    *   **Select Board**: Tools -> Board -> ESP32 Dev Module.
    *   **Select Port**: Tools -> Port -> (Select your USB port).
3.  **Flash the Firmware**: Click the "Upload" (Arrow) button.
4.  **Register Machine**: Create a machine in the Merchant Dashboard and copy the **API Key**.

## Step-by-Step Provisioning

### 1. Connect to the Machine
When the ESP32 starts up, it creates a WiFi Access Point.
*   **SSID**: `ESP32-Setup`
*   **Password**: `setup1234` (or as configured in line 29 of `QR_CODE.ino`)
*   **Action**: Connect your phone or laptop to this network.

### 2. Configure WiFi & Blockchain
1.  A "Captive Portal" should open automatically. If not, go to `http://192.168.4.1` in your browser.
2.  **Select Network**: Choose your local WiFi network.
3.  **Password**: Enter your WiFi password.
4.  **Blockchain Network**: Select **Stellar (Vend402)**.
5.  Click **Save and Connect**.

### 3. Register the Product (Link to Dashboard)
The device will connect to your WiFi and then show a page to "Add New Product".
1.  **Product Name**: Enter a name (e.g., "Coke").
2.  **API Key**: Paste the **API Key** from your Dashboard.
3.  Click **Verify & Show Payment QR**.

### 4. Verification
*   The ESP32 will contact your Merchant Server (`vend402-gatekeeper`).
*   It verifies the API Key and fetches the Price and Machine ID (Memo).
*   **Success**: The screen will show a Payment QR Code.
*   **Dashboard**: The machine status should ideally update (if we implemented a heartbeat, but for now, it's ready to accept payments).

## Troubleshooting
*   **Stuck on "Connecting..."**: Check your WiFi password and ensure the network is 2.4GHz (ESP32 doesn't support 5GHz).
*   **Verification Failed**: Ensure your Merchant Server is running and accessible from the internet (or use ngrok/localtunnel if testing locally).
