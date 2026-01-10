#!/usr/bin/env node

/**
 * Property-Based Tests for Template Registry Schema Validation
 *
 * Tests Property 1: Metadata Completeness
 * Validates: Requirements 1.1, 1.5, 2.3
 */

import Ajv from "ajv";
import fc from "fast-check";
import { readFileSync } from "fs";
import { join } from "path";

// Load the schema
const schemaPath = join(process.cwd(), "scripts/schema/template-registry.schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

// Create AJV validator
const ajv = new Ajv({ strict: true, allErrors: true });
const validate = ajv.compile(schema);

const kebabChar = fc.constantFrom(
    ..."abcdefghijklmnopqrstuvwxyz0123456789".split("")
);

const kebabToken = (maxLength) =>
    fc
        .array(
            fc.stringOf(kebabChar, { minLength: 1, maxLength: 8 }),
            { minLength: 1, maxLength: 4 }
        )
        .map((parts) => parts.join("-"))
        .filter((value) => value.length <= maxLength);

const routeToken = kebabToken(12);

/**
 * Property 1: Metadata Completeness
 * For any template in the registry, the template SHALL have complete, schema-valid metadata.
 */
describe("Template Registry Schema Validation Property", () => {
    test("Property 1: Metadata Completeness", () => {
        fc.assert(
            fc.property(
                // Generate valid template registry data
                fc.record({
                    templates: fc.array(
                        fc.record({
                            id: kebabToken(50),
                            title: fc.string({ minLength: 1, maxLength: 100 }),
                            description: fc.string({ minLength: 1, maxLength: 500 }),
                            category: fc.constantFrom(
                                "educational",
                                "components",
                                "design-system",
                                "templates",
                                "layouts",
                                "settings",
                                "modals",
                                "panels"
                            ),
                            tags: fc.array(routeToken, { minLength: 0, maxLength: 10 })
                                .map(tags => [...new Set(tags)]), // Ensure uniqueness
                            status: fc.constantFrom("alpha", "beta", "stable"),
                            route: fc.array(routeToken, { minLength: 1, maxLength: 4 })
                                .map((parts) => `/${parts.join("/")}`),
                            entry: fc.stringMatching(/^[A-Z][a-zA-Z0-9]*$/),
                            sourcePath: fc.array(routeToken, { minLength: 1, maxLength: 4 })
                                .map((parts) => `src/templates/${parts.join("/")}.tsx`)
                        }),
                        { minLength: 0, maxLength: 20 }
                    )
                }),
                (registryData) => {
                    // Validate against schema
                    const isValid = validate(registryData);

                    if (!isValid) {
                        console.error("Schema validation failed:", validate.errors);
                        return false;
                    }

                    // Additional completeness checks
                    for (const template of registryData.templates) {
                        // Check that all required fields are present and non-empty
                        expect(template.id).toBeTruthy();
                        expect(template.title).toBeTruthy();
                        expect(template.description).toBeTruthy();
                        expect(template.category).toBeTruthy();
                        expect(Array.isArray(template.tags)).toBe(true);
                        expect(template.status).toBeTruthy();
                        expect(template.route).toBeTruthy();
                        expect(template.entry).toBeTruthy();
                        expect(template.sourcePath).toBeTruthy();

                        // Check kebab-case format for id
                        expect(template.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);

                        // Check PascalCase format for entry
                        expect(template.entry).toMatch(/^[A-Z][a-zA-Z0-9]*$/);

                        // Check route format
                        expect(template.route).toMatch(/^\/[a-z0-9/-]+$/);

                        // Check source path format
                        expect(template.sourcePath).toMatch(/^src\/templates\/.+\.tsx$/);

                        // Check tags are kebab-case and unique
                        const tagSet = new Set(template.tags);
                        expect(tagSet.size).toBe(template.tags.length);
                        for (const tag of template.tags) {
                            expect(tag).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
                        }

                        // Check valid category
                        const validCategories = [
                            "educational", "components", "design-system", "templates",
                            "layouts", "settings", "modals", "panels"
                        ];
                        expect(validCategories).toContain(template.category);

                        // Check valid status
                        const validStatuses = ["alpha", "beta", "stable"];
                        expect(validStatuses).toContain(template.status);
                    }

                }
            ),
            {
                numRuns: 20,
                timeout: 5000,
                verbose: true,
            }
        );
    });

    test("Schema rejects invalid template data", () => {
        fc.assert(
            fc.property(
                // Generate invalid template data
                fc.oneof(
                    // Invalid id (not kebab-case)
                    fc.record({
                        templates: fc.array(fc.record({
                            id: fc.constantFrom("InvalidID", "invalid_id", "invalid.id", ""),
                            title: fc.string({ minLength: 1, maxLength: 100 }),
                            description: fc.string({ minLength: 1, maxLength: 500 }),
                            category: fc.constantFrom("educational", "components"),
                            tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 5 }),
                            status: fc.constantFrom("alpha", "beta", "stable"),
                            route: fc.string().map(s => `/${s}`),
                            entry: fc.string({ minLength: 1, maxLength: 50 }),
                            sourcePath: fc.string().map(s => `src/templates/${s}.tsx`)
                        }), { minLength: 1, maxLength: 1 })
                    }),
                    // Invalid category
                    fc.record({
                        templates: fc.array(fc.record({
                            id: fc.constantFrom("valid-id"),
                            title: fc.string({ minLength: 1, maxLength: 100 }),
                            description: fc.string({ minLength: 1, maxLength: 500 }),
                            category: fc.constantFrom("invalid-category", "unknown"),
                            tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 5 }),
                            status: fc.constantFrom("alpha", "beta", "stable"),
                            route: fc.constantFrom("/valid-route"),
                            entry: fc.constantFrom("ValidEntry"),
                            sourcePath: fc.constantFrom("src/templates/valid.tsx")
                        }), { minLength: 1, maxLength: 1 })
                    }),
                    // Missing required fields
                    fc.record({
                        templates: fc.array(fc.record({
                            id: fc.constantFrom("valid-id"),
                            title: fc.string({ minLength: 1, maxLength: 100 }),
                            // Missing description, category, etc.
                        }), { minLength: 1, maxLength: 1 })
                    })
                ),
                (invalidData) => {
                    const isValid = validate(invalidData);

                    // Invalid data should fail validation
                    expect(isValid).toBe(false);
                    expect(validate.errors).toBeTruthy();
                    expect(validate.errors.length).toBeGreaterThan(0);

                }
            ),
            {
                numRuns: 10,
                timeout: 3000,
            }
        );
    });

    test("Schema validates empty template array", () => {
        const emptyRegistry = { templates: [] };
        const isValid = validate(emptyRegistry);

        expect(isValid).toBe(true);
        expect(validate.errors).toBeFalsy();
    });

    test("Schema validates single valid template", () => {
        const singleTemplateRegistry = {
            templates: [{
                id: "example-template",
                title: "Example Template",
                description: "A sample template for testing",
                category: "educational",
                tags: ["example", "test"],
                status: "stable",
                route: "/templates/example",
                entry: "ExampleTemplate",
                sourcePath: "src/templates/educational/example.tsx"
            }]
        };

        const isValid = validate(singleTemplateRegistry);

        expect(isValid).toBe(true);
        expect(validate.errors).toBeFalsy();
    });
});
