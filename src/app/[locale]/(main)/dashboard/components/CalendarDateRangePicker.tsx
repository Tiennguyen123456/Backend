"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, subBusinessDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
    dob: z.object({
        from: z.date(),
        to: z.date(),
    }),
});

export default function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
    // const [date, setDate] = useState<DateRange | undefined>({
    //     from: subBusinessDays(new Date(2024, 0, 6), 10),
    //     to: new Date(2024, 0, 6),
    // });
    // return (
    //     <div className={cn("grid gap-2", className)}>
    //         <Popover>
    //             <PopoverTrigger asChild>
    //                 <Button
    //                     id="date"
    //                     variant={"outline"}
    //                     className={cn(
    //                         "w-[260px] justify-start text-left font-normal",
    //                         !date && "text-muted-foreground",
    //                     )}
    //                 >
    //                     <CalendarIcon className="mr-2 h-4 w-4" />
    //                     {date?.from ? (
    //                         date.to ? (
    //                             <>
    //                                 {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
    //                             </>
    //                         ) : (
    //                             format(date.from, "LLL dd, y")
    //                         )
    //                     ) : (
    //                         <span>Pick a date</span>
    //                     )}
    //                 </Button>
    //             </PopoverTrigger>
    //             <PopoverContent
    //                 className="w-auto p-0"
    //                 align="end"
    //             >
    //                 <Calendar
    //                     initialFocus
    //                     mode="range"
    //                     defaultMonth={date?.from}
    //                     selected={date}
    //                     onSelect={setDate}
    //                     numberOfMonths={2}
    //                 />
    //             </PopoverContent>
    //         </Popover>
    //     </div>
    // );
    const [selectedRange, setSelectedRange] = useState<DateRange>();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }
    const handleRangeSelect: SelectRangeEventHandler = (range: DateRange | undefined) => {
        console.log(range);
        setSelectedRange(range);
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground",
                                            )}
                                        >
                                            {field.value?.from && field.value?.to
                                                ? format(field.value.from, "PPP") +
                                                  " - " +
                                                  format(field.value.to, "PPP")
                                                : field.value?.from
                                                ? format(field.value.from, "PPP")
                                                : field.value?.to
                                                ? format(field.value.to, "PPP")
                                                : ""}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="range"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
