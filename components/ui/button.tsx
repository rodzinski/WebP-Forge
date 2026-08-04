import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[transform,background-color,color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-neutral-950 px-6 py-3.5 text-white shadow-[0_12px_30px_rgba(0,0,0,.16)] hover:-translate-y-0.5 hover:bg-neutral-800",
        accent: "bg-lime-300 px-6 py-3.5 text-neutral-950 shadow-[0_12px_28px_rgba(163,230,53,.22)] hover:-translate-y-0.5 hover:bg-lime-200",
        outline: "border border-neutral-300 bg-white/70 px-6 py-3.5 text-neutral-900 hover:-translate-y-0.5 hover:border-neutral-500 hover:bg-white",
        ghost: "px-4 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
      },
      size: { default: "h-12", sm: "h-10 px-4 text-xs", lg: "h-14 px-7 text-base" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
