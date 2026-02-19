import { z } from "zod";
import { ERRORS } from "@/core/errors";
import {
  BinaryMixtureKeySchema,
  ComponentIdentitySchema,
  ComponentKeySchema,
  ComponentSchema,
  ComponentStateSchema,
  MixtureKeySchema,
  type BinaryMixtureKey,
  type Component,
  type ComponentIdentity,
  type ComponentInput,
  type ComponentKey,
  type MixtureKey,
} from "../types/components";

export type CaseTransform = "lower" | "upper" | null;

const CaseTransformSchema = z.union([
  z.literal("lower"),
  z.literal("upper"),
  z.null(),
]);


/**
 * Creates a component identity object with multiple identifier formats.
 * Combines component name, formula, and state in different arrangements.
 * @param component - The component to create an identity for
 * @param separator_symbol - The separator to use between components (default: "-")
 * @returns ComponentIdentity object with name_state, formula_state, and name_formula identifiers
 */
export function create_component_id(
  component: ComponentInput,
  separator_symbol = "-",
): ComponentIdentity {
  const parsed_component = ComponentSchema.parse(component);
  const separator = separator_symbol.trim();

  const component_name = parsed_component.name.trim();
  const component_formula = parsed_component.formula.trim();
  const component_state = parsed_component.state.trim().toLowerCase();

  return ComponentIdentitySchema.parse({
    name_state: `${component_name}${separator}${component_state}`,
    formula_state: `${component_formula}${separator}${component_state}`,
    name_formula: `${component_name}${separator}${component_formula}`,
  });
}

/**
 * Generates a component identifier string based on the specified key and formatting options.
 * Supports multiple identifier formats and case transformations.
 * @param component - The component to generate an identifier for
 * @param component_key - The key format to use (e.g., "Name-State", "Formula-State", "Name", "Formula")
 * @param separator_symbol - The separator to use between components (default: "-")
 * @param case_value - Case transformation to apply: 'lower', 'upper', or null for no change (default: null)
 * @returns A formatted component identifier string
 * @throws Error if component_key is invalid or case_value is invalid
 */
export function set_component_id(
  component: ComponentInput,
  component_key: ComponentKey,
  separator_symbol = "-",
  case_value: CaseTransform = null,
): string {
  const parsed_component = ComponentSchema.parse(component);

  const key = ComponentKeySchema.safeParse(component_key);
  if (!key.success) {
    throw new Error(ERRORS.invalid_component_key(String(component_key)));
  }

  const parsed_case = CaseTransformSchema.safeParse(case_value);
  if (!parsed_case.success) {
    throw new Error(ERRORS.invalid_case(String(case_value)));
  }

  const separator = separator_symbol.trim();
  const component_idx = create_component_id(parsed_component, separator);

  let component_id: string;
  switch (key.data) {
    case "Name-State":
      component_id = component_idx.name_state.trim();
      break;
    case "Formula-State":
      component_id = component_idx.formula_state.trim();
      break;
    case "Name-Formula":
      component_id = component_idx.name_formula.trim();
      break;
    case "Name":
      component_id = parsed_component.name.trim();
      break;
    case "Formula":
      component_id = parsed_component.formula.trim();
      break;
    case "Name-Formula-State":
      component_id = `${parsed_component.name.trim()}${separator}${parsed_component.formula.trim()}${separator}${parsed_component.state.trim().toLowerCase()}`;
      break;
    case "Formula-Name-State":
      component_id = `${parsed_component.formula.trim()}${separator}${parsed_component.name.trim()}${separator}${parsed_component.state.trim().toLowerCase()}`;
      break;
    default:
      throw new Error(ERRORS.invalid_component_key(String(component_key)));
  }

  if (parsed_case.data === "lower") {
    return component_id.toLowerCase();
  }
  if (parsed_case.data === "upper") {
    return component_id.toUpperCase();
  }
  return component_id;
}

/**
 * Creates a mixture identifier for two components.
 * Components are sorted alphabetically before joining with the delimiter.
 * @param component_1 - The first component in the mixture
 * @param component_2 - The second component in the mixture
 * @param mixture_key - The key to use for identification: "Name" or "Formula" (default: "Name")
 * @param delimiter - The delimiter to use between components (default: "|")
 * @returns A sorted, delimited mixture identifier string
 * @throws TypeError if delimiter is not a string
 * @throws Error if mixture_key is invalid
 */
export function create_binary_mixture_id(
  component_1: ComponentInput,
  component_2: ComponentInput,
  mixture_key: BinaryMixtureKey = "Name",
  delimiter = "|",
): string {
  const comp1 = ComponentSchema.parse(component_1);
  const comp2 = ComponentSchema.parse(component_2);

  if (typeof delimiter !== "string") {
    throw new TypeError(ERRORS.delimiter_type);
  }
  const parsed_delimiter = delimiter.trim();

  const key = BinaryMixtureKeySchema.safeParse(mixture_key);
  if (!key.success) {
    throw new Error("component_key must be either 'Name' or 'Formula'");
  }

  const comp1_id = key.data === "Name" ? comp1.name.trim() : comp1.formula.trim();
  const comp2_id = key.data === "Name" ? comp2.name.trim() : comp2.formula.trim();

  return [comp1_id, comp2_id].sort().join(parsed_delimiter).trim();
}

/**
 * Creates a mixture identifier for multiple components.
 * Combines component identifiers based on the specified key, sorts them, and joins with delimiter.
 * @param components - Array of components in the mixture
 * @param mixture_key - The key format to use (e.g., "Name", "Formula", "Name-State", "Formula-State")
 * @param delimiter - The delimiter to use between components (default: "|")
 * @param case_value - Case transformation to apply: 'lower', 'upper', or null for no change (default: null)
 * @returns A sorted, delimited mixture identifier string
 * @throws Error if components array is empty or mixture_key is invalid
 * @throws TypeError if delimiter is not a string
 */
export function create_mixture_id(
  components: ComponentInput[],
  mixture_key: MixtureKey = "Name",
  delimiter = "|",
  case_value: CaseTransform = null,
): string {
  const parsed_components = z.array(ComponentSchema).parse(components);
  if (parsed_components.length === 0) {
    throw new Error(ERRORS.empty_components);
  }

  if (typeof delimiter !== "string") {
    throw new TypeError(ERRORS.delimiter_type);
  }
  const parsed_delimiter = delimiter.trim();

  const key = MixtureKeySchema.safeParse(mixture_key);
  if (!key.success) {
    throw new Error(ERRORS.invalid_mixture_key(String(mixture_key)));
  }

  const parsed_case = CaseTransformSchema.safeParse(case_value);
  if (!parsed_case.success) {
    throw new Error(ERRORS.invalid_case(String(case_value)));
  }

  const component_ids = parsed_components.map((comp) => {
    switch (key.data) {
      case "Name":
        return comp.name.trim();
      case "Formula":
        return comp.formula.trim();
      case "Name-State":
        return `${comp.name.trim()}-${comp.state.trim()}`;
      case "Formula-State":
        return `${comp.formula.trim()}-${comp.state.trim()}`;
      case "Name-Formula":
        return `${comp.name.trim()}-${comp.formula.trim()}`;
      case "Name-Formula-State":
        return `${comp.name.trim()}-${comp.formula.trim()}-${comp.state.trim()}`;
      case "Formula-Name-State":
        return `${comp.formula.trim()}-${comp.name.trim()}-${comp.state.trim()}`;
      default:
        throw new Error(ERRORS.invalid_mixture_key(String(mixture_key)));
    }
  });

  let mixture_id = component_ids.sort().join(parsed_delimiter).trim();

  if (parsed_case.data === "lower") {
    mixture_id = mixture_id.toLowerCase();
  } else if (parsed_case.data === "upper") {
    mixture_id = mixture_id.toUpperCase();
  }

  return mixture_id;
}

/**
 * Updates the state of a component while preserving all other properties.
 * Mutates the original object reference to maintain Python parity.
 * @param component - The component to update
 * @param state - The new state to set (must be one of: 'g', 'l', 's', 'aq')
 * @returns The modified component with updated state
 * @throws Error if state is invalid
 */
export function set_component_state(
  component: ComponentInput,
  state: z.infer<typeof ComponentStateSchema>,
): Component {
  const parsed_component = ComponentSchema.parse(component);
  ComponentStateSchema.parse(state);

  // Preserve Python parity by mutating the same object reference.
  return Object.assign(component, parsed_component, { state }) as Component;
}

/**
 * Updates the state of multiple components while preserving all other properties.
 * Applies the same state to all components in the array.
 * @param components - Array of components to update
 * @param state - The new state to set (must be one of: 'g', 'l', 's', 'aq')
 * @returns Array of modified components with updated state
 * @throws Error if state is invalid
 */
export function set_components_state(
  components: ComponentInput[],
  state: z.infer<typeof ComponentStateSchema>,
): Component[] {
  ComponentStateSchema.parse(state);
  return components.map((component) => set_component_state(component, state));
}
