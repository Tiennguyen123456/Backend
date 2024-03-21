"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker-demo";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { DateTimeFormat } from "@/constants/variables";

interface DateTimePickerProps {
    disabled: boolean;
    className?: string;
    title?: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    onTimePicker?: boolean;
    formatDate?: string;
}

export function DateTimePicker({
    title = "Pick a date",
    className,
    date,
    setDate,
    disabled,
    onTimePicker = true,
    formatDate = DateTimeFormat,
}: DateTimePickerProps) {
    const locale = useLocale();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        className,
                        "sm:w-full md:w-[200px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className={`${date ? "hidden sm:block" : "block"} mr-2 h-4 w-4`} />
                    {date ? format(date, formatDate.toString()) : <span>{title}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    locale={locale == "en" ? enUS : vi}
                    mode="single"
                    captionLayout="dropdown-buttons"
                    defaultMonth={date}
                    selected={date}
                    onSelect={setDate}
                    fromYear={1960}
                    toYear={Number(format(new Date(), "y")) + 50}
                    initialFocus
                />
                {onTimePicker && (
                    <div className="p-2 border-t border-border text-center">
                        <TimePickerDemo
                            setDate={setDate}
                            date={date}
                        />
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
