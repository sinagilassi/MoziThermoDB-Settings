import { z } from "zod";
import { ERRORS } from "../core/errors";
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

export function set_component_state(
  component: ComponentInput,
  state: z.infer<typeof ComponentStateSchema>,
): Component {
  const parsed_component = ComponentSchema.parse(component);
  ComponentStateSchema.parse(state);

  // Preserve Python parity by mutating the same object reference.
  return Object.assign(component, parsed_component, { state }) as Component;
}

export function set_components_state(
  components: ComponentInput[],
  state: z.infer<typeof ComponentStateSchema>,
): Component[] {
  ComponentStateSchema.parse(state);
  return components.map((component) => set_component_state(component, state));
}
