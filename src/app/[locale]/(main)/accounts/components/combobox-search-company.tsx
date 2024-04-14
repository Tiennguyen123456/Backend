"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { debounceFunc } from "@/helpers/funcs";
import { CommandLoading } from "cmdk";
import { Loader } from "@/components/ui/loader";
import { api } from "@/configs/axios.config";
import { IListRes } from "@/models/DataTable";
import { ICompanyRes } from "@/models/api/company-api";
import ApiRoutes from "@/services/api.routes";
import qs from "qs";
import { useTranslations } from "next-intl";

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
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [dataSearchCompany, setDataSearchCompany] = React.useState<IOptionCompany[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<IOptionCompany | undefined>();
    const [loading, setLoading] = React.useState(false);

    // ** FUNC
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

    const debounceSearchCompany = React.useMemo(() => {
        return debounceFunc((nextValue: string) => fetchDataSearchCompany(nextValue), 800);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (text: string) => {
        setLoading(true);
        debounceSearchCompany(text);
    };

    const handleOnSelect = (company: IOptionCompany, currentValue: number) => {
        setSelected(selected?.id == currentValue ? { ...selected } : { id: company.id, label: company.label });
        onSelectCompany(currentValue);
        setOpen(false);
    };

    const handleOnUnSelected = (e: React.MouseEvent) => {
        e.preventDefault();
        setSelected(undefined);
        onSelectCompany(-1);
    };

    const handleOnOpen = () => {
        if (!open) {
            fetchDataSearchCompany("");
        }
        setOpen(!open);
    };

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
                    {selected ? selected?.label : defaultName ? defaultName : translation("placeholder.company")}
                    {selected ? (
                        <X
                            className="ml-2 h-5 w-5 shrink-0"
                            onClick={handleOnUnSelected}
                        />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-screen-sm p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={translation("placeholder.companyName")}
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
                                {translation("label.notFoundData")}
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
                                            selected?.id === company.id ? "opacity-100" : "opacity-0",
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
