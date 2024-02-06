'use client'

import { Check, ChevronsUpDown, Globe, Languages, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "./ui/command";
import { useModal } from "@/hooks/use-modal";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n-configurations/i18n-navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/i18n-configurations/config";
import { cn } from "@/lib/utils";

export default function LocaleSwitcherSelect() {
    // I18n
    const router = useRouter();
    const pathname = usePathname();
    const translation = useTranslations("localeSwitcher");
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();

    // State
    const modal = useModal();
    const [open, setOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(locale);

    // Func
    const onLanguageSelect = (value: string) => {
        localStorage.setItem("locale", value);
        setSelectedLanguage(value);

        startTransition(() => {
            router.replace(pathname, { locale: value });
        });
    };

    return (
        <>
            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a store"
                        className={"w-[150px] justify-between"}
                    >
                        <Globe className="mr-2 h-4 w-4" />
                        {translation(locale)}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px] p-0">
                    <Command>
                        <CommandList>
                            {locales.map((item, index) => (
                                <CommandItem
                                    key={index}
                                    className="text-base"
                                    onSelect={() => onLanguageSelect(item)}
                                >
                                    {translation(item)}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4 text-lime-700",
                                            item === locale ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
