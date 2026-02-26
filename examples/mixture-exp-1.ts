import {
    create_binary_mixture_id,
    infer_binary_mixture_key,
    type BinaryMixtureKey,
    type Component,
} from "../src";

function printSection(title: string): void {
    console.log(`\n=== ${title} ===`);
}

function runBinaryRoundTripExample(
    label: string,
    components: Component[],
    mixtureKey: BinaryMixtureKey,
    delimiter = "|",
): void {
    const mixtureId = create_binary_mixture_id(
        components[0],
        components[1],
        mixtureKey,
        delimiter,
    );

    const inferredKey = infer_binary_mixture_key(mixtureId, components, delimiter);

    console.log(`${label} mixtureKey:`, mixtureKey);
    console.log(`${label} mixtureId:`, mixtureId);
    console.log(`${label} inferredKey:`, inferredKey);
    console.log(`${label} round-trip ok:`, inferredKey === mixtureKey);
}

function main(): void {
    const water: Component = {
        name: "Water",
        formula: "H2O",
        state: "l",
        mole_fraction: 1
    };

    const ethanol: Component = {
        name: "Ethanol",
        formula: "C2H6O",
        state: "l",
        mole_fraction: 1
    };

    const components: Component[] = [water, ethanol];

    printSection("Binary Mixture Create -> Reverse");
    runBinaryRoundTripExample("Name-Formula", components, "Name-Formula");
    runBinaryRoundTripExample("Formula", components, "Formula", " | ");
}

main();
