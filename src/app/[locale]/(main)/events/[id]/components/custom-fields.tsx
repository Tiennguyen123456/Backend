import { Separator } from "@/components/ui/separator";
import CustomFieldsForm from "./form/custom-fields-form";
import { IEventRes } from "@/models/api/event-api";
import { useTranslations } from "next-intl";

interface CustomFieldsClientProps {
    data: IEventRes | undefined;
    onRefresh: () => void;
}
export default function CustomFieldsClient({ data, onRefresh }: CustomFieldsClientProps) {
    // ** I18n
    const translation = useTranslations("");

    if (!data) return null;

    return (
        <>
            <div>
                <h3 className="text-lg font-medium">{translation("eventDetailsPage.tab.customFields")}</h3>
                <p className="text-sm text-muted-foreground">
                    {translation("eventDetailsPage.description.customFields")}
                </p>
            </div>
            <Separator />
            <CustomFieldsForm
                data={data}
                onRefresh={onRefresh}
            />
        </>
    );
}
