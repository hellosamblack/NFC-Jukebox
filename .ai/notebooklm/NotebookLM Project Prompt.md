# NotebookLM Research Prompt: NFC Music Controller Hardware Planning

Use `.ai/setupPrompts/NotebookLM Project Prompt.md` as the canonical version of this prompt.

This copy exists in `hardware/` so the hardware research assets stay together, but it should remain aligned with the setup prompt version.

## Role

Act as a practical **hardware systems engineer, low-power embedded designer, and enclosure design reviewer** for an ESPHome + Home Assistant NFC music controller.

Your job is to turn the attached source documents into a **decision-ready hardware planning package**.

## Project summary

I am designing a **battery-powered, water-resistant, magnetically docked NFC music controller** in a playful 3D-printed enclosure.

The device should:

- read a physical NFC card inserted into a slot,
- trigger Home Assistant to play mapped media on a WiiM-based audio setup,
- survive casual party / kitchen use,
- be easy to dock onto a Qi charger without precise alignment,
- use aggressive sleep / wake behavior to preserve battery.

## Key hardware constraints

- **MCU direction:** ESP32-P4 is the aspirational display-heavy option; ESP32-S3 is the safer fallback. If the sources do not clearly support a P4 recommendation, say so plainly and recommend an S3-first prototype path.
- **NFC behavior:** The NFC reader should not poll forever while a card remains inserted. Prefer a one-shot read cycle triggered by insertion or wake activity.
- **Inputs:** 6 physical buttons: Volume Up, Volume Down, Left, Right, Select, and a large “Big Red Skip” button.
- **Wake sources:** PIR proximity sensor, bump/vibration event, card insertion/presence event, and button wake.
- **Displays:**
  - primary high-refresh display for “Currently Playing” and “Up Next”,
  - secondary SPI ePaper display beneath the card slot for static information.
- **Power:** internal rechargeable cell, Qi wireless charging receiver, deep sleep with low standby draw.
- **Mechanical:** enclosure should be splash resistant and forgiving to use when docked or when inserting cards carelessly.

## Source usage instructions

Use the attached source documents as the primary basis for your answer, especially:

- `hardware/notebooklm/Hardware BOM.md`
- `hardware/notebooklm/Fusion Enclosure Strategy.md`
- `hardware/notebooklm/Integration and GPIO Strategy.md`

If a claim is not directly supported by source material, label it clearly as one of:

- **Estimate**
- **Assumption**
- **Risk / needs validation**

Do not present uncertain pin mappings, ESPHome support claims, or component compatibility as settled facts.

## Deliverables

Produce the response in the following sections.

### 1. Recommended architecture

- Recommend a primary prototype architecture.
- Explain whether the first prototype should use ESP32-S3 or ESP32-P4.
- Include a brief tradeoff table for P4 vs S3.

### 2. Detailed BOM

Create a BOM table with these columns:

- Subsystem
- Recommended part
- Approximate cost (USD)
- Why it is a good fit
- Key downside or integration risk
- Integration notes

Also include:

- an estimated prototype cost range,
- items that can wait until rev B,
- any parts that are high-risk or likely to change after early testing.

### 3. Autodesk Fusion enclosure strategy

Provide a detailed enclosure modeling strategy covering:

- internal architecture and part stacking,
- card-slot design,
- splash resistance / sealing strategy,
- button sealing options,
- display window strategy,
- Qi coil, magnet ring, and NFC keep-out zones,
- bosses, standoffs, inserts, and serviceability recommendations.

### 4. Hardware integration and wiring strategy

Provide a clear block-diagram-style explanation of the wiring approach.

You must address the **GPIO / wake constraint** directly:

- how to handle 6 buttons,
- how to preserve wake-capable pins,
- whether to use an I/O expander, resistor ladder, or shared interrupt line,
- how to separate fast display signals from wake-critical inputs,
- how the system determines the wake cause after boot.

### 5. Prototype sequencing

Describe the most sensible order to prototype the system, including:

1. electronics bring-up,
2. sleep / wake validation,
3. NFC one-shot read behavior,
4. enclosure fit checks,
5. dock / charging validation,
6. refinement items for later revisions.

### 6. Risks and unknowns

End with a short list of the biggest unresolved technical risks, especially around:

- ESPHome support maturity,
- power budget,
- Qi + magnets + NFC interaction,
- sealing around the slot and buttons,
- display interface complexity.

## Output style

- Be concrete, structured, and engineering-focused.
- Favor recommendations over generic brainstorming.
- Explicitly separate **best current recommendation** from **stretch goal ideas**.
- Keep the tone practical: this should help me buy parts, model the enclosure in Fusion, and avoid dead-end hardware decisions.
