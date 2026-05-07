# Integration and GPIO Strategy (Integrated Module)

## Hardware Architecture & Power
- **Integrated Module:** This strategy uses the **Waveshare ESP32-S3-Touch-LCD-3.5**. This module bundles the ESP32-S3, a 3.5" IPS capacitive touch display, and the AXP2101 Power Management IC (PMIC).
- **Power Management:** The AXP2101 handles battery charging (via PH2.0/MX1.25 connector) and power path management. Battery life is optimized by leveraging the ESP32-S3's deep sleep modes and the PMIC's efficient regulation.
- **EMI Isolation:** While the module is integrated, the **PN532 NFC antenna** and **Qi receiver coil** still require physical isolation from each other and from the docking magnets to prevent detuning and interference.

## Pin Allocation & Wake Logic
The Waveshare module breaks out several GPIOs via a 2.54mm header.

### 1. Wake-Critical Inputs (Direct GPIO)
These inputs are wired directly to the available RTC-capable pins on the header to wake the device from deep sleep:
- **Card Presence Switch:** Mechanical detection of card insertion.
- **PIR Sensor (AM312):** Proximity-based wake.
- **Vibration Switch (SW-420):** Motion/bump wake.
- **Big Red Skip Button:** Physical interrupt for skipping tracks.

### 2. Runtime-Only Inputs (Touch UI)
- **UI Navigation:** Volume Up/Down, Left, Right, and Select are handled via **capacitive touch zones** on the 3.5" display. This eliminates the need for a separate I/O expander or resistor ladder.

### 3. High-Bandwidth Signals
- **Primary Display:** Uses an internal 8-bit parallel or QSPI interface (pre-wired on the module).
- **Secondary Labels:** Instead of a separate ePaper display, the top portion of the 3.5" LCD is reserved for static card/slot labels.

## NFC Polling Strategy
- The system remains in deep sleep until a **Card Presence** or **Proximity** event occurs.
- Upon wake, the MCU enables the **PN532** (connected via I2C to IO17/SDA and IO18/SCL), performs a one-shot read, and publishes the ID to Home Assistant.
- Polling is immediately halted and the system enters a low-power "card parked" state or returns to sleep.

## ESPHome Compatibility
- The Waveshare ESP32-S3-Touch-LCD-3.5 is well-supported in ESPHome using the `display` and `touchscreen` components.
- The AXP2101 PMIC can be monitored via I2C to provide battery telemetry (voltage/percentage) to Home Assistant.

