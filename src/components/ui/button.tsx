import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-500 ease-cinematic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-obsidian-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-obsidian-50 text-obsidian-950 hover:bg-white shadow-[0_0_0_0_rgba(212,175,55,0)] hover:shadow-[0_0_30px_-4px_rgba(212,175,55,0.35)]",
        outline:
          "border border-white/25 text-obsidian-50 hover:border-white/70 hover:bg-white/5",
        ghost: "text-obsidian-100 hover:text-white",
        link: "text-obsidian-100 underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-9 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-cursor="hover"
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
