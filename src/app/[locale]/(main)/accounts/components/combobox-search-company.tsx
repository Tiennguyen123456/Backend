"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { debounceFunc } from "@/helpers/funcs";
import { CommandLoading } from "cmdk";
import { Loader } from "@/components/ui/loader";
import { api } from "@/configs/axios.config";
import { IListRes } from "@/models/DataTable";
import { ICompanyRes } from "@/models/api/company-api";
import ApiRoutes from "@/services/api.routes";
import qs from "qs";

interface IOptionCompany {
    id: number;
    label: string;
}

interface ComboboxSearchCompanyProps {
    defaultName: string;
    disabled: boolean;
    onSelectCompany: (value: number) => void;
}

export function ComboboxSearchCompany({ disabled, onSelectCompany, defaultName }: ComboboxSearchCompanyProps) {
    const [dataSearchCompany, setDataSearchCompany] = React.useState<IOptionCompany[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selectd, setSelectd] = React.useState<IOptionCompany | undefined>();
    const [loading, setLoading] = React.useState(false);

    const fetchDataSearchCompany = (textSearch: string) => {
        api.get<IResponse<IListRes<ICompanyRes>>>(ApiRoutes.getCompanies, {
            params: {
                page: 1,
                pageSize: 10,
                search: {
                    name: textSearch,
                    code: textSearch,
                },
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        })
            .then((response) => response.data)
            .then((response) => {
                const formattedDataCompany: IOptionCompany[] = response.data.collection.map((item) => ({
                    id: item.id,
                    label: item.name,
                }));
                setDataSearchCompany(formattedDataCompany);
            })
            .catch(function (error) {
                console.log(error);
                setDataSearchCompany([]);
            })
            .finally(function () {
                setLoading(false);
            });
    };

    const debounceSearchCompany = React.useCallback(
        debounceFunc((nextValue: string) => fetchDataSearchCompany(nextValue), 800),
        [],
    );

    const handleSearch = (text: string) => {
        setLoading(true);
        debounceSearchCompany(text);
    };

    const handleOnSelect = (company: IOptionCompany, currentValue: number) => {
        setSelectd(selectd?.id == currentValue ? { ...selectd } : { id: company.id, label: company.label });
        onSelectCompany(currentValue);
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectd ? selectd?.label : defaultName ? defaultName : "Select company..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-screen-sm p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search company..."
                        className="h-9"
                        onValueChange={handleSearch}
                    />
                    <CommandGroup>
                        {loading ? (
                            <CommandLoading className="flex justify-center items-center h-[80px]">
                                <Loader size={20} />
                            </CommandLoading>
                        ) : dataSearchCompany.length == 0 ? (
                            <CommandLoading className="flex justify-center items-center h-[80px]">
                                Not found data.
                            </CommandLoading>
                        ) : (
                            dataSearchCompany.map((company) => (
                                <CommandItem
                                    key={company.id}
                                    value={company.id.toString()}
                                    onSelect={(currentValue) => handleOnSelect(company, Number(currentValue))}
                                >
                                    {company.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectd?.id === company.id ? "opacity-100" : "opacity-0",
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
