"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { debounceFunc } from "@/helpers/funcs";
import { CommandLoading } from "cmdk";
import { Loader } from "@/components/ui/loader";
import { api } from "@/configs/axios.config";
import { IListRes } from "@/models/DataTable";
import { ICompanyRes } from "@/models/api/company-api";
import ApiRoutes from "@/services/api.routes";
import qs from "qs";
import { useTranslations } from "next-intl";

interface IOptionItem {
    id: number;
    label: string;
}

interface ComboboxSearchEventProps {
    dataSelected: IOptionItem | {id: null, label: null}
    defaultName?: string;
    disabled: boolean;
    filterCompanyId?: string;
    onSelect: (value: number) => void;
}

export function ComboboxSearchEvent({ disabled, onSelect, filterCompanyId = '', dataSelected = {id: null, label: null} }: ComboboxSearchEventProps) {
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [dataSearch, setDataSearch] = React.useState<IOptionItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [onSelected, setOnSelected] = React.useState<IOptionItem | {id: null, label: null}>(dataSelected);
    const [loading, setLoading] = React.useState(false);

    // ** FUNC
    const fetchDataSearch = (textSearch: string) => {
        api.get<IResponse<IListRes<ICompanyRes>>>(ApiRoutes.getEvents, {
            params: {
                page: 1,
                pageSize: 10,
                search: {
                    name: textSearch
                },
                filters: {
                    company_id: filterCompanyId
                }
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        })
            .then((response) => response.data)
            .then((response) => {
                const listItem: IOptionItem[] = response.data.collection.map((item) => ({
                    id: item.id,
                    label: item.name,
                }));
                setDataSearch(listItem);
            })
            .catch(function (error) {
                console.log(error);
                setDataSearch([]);
            })
            .finally(function () {
                setLoading(false);
            });
    };

    const debounceSearch = React.useMemo(
        () => debounceFunc((nextValue: string) => fetchDataSearch(nextValue), 800),
        [],
    );

    const handleSearch = (text: string) => {
        setLoading(true);
        debounceSearch(text);
    };

    const handleOnSelect = (item: IOptionItem, currentValue: number) => {
        setOnSelected(onSelected?.id == currentValue ? { ...onSelected } : { id: item.id, label: item.label });
        onSelect(currentValue);
        setOpen(false);
    };

    const handleOnOpen = () => {
        if (!open) {
            fetchDataSearch("")
        }
        setOpen(!open);
    }

    React.useEffect(() => {
        setOnSelected(dataSelected);
    }, [dataSelected])

    return (
        <Popover
            open={open}
            onOpenChange={handleOnOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {!onSelected.hasOwnProperty('label') || onSelected?.label == null ?  translation("placeholder.selectEvent") : onSelected?.label} 
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-screen-sm p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={translation("placeholder.eventName")}
                        className="h-9"
                        onValueChange={handleSearch}
                    />
                    <CommandGroup>
                        {loading ? (
                            <CommandLoading className="flex justify-center items-center h-[80px]">
                                <Loader size={20} />
                            </CommandLoading>
                        ) : dataSearch.length == 0 ? (
                            <CommandLoading className="flex justify-center items-center h-[80px]">
                                {translation("label.notFoundData")}
                            </CommandLoading>
                        ) : (
                            dataSearch.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id.toString()}
                                    onSelect={(currentValue) => handleOnSelect(item, Number(currentValue))}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            onSelected?.id === item.id ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
