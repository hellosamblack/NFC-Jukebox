# hardware-bom-review

Use this skill when the task is to create, revise, compare, or sanity-check the hardware BOM for the NFC music controller.

## Use when

- comparing ESP32-S3 vs ESP32-P4 prototype choices,
- estimating rev-A prototype cost,
- deciding which parts are must-buy now vs defer to rev B,
- reviewing standby-power implications of part choices,
- turning rough component ideas into a structured purchasing table.

## Do not use when

- the task is mainly firmware architecture,
- the task is mainly enclosure CAD modeling,
- the user wants an exact PCB schematic or verified pinout from datasheets alone.

## Workflow

1. Start from `hardware/notebooklm/Hardware BOM.md` and `hardware/notebooklm/Rev A BOM Estimate.md`.
2. Preserve the distinction between **recommendation**, **estimate**, and **risk**.
3. Group parts by subsystem.
4. Include approximate costs and note the source of cost uncertainty.
5. Separate **rev A essentials**, **optional upgrades**, and **rev B deferrals**.
6. Call out parts likely to change after enclosure, thermal, or power-budget testing.

## Output expectations

- Use compact tables.
- Include subtotal and total estimates when possible.
- Highlight the top 3-5 cost or integration risks.
- Prefer a decision-ready recommendation over exhaustive catalog dumps.
