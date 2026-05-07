# Autodesk Fusion Enclosure Strategy for NotebookLM Source Pack

This source is intended to help NotebookLM produce enclosure recommendations that are practical for iterative 3D printing, splash resistance, and magnetic Qi docking.

## Design goals

- Playful desktop object that still feels robust.
- Blind magnetic docking for charging.
- Water-resistant enough for kitchen / bar / party use.
- Card slot interaction that feels forgiving, even with sloppy alignment.
- Serviceable internal layout for repeated electronics changes.

## Recommended enclosure architecture

Use a **two-shell design** plus internal carrier:

1. **Top shell** — visible body, card slot, button openings, display windows.
2. **Bottom shell** — docking/Qi interface and screw access.
3. **Internal carrier frame** — rigid printed subframe holding PCB, battery, displays, and NFC assembly independently of the outer shell.

This separation reduces the pain of hardware iteration because the outer industrial design can stay mostly stable while the carrier changes.

## Suggested Fusion modeling order

1. Model the **keep-out volumes** first: battery, Qi coil, display modules, NFC antenna zone, buttons, speaker cavity, PCB envelope.
2. Build the **internal carrier** around those volumes with bosses, slots, and cable channels.
3. Model the **outer shell** around the carrier with wall thickness and ergonomic form.
4. Add **dock geometry**, magnet pockets, and charging alignment features.
5. Add **water-resistance features** last: gasket grooves, seal lips, drain paths, and button membrane details.

## Card slot strategy

The card slot is the hardest sealing problem, so it should be mechanically forgiving and only moderately sealed.

Recommended approach:

- Use a **funnel-shaped entry** so cards self-center.
- Add a **replaceable low-friction throat insert** if wear is expected.
- Use a **labyrinth path** or stepped internal overhang to reduce straight-line splash ingress.
- Place the actual electronics slightly behind the exposed slot line.
- Put the **card presence sensor** where insertion depth is deterministic.

## Water-resistance strategy

Target “splash resistant” rather than “submersible.”

### Main seam

- Use a tongue-and-groove perimeter seam.
- Add a continuous silicone or foam gasket in a dedicated groove.
- Include compression stops so screws bottom out consistently without over-compressing the gasket.

### Buttons

Prefer one of these approaches:

1. **Off-the-shelf sealed panel buttons** for the lowest risk.
2. **Printed plungers with silicone boots** where aesthetics matter more.
3. **Single flexible membrane region** for clustered navigation buttons.

The “Big Red Skip” control is a perfect candidate for a larger sealed panel actuator or a membrane-backed plunger with more travel.

### Display windows

- Use a bonded clear lens or recessed window insert.
- Avoid exposed display module edges at the exterior surface.
- Design a compression land for adhesive tape or gasket film if using a separate lens.

## Magnetic dock + Qi strategy

### Basic layout rule

Treat the bottom of the enclosure as three zones:

- **Center:** Qi receiver coil keep-out.
- **Near-center ring:** optional structural plastic and alignment geometry.
- **Outer ring:** magnet pockets, preferably segmented rather than a continuous steel-heavy structure.

### Placement guidance

- Keep magnets **out of the NFC antenna region** entirely.
- Avoid placing ferromagnetic material directly behind or through the center of the Qi coil.
- Use a printed spacer thickness that preserves charger coupling while still protecting the coil.
- Prefer **symmetrical segmented magnets** or a ring outside the coil’s highest-coupling area.

### Serviceability tip

Make the magnet carrier a separate part or insert so docking force can be tuned after the first print.

## Component layout strategy

### Top zone

- Card slot
- NFC antenna / read window
- ePaper label display

### Mid zone

- Main PCB
- buttons and light pipes
- buzzer cavity

### Bottom zone

- battery
- Qi receiver
- docking magnets
- primary LCD/OLED if the UX calls for a base-facing screen

The NFC antenna should be isolated from both the Qi coil and the docking magnets. If a bottom display is used, maintain enough distance and shielding discipline so the NFC reader is not directly stacked over noisy power circuitry.

## Bosses, inserts, and mounting recommendations

- Use **heat-set inserts** for the main service fasteners.
- Use floating or slotted holes for modules with tolerance variation.
- Add **soft compression pads** for displays and battery restraint instead of rigid clamping only.
- Build cable routing channels into the carrier so wires do not drift into the slot or coil areas.

## Material guidance for iterative prints

- **PETG or ASA** is a better functional default than PLA for warm environments.
- **TPU** is useful for gaskets, feet, or flexible button membranes.
- If printing translucent light features, isolate them from the main shell to avoid cosmetic bleed.

## NotebookLM emphasis points

When generating enclosure advice, prioritize:

1. keep-out zones and stack-up order,
2. sealing realism,
3. blind docking ergonomics,
4. serviceability during prototype churn,
5. explicit warnings where Qi, magnets, and NFC may interfere with each other.
