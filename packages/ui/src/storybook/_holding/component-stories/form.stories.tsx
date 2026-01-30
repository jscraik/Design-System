import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useForm } from "react-hook-form";

import { Button } from "../../base/Button";
import { Input } from "../../base/Input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./fallback/Form";

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
