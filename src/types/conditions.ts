import { z } from "zod";

// SECTION: Schemas
export const TemperatureSchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
});

export const PressureSchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
});

export const VolumeSchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
});

export const CustomPropSchema = z.looseObject({
  value: z.union([z.number(), z.int()]),
  unit: z.string(),
});

// SECTION: Types
export type Temperature = z.infer<typeof TemperatureSchema>;
export type Pressure = z.infer<typeof PressureSchema>;
export type Volume = z.infer<typeof VolumeSchema>;
export type CustomProp = z.infer<typeof CustomPropSchema>;
