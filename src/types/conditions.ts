import { z } from "zod";

export const TemperatureSchema = z
  .object({
    value: z.number(),
    unit: z.string(),
  })
  .passthrough();

export const PressureSchema = z
  .object({
    value: z.number(),
    unit: z.string(),
  })
  .passthrough();

export const VolumeSchema = z
  .object({
    value: z.number(),
    unit: z.string(),
  })
  .passthrough();

export const CustomPropSchema = z
  .object({
    value: z.union([z.number(), z.int()]),
    unit: z.string(),
  })
  .passthrough();

export type Temperature = z.infer<typeof TemperatureSchema>;
export type Pressure = z.infer<typeof PressureSchema>;
export type Volume = z.infer<typeof VolumeSchema>;
export type CustomProp = z.infer<typeof CustomPropSchema>;
