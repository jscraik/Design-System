/**
 * Usage Examples for Hybrid Pattern Validation
 *
 * This file demonstrates real-world usage of each pattern
 */

import { SimpleComponent } from "./SimpleComponent";
import { HybridComponent } from "./HybridComponent";
import { ComplexComponent } from "./ComplexComponent";

// ============================================================================
// SIMPLE COMPONENT EXAMPLES
// ============================================================================

/**
 * Example 1: Basic usage
 * Most common case - simple configuration
 */
export const SimpleExample1 = () => {
  return <SimpleComponent>Click me</SimpleComponent>;
};

/**
 * Example 2: With props
 */
export const SimpleExample2 = () => {
  return (
    <SimpleComponent variant="danger" size="lg" onClick={() => alert("Clicked!")}>
      Delete Item
    </SimpleComponent>
  );
};

/**
 * Example 3: Loading state
 */
export const SimpleExample3 = () => {
  return <SimpleComponent loading>Saving...</SimpleComponent>;
};

// ============================================================================
// HYBRID COMPONENT EXAMPLES
// ============================================================================

/**
 * Example 1: Props mode (default)
 * 80% of use cases - simple and quick
 */
export const HybridExample1 = () => {
  return (
    <HybridComponent
      title="Welcome to DesignStudio"
      description="A pragmatic approach to design systems"
      actionLabel="Get Started"
      onAction={() => console.log("Started!")}
      showIcon
    />
  );
};

/**
 * Example 2: Compound mode
 * 20% of use cases - custom layout needed
 */
export const HybridExample2 = () => {
  return (
    <HybridComponent variant="compound">
      <HybridComponent.Title>Welcome to DesignStudio</HybridComponent.Title>
      <HybridComponent.Description>
        A pragmatic approach to design systems with maximum flexibility
      </HybridComponent.Description>
      <HybridComponent.Action>Get Started</HybridComponent.Action>
    </HybridComponent>
  );
};

/**
 * Example 3: Compound mode with custom content
 */
export const HybridExample3 = () => {
  return (
    <HybridComponent variant="compound">
      <HybridComponent.Title>
        <span style={{ color: "blue" }}>Custom Title</span>
      </HybridComponent.Title>
      <HybridComponent.Description>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      </HybridComponent.Description>
      <HybridComponent.Action>Learn More</HybridComponent.Action>
    </HybridComponent>
  );
};

// ============================================================================
// COMPLEX COMPONENT EXAMPLES
// ============================================================================

/**
 * Example 1: Basic layout
 */
export const ComplexExample1 = () => {
  return (
    <ComplexComponent layout="vertical" spacing="md">
      <ComplexComponent.Header>
        <ComplexComponent.Title>Settings</ComplexComponent.Title>
        <ComplexComponent.Subtitle>Manage your preferences</ComplexComponent.Subtitle>
      </ComplexComponent.Header>
      <ComplexComponent.Body>
        <p>Settings content goes here...</p>
      </ComplexComponent.Body>
      <ComplexComponent.Footer>
        <ComplexComponent.Action>Cancel</ComplexComponent.Action>
        <ComplexComponent.Action primary onClick={() => console.log("Saved!")}>
          Save Changes
        </ComplexComponent.Action>
      </ComplexComponent.Footer>
    </ComplexComponent>
  );
};

/**
 * Example 2: Custom layout with multiple actions
 */
export const ComplexExample2 = () => {
  return (
    <ComplexComponent layout="horizontal" spacing="lg">
      <ComplexComponent.Body scrollable>
        <h3>Main Content Area</h3>
        <p>This content can be scrolled independently.</p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>Content line {i + 1}</p>
        ))}
      </ComplexComponent.Body>
      <ComplexComponent.Footer sticky position="left">
        <ComplexComponent.Action>Back</ComplexComponent.Action>
        <ComplexComponent.Action>Next</ComplexComponent.Action>
        <ComplexComponent.Action primary onClick={() => console.log("Finished!")}>
          Finish
        </ComplexComponent.Action>
      </ComplexComponent.Footer>
    </ComplexComponent>
  );
};

/**
 * Example 3: Designer customization
 */
export const ComplexExample3 = () => {
  return (
    <ComplexComponent layout="vertical" spacing="sm">
      <ComplexComponent.Header align="center">
        <ComplexComponent.Title variant="h1">Custom Design</ComplexComponent.Title>
        <ComplexComponent.Subtitle>
          Designers can fully customize the layout
        </ComplexComponent.Subtitle>
      </ComplexComponent.Header>
      <ComplexComponent.Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>Column 1</div>
          <div>Column 2</div>
        </div>
      </ComplexComponent.Body>
      <ComplexComponent.Footer position="center" sticky>
        <ComplexComponent.Action primary onClick={() => console.log("Custom action!")}>
          Custom Action
        </ComplexComponent.Action>
      </ComplexComponent.Footer>
    </ComplexComponent>
  );
};

// ============================================================================
// REAL-WORLD SCENARIOS
// ============================================================================

/**
 * Scenario: A data table with actions
 * - Simple: Basic button
 * - Hybrid: Card with optional icon
 * - Complex: Full table layout
 */
export const RealWorldScenario = () => {
  return (
    <div>
      {/* Simple: Action button */}
      <SimpleComponent variant="primary" size="sm" onClick={() => console.log("Edit")}>
        Edit
      </SimpleComponent>

      {/* Hybrid: Card component */}
      <HybridComponent
        title="User Profile"
        description="Manage your account settings"
        actionLabel="Edit Profile"
        onAction={() => console.log("Editing profile")}
      />

      {/* Complex: Full modal layout */}
      <ComplexComponent layout="vertical" spacing="md">
        <ComplexComponent.Header align="center">
          <ComplexComponent.Title variant="h1">Edit Profile</ComplexComponent.Title>
        </ComplexComponent.Header>
        <ComplexComponent.Body>
          <form>
            <label>Name</label>
            <input type="text" defaultValue="John Doe" />
            <label>Email</label>
            <input type="email" defaultValue="john@example.com" />
          </form>
        </ComplexComponent.Body>
        <ComplexComponent.Footer position="right">
          <ComplexComponent.Action>Cancel</ComplexComponent.Action>
          <ComplexComponent.Action primary onClick={() => console.log("Saved!")}>
            Save Changes
          </ComplexComponent.Action>
        </ComplexComponent.Footer>
      </ComplexComponent>
    </div>
  );
};
