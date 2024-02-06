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

interface DateyTimePickerProps {
    title?: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function DateyTimePicker({ title = "Pick a date", date, setDate }: DateyTimePickerProps) {
    const locale = useLocale();
    // const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-[250px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "P HH:mm:ss") : <span>{title}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    locale={locale == "en" ? enUS : vi}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
                <div className="p-3 border-t border-border text-center">
                    <TimePickerDemo
                        setDate={setDate}
                        date={date}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
