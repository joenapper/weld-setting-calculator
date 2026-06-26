# Weld Setting Calculator – Project Overview

## 🎯 Vision

Build a fast, trustworthy SaaS that provides **starting welding parameters** based on a small number of user inputs.

> **Goal:** Help users get close to the correct settings quickly. The recommendations are **starting points only** and should always be validated on scrap material.

---

# Core Principles

- ✅ Single-screen experience
- ✅ Live visual feedback
- ✅ Process-aware recommendations
- ✅ Beginner friendly
- ✅ Data-driven (lookup tables, not magic formulas)
- ✅ Easily tunable as more test data becomes available

---

# User Flow

```text
Select Process
      │
      ▼
Joint Type + Position
      │
      ▼
Material
      │
      ▼
Units
      │
      ▼
Consumable Size
      │
      ▼
Material Thickness A + B
      │
      ▼
Live Joint Illustration
      │
      ▼
Calculate
      │
      ▼
Recommended Starting Settings
```

## 🧩 Inputs

1. Process
- MIG
- TIG
- Stick

2. Joint Type
- Fillet
- Butt
- Lap (future)
- Corner (future)

3. Welding Position
- Flat
- Horizontal
- Vertical Up
- Overhead

4. Material
- Mild Steel
- Stainless Steel
- Aluminium

5. Units
- Metric (mm)
- Imperial (inch)

Switching units converts existing values rather than clearing them.

6. Consumables

**MIG**
- Wire: 0.6 / 0.8 / 0.9 / 1.0 / 1.2 mm

**Stick**
- Electrode: 2.0 / 2.5 / 3.2 / 4.0 mm

**TIG**
- Filler: 1.6 / 2.4 / 3.2 mm
- Tungsten: 1.6 / 2.4 mm

7. Material Thickness
- Member A
- Member B

---

# Live Joint Illustration

The illustration is the feature that differentiates the product.

## Requirements

- Clean 2D cross-section
- Updates instantly
- Plate thickness scales with inputs
- Clearly label Member A and Member B
- Show selected joint type

Example:

```text
Fillet Joint

 Member A
──────────────
│
│◢ Weld
│
└────────────── Member B
```

---

# Recommendation Engine

## Philosophy

Avoid one giant formula.

Use:

```
Base Values
      +
Lookup Tables
      +
Modifiers
      =
Recommendation
```

## MIG

Outputs

- Voltage
- Amperage
- Wire Feed Speed (future)

Modifiers

- Material
- Position
- Wire Diameter
- Thickness

Approximate baseline

| Thickness | Voltage |
|-----------|---------|
|1 mm|16–17 V|
|2 mm|18–19 V|
|3 mm|19–21 V|
|5 mm|22–24 V|

## TIG

Outputs

- Amperage
- AC/DC
- Tungsten Size
- Shielding Gas

No voltage recommendation.

Rule of thumb:

≈40 A per mm (steel).

## Stick

Outputs

- Amperage Range
- Polarity Notes

No voltage recommendation.

Typical electrode ranges

| Electrode | Amps |
|-----------|------|
|2.5 mm|60–90|
|3.2 mm|90–140|
|4.0 mm|140–190|

---

# Results Screen

Display:

- Recommended Settings
- Input Summary
- Process-specific notes

Example

```
Recommended Starting Settings

Voltage
18–20 V

Amperage
110–130 A

Reminder

✓ Test on scrap
✓ Adjust to suit machine and technique
```

For TIG and Stick replace voltage with gas/polarity information.

---

# Architecture

```text
             User Interface
                    │
      ┌─────────────┴─────────────┐
      │                           │
Live Joint Renderer      Form Validation
      │                           │
      └─────────────┬─────────────┘
                    │
        Recommendation Engine
                    │
      ┌────────┬────────┬────────┐
      │        │        │
   MIG Data  TIG Data Stick Data
                    │
             Results Builder
```

---

# Data Strategy

Store values in editable JSON or database tables.

Benefits

- Easy tuning
- Versioning
- Future support for additional materials and machines

---

# MVP

- MIG
- TIG
- Stick
- Mild Steel
- Stainless
- Aluminium
- Metric/Imperial
- Live illustration
- Recommendations

---

# Future Features

- FCAW
- Pulse MIG
- Machine-specific presets
- Printable PDF
- Save favourite settings
- WPS integration
- Heat input calculator
- Multi-pass recommendations

---

# Disclaimer

> These recommendations are intended as starting points only. Actual welding parameters vary by machine, consumables, shielding gas, joint preparation, technique and environment. Always perform test welds on scrap material and follow safe welding practices.
