# NotebookLM Source Index

This file is the upload guide for building a new NotebookLM notebook around the **hardware track** of the NFC music controller project.

## Recommended upload set

Upload these files first, in this order:

1. `.ai/setupPrompts/NotebookLM Project Prompt.md`
   - Canonical research brief.
   - Tells NotebookLM how to structure the answer and how to label uncertainty.

2. `hardware/notebooklm/Hardware BOM.md`
   - Core component recommendations.
   - Includes approximate costs, tradeoffs, and integration notes.

3. `hardware/notebooklm/Fusion Enclosure Strategy.md`
   - Mechanical guidance for Autodesk Fusion.
   - Covers shell architecture, sealing, card slot design, and docking constraints.

4. `hardware/notebooklm/Integration and GPIO Strategy.md`
   - Solves the wake-pin and wiring-budget problem.
   - Frames when to use RTC GPIO directly vs expanders or shared interrupt lines.

5. `hardware/notebooklm/Rev A BOM Estimate.md`
   - Spreadsheet-style prototype cost sheet.
   - Useful when deciding what to buy for the first hardware pass.

6. `hardware/NotebookLM Project Prompt.md`
   - Secondary copy of the prompt for hardware-local context.
   - Optional if the canonical `.ai/` prompt is already uploaded.

## Optional supporting uploads

Upload these only if you want notebook context about the existing software repo:

- `README.md`
  - Explains the current app and project layout.
- `AGENTS.md`
  - Helps an AI understand how the repo separates the sticker app from the hardware workstream.

## Best NotebookLM usage pattern

### Notebook purpose

Use this notebook for:

- BOM tradeoff analysis,
- Autodesk Fusion enclosure planning,
- wake/sleep hardware architecture,
- pin-budget and GPIO strategy,
- prototype sequencing,
- risk reviews for Qi, magnets, NFC, and splash resistance.

Do **not** rely on this notebook alone for final schematics or exact PCB pin assignments without checking current datasheets and ESPHome support status.

## Suggested first questions to ask NotebookLM

1. “Recommend a rev-A hardware architecture for this project and explain whether I should prototype on ESP32-S3 or ESP32-P4 first.”
2. “Turn the BOM sources into a shopping list grouped by must-buy now, optional for rev A, and defer to rev B.”
3. “Give me an Autodesk Fusion enclosure plan with keep-out zones for Qi, docking magnets, NFC, battery, and displays.”
4. “Propose a wake-source and GPIO allocation strategy that preserves sleep reliability and avoids wasting RTC-capable pins.”
5. “List the biggest technical risks I should validate before ordering custom PCBs.”

## Recommended notebook scope split

If the notebook starts getting too broad, split into two notebooks:

- **Notebook A — Hardware Architecture**
  - BOM
  - integration
  - power and wake behavior

- **Notebook B — Mechanical / Enclosure**
  - Fusion workflow
  - sealing
  - docking geometry
  - slot and button design

## Maintenance note

When any of the source files change materially, re-upload the updated versions so NotebookLM is not working from stale assumptions.
