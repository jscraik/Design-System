import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useForm } from "react-hook-form";

const meta: Meta<typeof Form> = {
  title: "Components/UI/Forms/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Form>;

type FormValues = {
  email: string;
};

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const form = useForm<FormValues>({
      defaultValues: { email: "" },
    });

    return (
      <Form {...form}>
        <form className="w-[320px] space-y-4" onSubmit={form.handleSubmit(fn())}>
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@company.com" {...field} />
                </FormControl>
                <FormDescription>We will never share your email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ValidateRequired: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Submit empty form", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /submit/i }));
    });

    await userEvent.step("Validation message appears", async () => {
      const errorMsg = await canvas.findByText("Email is required");
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveClass("text-destructive");
    });
  },
};

export const SuccessfulSubmit: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Type valid email", async () => {
      const input = canvas.getByRole("textbox", { name: /email/i });
      await userEvent.type(input, "agent@example.com");
    });

    await userEvent.step("Submit form", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /submit/i }));
    });

    await userEvent.step("No validation errors exist", () => {
      expect(canvas.queryByText("Email is required")).not.toBeInTheDocument();
    });
  },
};
