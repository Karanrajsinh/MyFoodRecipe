import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.List
            ref={ref}
            className={cn(
                "inline-flex w-full items-center justify-start gap-0 border-b-2 border-red-200 p-0 text-gray-700",
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                "mx-2 -mb-[2px] rounded-xl inline-flex items-center justify-start whitespace-nowrap px-4 py-2 text-base font-medium transition-all data-[state=active]:bg-red-400 data-[state=active]:text-white",
                className
            )}
            {...props}
        />
    )
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Content
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-y-auto overflow-x-hidden  custom-scrollbar min-h-[70vh]",
                className
            )}
            {...props}
        />
    )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
