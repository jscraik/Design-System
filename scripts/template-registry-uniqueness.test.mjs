#!/usr/bin/env node

/**
 * Property-Based Tests for Template Registry Uniqueness
 *
 * Tests Property 3: Unique IDs + Routes
 * Validates: Requirement 2.3
 */

import fc from "fast-check";

const hasUniqueIdsAndRoutes = (templates) => {
  const ids = new Set();
  const routes = new Set();

  for (const template of templates) {
    if (ids.has(template.id)) return false;
    if (routes.has(template.route)) return false;
    ids.add(template.id);
    routes.add(template.route);
  }

  return true;
};

const idArb = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value));

const routeArb = fc
  .string({ minLength: 2, maxLength: 60 })
  .filter((value) => /^\/[a-z0-9/-]+$/.test(value));

const buildTemplates = (ids, routes) =>
  ids.map((id, index) => ({
    id,
    route: routes[index],
  }));

describe("Template Registry Uniqueness Property", () => {
  test("Property 3: Unique IDs + Routes", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .integer({ min: 0, max: 25 })
          .chain((size) =>
            fc
              .tuple(
                fc.uniqueArray(idArb, { minLength: size, maxLength: size }),
                fc.uniqueArray(routeArb, { minLength: size, maxLength: size }),
              )
              .map(([ids, routes]) => buildTemplates(ids, routes)),
          ),
        async (templates) => {
          expect(hasUniqueIdsAndRoutes(templates)).toBe(true);
          return true;
        },
      ),
      {
        numRuns: 25,
        timeout: 5000,
      },
    );
  });

  test("detects duplicate ids or routes", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 20 }).chain((size) =>
          fc
            .tuple(
              fc.uniqueArray(idArb, { minLength: size, maxLength: size }),
              fc.uniqueArray(routeArb, { minLength: size, maxLength: size }),
              fc.boolean(),
            )
            .map(([ids, routes, duplicateId]) => {
              const templates = buildTemplates(ids, routes);
              if (templates.length < 2) {
                return templates;
              }

              if (duplicateId) {
                templates[1] = { ...templates[1], id: templates[0].id };
              } else {
                templates[1] = { ...templates[1], route: templates[0].route };
              }

              return templates;
            }),
        ),
        async (templates) => {
          expect(hasUniqueIdsAndRoutes(templates)).toBe(false);
          return true;
        },
      ),
      {
        numRuns: 25,
        timeout: 5000,
      },
    );
  });
});
