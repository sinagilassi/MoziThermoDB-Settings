import { symbol, z } from "zod";

// SECTION: Schemas
// NOTE: Temperature
export const TemperatureSchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
});

// NOTE: Pressure
export const PressureSchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
});

// NOTE: Volume
export const VolumeSchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
});

// NOTE: Custom Property
export const CustomPropSchema = z.looseObject({
  value: z.union([z.number(), z.int()]),
  unit: z.string(),
});

// NOTE: Custom Property
export const CustomPropertySchema = z.looseObject({
  value: z.number(),
  unit: z.string(),
  symbol: z.string(),
})

// SECTION: Types
export type Temperature = z.infer<typeof TemperatureSchema>;
export type Pressure = z.infer<typeof PressureSchema>;
export type Volume = z.infer<typeof VolumeSchema>;
export type CustomProp = z.infer<typeof CustomPropSchema>;
export type CustomProperty = z.infer<typeof CustomPropertySchema>;
