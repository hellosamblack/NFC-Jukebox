# Fusion Enclosure Strategy (Integrated Module)

## Overview
This strategy utilizes the **Waveshare ESP32-S3-Touch-LCD-3.5**, significantly simplifying the internal mounting and wiring. The design remains a **two-shell architecture** with an internal carrier frame, but with fewer components to house.

## Modeling Plan (Autodesk Fusion)
1. **Integrated Module Bounding Box:** Model the Waveshare module (including the header and battery connector) as the primary keep-out volume.
2. **Keep-out Volumes:** Model bounding boxes for the 18650 battery, Qi coil, NFC antenna, and the Big Red Skip button.
3. **Internal Carrier:** Design a subframe that clips the Waveshare module in place and provides mounting points for the sensors and buttons.
4. **Outer Shells:** Ergonomic top and bottom shells. The top shell now features a single large window for the 3.5" display.
5. **Mechanical Details:** Dock geometry, magnet pockets, and gasket grooves.

## Component Layout & Keep-Out Zones
The enclosure is divided into three height zones:
- **Top Zone (Interaction):** Card slot, NFC antenna/read window, and the **3.5" IPS Touch Display** (which provides both UI and card labels).
- **Mid Zone (Logic & Buttons):** Big Red Skip button and the sensor array (PIR, Vibration, Card Presence).
- **Bottom Zone (Power & Docking):** 18650 battery, Qi receiver, and docking magnets.

## Isolation Rules
- **Qi/Docking:** Keep magnets in the outer ring of the base. Ensure the center is clear for the Qi coil.
- **NFC:** Isolate the PN532 antenna from the Qi coil and the display's noisy power rails.
- **Magnets:** Do not place docking magnets near the NFC read zone.

## Splash Resistance
- **Card Slot:** Funnel-shaped entry with a labyrinth path to prevent liquid ingress.
- **Seams:** Tongue-and-groove perimeter with a TPU or silicone gasket.
- **Lens:** The 3.5" display should be recessed or sit behind a bonded clear lens to protect the capacitive touch surface.

## Manufacturing & Assembly
- **Materials:** PETG or ASA (main shells), TPU (gasket).
- **Serviceability:** Use heat-set inserts for all main fasteners. The module should be easily accessible for firmware updates via its USB-C port.
