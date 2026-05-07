# Hardware Documentation (Integrated Strategy)

This directory contains the strategic and technical documentation for the NFC Jukebox hardware, optimized for an **Integrated HMI Module** approach.

## Contents
- [**Hardware Configurator**](./configurator.html): Interactive tool to compare "Discrete" vs "Integrated" BOMs.
- [**Hardware BOM**](./Hardware%20BOM.md): Detailed component list for the optimized Rev A prototype.
- [**Integration and GPIO Strategy**](./Integration%20and%20GPIO%20Strategy.md): Pin allocation, touch UI, and power management.
- [**Fusion Enclosure Strategy**](./Fusion%20Enclosure%20Strategy.md): Simplified mechanical design for the integrated module.

## Key Hardware Specs
- **Main Module:** Waveshare ESP32-S3-Touch-LCD-3.5 (IPS Touch + PMIC)
- **NFC:** PN532
- **Power:** 18650 Li-ion with 10W Qi Wireless Charging
- **UI:** 3.5" Capacitive Touch + Physical "Big Red Skip" Button
- **Enclosure:** Hybrid internal carrier + external shell (Splash-resistant)

