Iterative Design Strategy for Splash-Resistant Hardware Enclosures
To build an iterative, splash-resistant prototype, you should adopt a two-shell design paired with an internal carrier frame [1, 2]. This architecture isolates your outer industrial design (the top and bottom shells) from the internal mounting structure, saving you from having to redesign the entire enclosure every time a component changes [2].
Here is your Autodesk Fusion modeling plan and keep-out strategy:
1. Recommended Fusion Modeling Order
Start with keep-out volumes: Model the raw bounding boxes for your battery, Qi coil, display modules, NFC antenna zone, buttons, speaker cavity, and PCB envelope first [3].
Build the internal carrier: Design a rigid subframe around these keep-out volumes, adding bosses, slots, and dedicated cable routing channels so wires don't drift into the card slot or charging coil areas [3, 4].
Model the outer shells: Create the top and bottom exterior shells around the carrier, adding ergonomic form and wall thickness [3].
Add mechanical details last: Cut out dock geometry, magnet pockets, tongue-and-groove seams, and gasket grooves [3].
2. Component Layout & Keep-Out ZonesTo prevent electrical and magnetic interference, divide the enclosure into three specific height zones:
Top Zone (Interaction): House the card slot, the NFC antenna/read window, and the ePaper label display [5].
Mid Zone (Logic & UI): Place the main ESP32-S3 PCB, buttons, light pipes, and buzzer cavity here [5].
Bottom Zone (Power & Docking): This area holds the battery, Qi receiver, docking magnets, and your primary TFT LCD display [5].
3. Magnetic & RF Isolation Rules
Docking Base Layout: Treat the bottom of the enclosure as three concentric rings. The center is the Qi receiver coil keep-out zone. The near-center ring should be reserved for structural plastic and physical alignment geometry. The outer ring is for the docking magnets [6].
NFC Isolation: You must keep docking magnets entirely out of the NFC antenna region [6]. The NFC antenna must also be physically isolated from the Qi coil and shielded from the noisy power circuitry of the primary display [5].
Qi Clearances: Do not place any ferromagnetic material directly behind or through the center of the Qi coil [6]. Use symmetrical segmented magnets for the dock instead of a continuous steel ring to prevent detuning the charger [6]. Ensure you include a printed spacer that protects the coil while maintaining good magnetic coupling [6].
4. Splash Resistance & Mechanical Features
The Card Slot: This is the most difficult area to waterproof. Design a funnel-shaped entry so cards self-center, and use a labyrinth path (or stepped internal overhang) to block straight-line liquid ingress [7]. Place your card presence switch at a deterministic insertion depth, with the actual electronics slightly set back from the exposed slot [7].
Water-Resistant Seams: Use a tongue-and-groove perimeter seam on the outer shells, packed with a continuous silicone cord, foam, or TPU gasket [4, 7]. Crucially, add compression stops so that tightening the screws doesn't over-crush the gasket [7].
Displays & Battery: Use soft compression pads to hold the displays and battery in place rather than rigid plastic clamping [4]. The displays should sit behind a bonded clear lens or recessed window insert so module edges aren't exposed to the outside [8].
Serviceability: Rely on heat-set inserts for all main fasteners [4]. Additionally, consider making the bottom magnet carrier a separate printed insert; this allows you to easily adjust and reprint the docking force without changing the entire bottom shell [5].
For your iterative prints, use PETG or ASA rather than PLA to ensure the enclosure survives warm environments, and utilize TPU for any custom gaskets or flexible button membranes [4].