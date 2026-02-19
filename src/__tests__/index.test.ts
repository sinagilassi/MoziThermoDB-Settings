import { describe, expect, it } from "vitest";
import {
  ComponentSchema,
  ComponentStateSchema,
  create_binary_mixture_id,
  create_component_id,
  create_mixture_id,
  CustomPropSchema,
  PressureSchema,
  set_component_id,
  set_component_state,
  set_components_state,
  TemperatureSchema,
  VolumeSchema,
} from "../index";

describe("schemas", () => {
  it("accepts valid condition schemas", () => {
    expect(TemperatureSchema.parse({ value: 300, unit: "K", extra: true }).extra).toBe(true);
    expect(PressureSchema.parse({ value: 1, unit: "bar", tag: "x" }).tag).toBe("x");
    expect(VolumeSchema.parse({ value: 2, unit: "L", note: "ok" }).note).toBe("ok");
    expect(CustomPropSchema.parse({ value: 10, unit: "kJ/mol", foo: "bar" }).foo).toBe("bar");
  });

  it("applies component default and passthrough", () => {
    const parsed = ComponentSchema.parse({ name: "Water", formula: "H2O", state: "l", extra: 1 });
    expect(parsed.mole_fraction).toBe(1);
    expect(parsed.extra).toBe(1);
  });
});

describe("component id utils", () => {
  const component = { name: " Water ", formula: " H2O ", state: "l" as const };

  it("creates component identity", () => {
    expect(create_component_id(component)).toEqual({
      name_state: "Water-l",
      formula_state: "H2O-l",
      name_formula: "Water-H2O",
    });
  });

  it("handles all component key variants", () => {
    expect(set_component_id(component, "Name-State")).toBe("Water-l");
    expect(set_component_id(component, "Formula-State")).toBe("H2O-l");
    expect(set_component_id(component, "Name-Formula")).toBe("Water-H2O");
    expect(set_component_id(component, "Name")).toBe("Water");
    expect(set_component_id(component, "Formula")).toBe("H2O");
    expect(set_component_id(component, "Name-Formula-State")).toBe("Water-H2O-l");
    expect(set_component_id(component, "Formula-Name-State")).toBe("H2O-Water-l");
  });

  it("applies case conversion", () => {
    expect(set_component_id(component, "Name-State", "-", "lower")).toBe("water-l");
    expect(set_component_id(component, "Name-State", "-", "upper")).toBe("WATER-L");
  });

  it("throws on invalid case", () => {
    expect(() =>
      set_component_id(component, "Name-State", "-", "bad" as unknown as "lower"),
    ).toThrow("Invalid case");
  });
});

describe("mixture utils", () => {
  const water = { name: "Water", formula: "H2O", state: "l" as const };
  const ethanol = { name: "Ethanol", formula: "C2H5OH", state: "l" as const };
  const methanol = { name: "Methanol", formula: "CH3OH", state: "l" as const };

  it("creates sorted binary mixture ids", () => {
    expect(create_binary_mixture_id(water, ethanol, "Name")).toBe("Ethanol|Water");
    expect(create_binary_mixture_id(water, ethanol, "Formula", " | ")).toBe("C2H5OH|H2O");
  });

  it("creates sorted multi-component mixture ids", () => {
    expect(create_mixture_id([water, ethanol, methanol], "Name")).toBe("Ethanol|Methanol|Water");
    expect(create_mixture_id([water, ethanol, methanol], "Formula", "|", "upper")).toBe("C2H5OH|CH3OH|H2O");
  });

  it("throws on empty mixture", () => {
    expect(() => create_mixture_id([], "Name")).toThrow("components list cannot be empty");
  });
});

describe("state setters", () => {
  it("sets component state in place", () => {
    const c = { name: "Water", formula: "H2O", state: "l" as const };
    const updated = set_component_state(c, ComponentStateSchema.parse("g"));
    expect(updated).toBe(c);
    expect(updated.state).toBe("g");
  });

  it("sets states for list", () => {
    const arr = [
      { name: "Water", formula: "H2O", state: "l" as const },
      { name: "Methanol", formula: "CH3OH", state: "l" as const },
    ];
    const updated = set_components_state(arr, "s");
    expect(updated.every((c) => c.state === "s")).toBe(true);
  });
});
