---
applyTo: 'hardware/notebooklm/**/*.md'
---

Treat files in `hardware/notebooklm/` as decision-support sources for the NFC music controller hardware track.

- Prefer concrete recommendations over open-ended brainstorming.
- Separate **verified facts**, **estimates**, and **risks / needs validation**.
- Default to an **ESP32-S3-first prototype recommendation** unless current source material clearly supports ESP32-P4 for the requested task.
- Emphasize low-standby-power design, event-driven NFC reads, wake-source aggregation, and pin-budget discipline.
- Call out interference risks between **Qi charging**, **docking magnets**, and the **NFC antenna** whenever enclosure or stack-up decisions are discussed.
- For BOM content, include approximate costs, tradeoffs, and integration notes.
- For enclosure content, focus on Fusion-friendly modeling order, serviceability, sealing realism, and keep-out zones.
- Keep additions concise and link to adjacent files in `hardware/notebooklm/` instead of duplicating large sections.
