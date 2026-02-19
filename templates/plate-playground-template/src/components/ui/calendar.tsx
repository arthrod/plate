"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "buttons",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: "ghost" | "outline" | "default" | "link" | "secondary" | "destructive" | null;
}) {
  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        "group/calendar bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      classNames={{
        months: "relative flex flex-col gap-4 md:flex-row",
        month: "flex w-full flex-col gap-4",
        caption: "flex h-(--cell-size) w-full items-center justify-between px-(--cell-size)",
        caption_label: "select-none font-medium text-sm",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
        ),
        nav_button_previous: "",
        nav_button_next: "",
        nav_icon: "size-4",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "flex-1 select-none rounded-md font-normal text-[0.8rem] text-muted-foreground",
        row: "mt-2 flex w-full",
        cell: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
        ),
        day: cn(
          "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none rounded-md hover:bg-accent hover:text-accent-foreground",
          buttonVariants({ variant: buttonVariant }),
        ),
        day_range_start:
          "rounded-l-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_range_end:
          "rounded-r-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_range_middle:
          "rounded-none bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        weeknumber: "select-none text-[0.8rem] text-muted-foreground",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeftIcon className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRightIcon className={cn("size-4", className)} {...props} />
        ),
        WeekNumber: ({ number, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {number}
            </div>
          </td>
        ),
        ...components,
      }}
      formatters={{
        formatMonthCaption: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

export { Calendar };
