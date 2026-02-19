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
    type ComponentInput,
} from "../src";

function printSection(title: string): void {
    console.log(`\n=== ${title} ===`);
}

function main(): void {
    printSection("Condition Schemas");

    const temperature = TemperatureSchema.parse({ value: 298.15, unit: "K", source: "lab" });
    const pressure = PressureSchema.parse({ value: 1.01325, unit: "bar", source: "lab" });
    const volume = VolumeSchema.parse({ value: 1.5, unit: "L", vessel: "R-101" });
    const custom_prop = CustomPropSchema.parse({ value: 42, unit: "kJ/mol", note: "demo" });

    console.log("Temperature:", temperature);
    console.log("Pressure:", pressure);
    console.log("Volume:", volume);
    console.log("CustomProp:", custom_prop);

    printSection("Component Validation + Defaults");

    const water = ComponentSchema.parse({ name: " Water ", formula: " H2O ", state: "l" });
    const ethanol = ComponentSchema.parse({ name: "Ethanol", formula: "C2H5OH", state: "l", mole_fraction: 0.4 });
    const methanol = ComponentSchema.parse({ name: "Methanol", formula: "CH3OH", state: "l" });

    console.log("Water (default mole_fraction):", water);
    console.log("Ethanol:", ethanol);
    console.log("Methanol:", methanol);

    printSection("Component Identity and IDs");

    const water_identity = create_component_id(water);
    console.log("create_component_id(water):", water_identity);

    console.log("set_component_id Name-State:", set_component_id(water, "Name-State"));
    console.log("set_component_id Formula-State:", set_component_id(water, "Formula-State"));
    console.log("set_component_id Name-Formula:", set_component_id(water, "Name-Formula"));
    console.log("set_component_id Name-Formula-State:", set_component_id(water, "Name-Formula-State"));
    console.log(
        "set_component_id Name-State (upper):",
        set_component_id(water, "Name-State", "-", "upper"),
    );

    printSection("Mixture IDs");

    const binary_name_id = create_binary_mixture_id(water, ethanol, "Name");
    const binary_formula_id = create_binary_mixture_id(water, ethanol, "Formula", " | ");
    const ternary_id = create_mixture_id([water, ethanol, methanol], "Name", "|", "lower");

    console.log("Binary (Name):", binary_name_id);
    console.log("Binary (Formula):", binary_formula_id);
    console.log("Ternary (Name, lower):", ternary_id);

    printSection("State Setters (Mutation Parity)");

    const ammonia: ComponentInput = { name: "Ammonia", formula: "NH3", state: "g" };
    const same_ref = set_component_state(ammonia, ComponentStateSchema.parse("aq"));

    console.log("same reference:", same_ref === ammonia);
    console.log("updated ammonia:", ammonia);

    const components: ComponentInput[] = [
        { name: "Water", formula: "H2O", state: "l" },
        { name: "Methanol", formula: "CH3OH", state: "l" },
    ];
    const updated_components = set_components_state(components, "s");

    console.log("updated components:", updated_components);
}

main();
