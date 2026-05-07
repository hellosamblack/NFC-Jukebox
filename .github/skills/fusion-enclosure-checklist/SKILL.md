# fusion-enclosure-checklist

Use this skill when reviewing or planning the mechanical enclosure for the NFC music controller in Autodesk Fusion.

## Use when

- evaluating enclosure architecture,
- planning keep-out zones,
- reviewing splash-resistance strategy,
- checking button and card-slot design,
- assessing Qi / magnet / NFC placement risks,
- turning concept sketches into a practical Fusion modeling sequence.

## Do not use when

- the task is mainly software or Home Assistant logic,
- the task is mainly BOM pricing,
- the user wants a finished CAD model generated automatically.

## Checklist

### Internal layout

- Are battery, displays, Qi coil, magnets, NFC antenna, PCB, and wiring volumes defined as keep-outs?
- Is there a separate internal carrier or another strategy that supports iteration?
- Are cable paths and service access planned?

### Card slot

- Is the entry funnel-shaped or otherwise alignment-friendly?
- Is there a deterministic card presence detection point?
- Is splash ingress reduced via a labyrinth or stepped path?

### Sealing

- Is the main seam tongue-and-groove or otherwise compression-controlled?
- Are gasket grooves and compression stops included?
- Are button seals realistic for repeated use?

### Docking and charging

- Is the Qi coil center kept clear?
- Are magnets placed outside critical NFC and Qi interference zones?
- Can docking force and alignment be tuned without redesigning the whole shell?

### Serviceability

- Are heat-set inserts or durable fastener strategies used?
- Can the enclosure be reopened without damaging critical parts?
- Are high-risk modules mounted in a way that supports revision churn?

## Output expectations

- Give a practical review, not generic industrial design advice.
- Flag the top mechanical risks first.
- Recommend the next prototype checks to run before committing to a refined print.
