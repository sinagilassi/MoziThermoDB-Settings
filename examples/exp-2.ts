// import libs
import { CustomPropertySchema } from "../src";
import type { CustomProperty } from "../src";

// NOTE: Custom Property Example
const myProperty: CustomProperty = {
    value: 100,
    unit: "kJ/mol",
    symbol: "ΔH",
};
// log
console.log("Custom Property:", myProperty);

// NOTE: Parsing Custom Property with Zod
const parsedProperty = CustomPropertySchema.parse({
    value: 100,
    unit: "kJ/mol",
    symbol: "ΔH",
});
console.log("Parsed Custom Property:", parsedProperty);