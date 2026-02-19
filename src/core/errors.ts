export const ERRORS = {
  invalid_component_key: (component_key: string): string =>
    `Invalid component_key '${component_key}'. Must be one of the supported keys.`,
  invalid_case: (value: string): string =>
    `Invalid case '${value}'. Must be 'lower', 'upper', or null.`,
  invalid_mixture_key: (mixture_key: string): string =>
    `component_key must be one of the following: Name, Formula, Name-State, Formula-State, Name-Formula, Name-Formula-State, Formula-Name-State`,
  empty_components: "components list cannot be empty",
  delimiter_type: "delimiter must be a string",
} as const;
