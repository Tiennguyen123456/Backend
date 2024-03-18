import { Separator } from "@/components/ui/separator";
import { ICustomFields, IEventRes } from "@/models/api/event-api";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldModal } from "./form/custom-field-modal";
import { useState } from "react";
import eventApi from "@/services/event-api";
import { APIStatus, MessageCode } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";

interface CustomFieldsClientProps {
    eventId: number;
    data: IEventRes | undefined;
    onRefresh: () => void;
}
export default function CustomFieldsClient({ eventId, data, onRefresh }: CustomFieldsClientProps) {
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<ICustomFields | null>(null);

    // ** Func
    const handleEditCustomField = (data: ICustomFields) => {
        setRowSelected({
            ...data,
            name: data.name ?? "",
            value: data.value ?? "",
            description: data.description ?? "",
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setRowSelected(null);
        setOpenModal(false);
    };

    const handleReFreshDataTable = () => {
        onRefresh();
    };

    const handleCreateCustomField = () => {
        setRowSelected(null);
        setOpenModal(true);
    };

    const onDelete = async (customFieldId: any) => {
        const messageSuccess = translation("successApi.DELETE_CUSTOM_FIELD_SUCCESS");
        const messageError = translation("errorApi.DELETE_CUSTOM_FIELD_FAILED");
        try {
            setLoading(true);
            const response = await eventApi.deleteCustomFieldsEvent(customFieldId);
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                onRefresh();
            }
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.data && data?.message_code == MessageCode.VALIDATION_ERROR) {
                const [value] = Object.values(data.data);
                const message = Array(value).toString() ?? messageError;
                toastError(message);
            } else if (data?.message_code != MessageCode.VALIDATION_ERROR) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(messageError);
            }
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (!data) return null;

    return (
        <>
            <div className="flex">
                <div>
                    <h3 className="text-lg font-medium">{translation("eventDetailsPage.tab.customFields")}</h3>
                    <p className="text-sm text-muted-foreground">
                        {translation("eventDetailsPage.description.customFields")}
                    </p>
                </div>
                <div className="ml-auto">
                    <Button
                        disabled={loading}
                        onClick={handleCreateCustomField}
                        variant={"secondary"}
                    >
                        <PlusCircle className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.createField")}</p>
                    </Button>
                </div>
            </div>
            <Separator />
            <CustomFieldModal
                eventId={eventId}
                className="sm:max-w-[460px] overflow-y-auto"
                isOpen={openModal}
                onClose={handleCloseModal}
                defaultData={rowSelected}
                onConfirm={handleReFreshDataTable}
            />
            <div className="space-y-6">
                <div className="hidden md:grid grid-cols-8 gap-x-6 gap-y-4">
                    <Label className="col-span-2">{translation("label.fieldName")}</Label>
                    <Label className="col-span-2">{translation("label.description")}</Label>
                    <Label className="col-span-3">{translation("label.fieldValue")}</Label>
                    <Label className="col-span-1"></Label>
                </div>
                {data.custom_fields.map((item, index) => (
                    <div
                        className="space-y-4"
                        key={index}
                    >
                        <Separator className={index == 0 ? "hidden md:block" : ""} />
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-2 md:gap-x-4 gap-y-4">
                            <div className="col-span-2">
                                <Label className="md:hidden">{translation("label.fieldName")}</Label>
                                <Input
                                    className="h-10"
                                    disabled={true}
                                    value={item.name}
                                />
                            </div>
                            <div className="col-span-2">
                                <Label className="md:hidden">{translation("label.description")}</Label>
                                <Input
                                    className="h-10"
                                    disabled={true}
                                    value={item.description}
                                />
                            </div>
                            <div className="col-span-4">
                                <Label className="md:hidden">{translation("label.fieldValue")}</Label>
                                <Textarea
                                    className="min-h-[40px] py-0 col-span-4"
                                    disabled={true}
                                    value={item.value}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-8 flex justify-end items-end gap-2">
                                <Button
                                    disabled={loading}
                                    type="button"
                                    onClick={() => handleEditCustomField(item)}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    disabled={loading}
                                    variant={"destructive"}
                                    type="button"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
