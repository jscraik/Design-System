# Form Validation Patterns

Reusable validation patterns and components using `react-hook-form` + `zod`.

---

## Setup

Dependencies already available:
```bash
# react-hook-form - Form state management
pnpm add react-hook-form zod

# Design system tokens
import { colorTokens } from '@design-studio/tokens';
```

---

## Pattern 1: Validated Input Component

Create a wrapper that shows errors inline:

```tsx
// packages/ui/src/components/ui/forms/ValidatedInput.tsx
import { useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@design-studio/ui/forms';
import { colorTokens } from '@design-studio/tokens';

interface ValidatedInputProps {
  name: string;
  label?: string;
  schema: z.ZodString;
  required?: boolean;
}

export function ValidatedInput({ 
  name, 
  label, 
  schema,
  required = false 
}: ValidatedInputProps) {
  const { 
    register, 
    formState: { errors } 
  } = useFormContext();

  const error = errors[name];

  return (
    <div>
      {label && (
        <label className="text-sm font-medium mb-1">
          {label}
          {required && <span className="text-icon-status-error">*</span>}
        </label>
      )}
      <Input
        {...register(name, { resolver: zodResolver(schema) })}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={error ? 'border-icon-status-error' : ''}
      />
      {error && (
        <p 
          id={`${name}-error`}
          className="text-sm text-icon-status-error mt-1"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
```

**Usage**:
```tsx
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be 8+ characters'),
});

<ValidatedInput 
  name="email" 
  label="Email" 
  schema={schema.shape.email} 
  required 
/>
```

---

## Pattern 2: Form Component with Validation

Wrapper for entire form groups:

```tsx
// packages/ui/src/components/ui/forms/ValidatedForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type ReactNode } from 'react';

interface ValidatedFormProps {
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => void | Promise<void>;
  children: ReactNode;
}

export function ValidatedForm({ 
  schema, 
  onSubmit, 
  children 
}: ValidatedFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {children}
    </form>
  );
}
```

**Usage**:
```tsx
const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
});

function MyForm() {
  const handleSubmit = async (data) => {
    await api.user.create(data);
  };

  return (
    <ValidatedForm schema={schema} onSubmit={handleSubmit}>
      <ValidatedInput name="username" schema={schema.shape.username} />
      <ValidatedInput name="email" schema={schema.shape.email} />
      <Button type="submit">Submit</Button>
    </ValidatedForm>
  );
}
```

---

## Pattern 3: Error Message Component

Reusable error display:

```tsx
// packages/ui/src/components/ui/feedback/ErrorMessage.tsx
interface ErrorMessageProps {
  id?: string;
  children: string;
  type?: 'error' | 'warning' | 'success';
}

export function ErrorMessage({ 
  id, 
  children, 
  type = 'error' 
}: ErrorMessageProps) {
  const colors = {
    error: 'text-icon-status-error bg-icon-status-error/10',
    warning: 'text-icon-status-warning bg-icon-status-warning/10',
    success: 'text-icon-status-success bg-icon-status-success/10',
  };

  return (
    <p 
      id={id}
      className={`text-sm ${colors[type]}`}
      role="alert"
    >
      {children}
    </p>
  );
}
```

---

## Common Validation Schemas

### Email
```ts
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format');
```

### Password
```ts
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase')
  .regex(/[a-z]/, 'Password must contain lowercase')
  .regex(/[0-9]/, 'Password must contain a number');
```

### Name
```ts
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters');
```

---

## Quick Reference

| Validation Type | Zod Schema | Error Pattern |
|---------------|-------------|--------------|
| Required field | `z.string().min(1)` | "Field is required" |
| Email | `z.string().email()` | "Invalid email format" |
| Min length | `z.string().min(n)` | "Must be at least n characters" |
| Max length | `z.string().max(n)` | "Must be at most n characters" |
| Pattern match | `z.string().regex(/.../)` | "Invalid format" |
| Choice | `z.enum(['a', 'b']) | "Must be one of: a, b" |

---

## Integration with Existing Components

The form components in `@design-studio/ui/forms` don't include built-in validation. Use these patterns:

1. **Wrap Input/Select** with ValidatedInput
2. **Use react-hook-form** for form state
3. **Use zod** for schema validation
4. **Display errors** using ErrorMessage component

---

## Example: Complete Registration Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ValidatedInput } from '@design-studio/ui/forms';
import { Button } from '@design-studio/ui/base';
import { ErrorMessage } from '@design-studio/ui/feedback';

const registrationSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data) => {
    await api.register(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ValidatedInput
        name="username"
        label="Username"
        schema={registrationSchema.shape.username}
        required
      />
      <ValidatedInput
        name="email"
        label="Email"
        schema={registrationSchema.shape.email}
        required
      />
      <ValidatedInput
        name="password"
        label="Password"
        schema={registrationSchema.shape.password}
        required
        type="password"
      />
      <Button type="submit" variant="primary">Register</Button>
    </form>
  );
}
```
