import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface AccordionProps {
  items: {
    value: string;
    title: string;
    content: React.ReactNode;
  }[];
  defaultValue: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, defaultValue }) => (
  <AccordionPrimitive.Root
    className="AccordionRoot"
    type="single"
    defaultValue={defaultValue}
    collapsible
  >
    {items.map((item) => (
      <AccordionItem
        className="AccordionItem"
        value={item.value}
        key={item.value}
      >
        <AccordionTrigger>{`${item.title}`}</AccordionTrigger>
        <AccordionContent>{item.content}</AccordionContent>
      </AccordionItem>
    ))}
  </AccordionPrimitive.Root>
);

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("AccordionItem", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="AccordionHeader">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn("AccordionTrigger", className)}
      {...props}
    >
      {children}
      <ChevronDown className="AccordionChevron" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn("AccordionContent", className)}
    {...props}
  >
    <div className={cn("AccordionContentText", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
