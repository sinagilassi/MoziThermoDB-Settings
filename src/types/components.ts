import { z } from "zod";

export const ComponentStateSchema = z.enum(["g", "l", "s", "aq"]);

export const ComponentKeySchema = z.enum([
  "Name-State",
  "Formula-State",
  "Name-Formula",
  "Name",
  "Formula",
  "Name-Formula-State",
  "Formula-Name-State",
]);

export const MixtureKeySchema = ComponentKeySchema;
export const BinaryMixtureKeySchema = z.enum(["Name", "Formula"]);

export const ComponentSchema = z
  .object({
    name: z.string(),
    formula: z.string(),
    state: ComponentStateSchema,
    mole_fraction: z.number().default(1),
  })
  .passthrough();

export const ComponentIdentitySchema = z.object({
  name_state: z.string(),
  formula_state: z.string(),
  name_formula: z.string(),
});

export type ComponentState = z.infer<typeof ComponentStateSchema>;
export type ComponentKey = z.infer<typeof ComponentKeySchema>;
export type MixtureKey = z.infer<typeof MixtureKeySchema>;
export type BinaryMixtureKey = z.infer<typeof BinaryMixtureKeySchema>;
export type Component = z.infer<typeof ComponentSchema>;
export type ComponentInput = z.input<typeof ComponentSchema>;
export type ComponentIdentity = z.infer<typeof ComponentIdentitySchema>;
