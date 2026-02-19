# MoziThermoDB-Settings

[![npm version](https://badge.fury.io/js/mozithermodb-settings.svg)](https://badge.fury.io/js/mozithermodb-settings)
[![npm downloads](https://img.shields.io/npm/dm/mozithermodb-settings?color=brightgreen)](https://www.npmjs.com/package/mozithermodb-settings)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Shared TypeScript schemas, types, and utility functions for thermodynamic components and mixture identifiers in the Mozi ecosystem.

## Features

- Zod schemas for temperature, pressure, volume, and custom properties
- Zod schemas and inferred types for thermodynamic components
- Consistent component identifier helpers
- Deterministic binary and multi-component mixture ID creation
- Component state setters with in-place mutation parity for interop scenarios
- ESM, CJS, browser, and `.d.ts` outputs

## Installation

```bash
npm install mozithermodb-settings
```

## Quick Start

```ts
import {
  ComponentSchema,
  TemperatureSchema,
  create_component_id,
  create_mixture_id,
  set_component_state,
} from "mozithermodb-settings";

const water = ComponentSchema.parse({
  name: " Water ",
  formula: " H2O ",
  state: "l",
});

const temperature = TemperatureSchema.parse({
  value: 298.15,
  unit: "K",
  source: "lab", // passthrough extra property
});

const identity = create_component_id(water);
// { name_state: "Water-l", formula_state: "H2O-l", name_formula: "Water-H2O" }

const mixture = create_mixture_id(
  [
    water,
    { name: "Ethanol", formula: "C2H5OH", state: "l" },
    { name: "Methanol", formula: "CH3OH", state: "l" },
  ],
  "Name",
);
// "Ethanol|Methanol|Water"

set_component_state(water, "g"); // mutates same object reference
```

## API

### Condition Schemas

- `TemperatureSchema`
- `PressureSchema`
- `VolumeSchema`
- `CustomPropSchema`

All condition schemas are `z.looseObject(...)`, so unknown keys are preserved.

### Component Schemas and Types

- `ComponentStateSchema`: `"g" | "l" | "s" | "aq"`
- `ComponentKeySchema`:
  - `"Name-State"`
  - `"Formula-State"`
  - `"Name-Formula"`
  - `"Name"`
  - `"Formula"`
  - `"Name-Formula-State"`
  - `"Formula-Name-State"`
- `MixtureKeySchema`: same as `ComponentKeySchema`
- `BinaryMixtureKeySchema`: `"Name" | "Formula"`
- `ComponentSchema`:
  - `name: string`
  - `formula: string`
  - `state: ComponentState`
  - `mole_fraction: number` (default: `1`)
- `ComponentIdentitySchema`:
  - `name_state: string`
  - `formula_state: string`
  - `name_formula: string`

Inferred TypeScript exports:

- `Temperature`, `Pressure`, `Volume`, `CustomProp`
- `ComponentState`, `ComponentKey`, `MixtureKey`, `BinaryMixtureKey`
- `Component`, `ComponentInput`, `ComponentIdentity`

### Utility Functions

- `create_component_id(component, separator_symbol?)`
  - Returns `{ name_state, formula_state, name_formula }`
  - Trims fields and normalizes `state` to lowercase in state-based identifiers

- `set_component_id(component, component_key, separator_symbol?, case_value?)`
  - Returns a string identifier for a selected key format
  - `case_value` is `"lower" | "upper" | null`

- `create_binary_mixture_id(component_1, component_2, mixture_key?, delimiter?)`
  - Supports `mixture_key`: `"Name"` or `"Formula"`
  - Sorts component IDs before joining, so ordering is deterministic

- `create_mixture_id(components, mixture_key?, delimiter?, case_value?)`
  - Supports all `MixtureKeySchema` key styles
  - Sorts component IDs before joining
  - Throws if `components` is empty

- `set_component_state(component, state)`
  - Validates and mutates the original input object reference

- `set_components_state(components, state)`
  - Applies `set_component_state` to each item

### Errors

The package exports `ERRORS` from `src/core/errors.ts` for consistent error messages around:

- invalid component key
- invalid case value
- invalid mixture key
- empty component list
- delimiter type mismatch

## Deterministic ID Behavior

Mixture ID helpers always sort generated component identifiers before joining with a delimiter:

- Binary: `[id1, id2].sort().join(delimiter)`
- Multi-component: `ids.sort().join(delimiter)`

This guarantees stable IDs independent of input order.

## Build and Test

```bash
npm run build
npm run typecheck
npm run lint
npm test
```

Package outputs:

- `dist/index.mjs` (ESM)
- `dist/index.cjs` (CommonJS)
- `dist/index.browser.mjs` (browser ESM)
- `dist/index.d.ts` (types)

## Example Script

See `examples/exp-1.ts` for a complete end-to-end usage sample covering:

- schema parsing
- component defaults
- component and mixture IDs
- state updates

## License

Apache-2.0
