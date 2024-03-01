import { Separator } from "@/components/ui/separator";
import InformationForm from "./form/information-form";
import { IEventRes } from "@/models/api/event-api";
import { useTranslations } from "next-intl";

interface InformationClientProps {
    data: IEventRes | undefined;
    onRefresh: () => void;
}
export default function InformationClient({ data, onRefresh }: InformationClientProps) {
    // ** I18n
    const translation = useTranslations("");

    if (!data) return null;

    return (
        <>
            <div>
                <h3 className="text-lg font-medium">{translation("eventDetailsPage.tab.information")}</h3>
                <p className="text-sm text-muted-foreground">
                    {translation("eventDetailsPage.description.information")}
                </p>
            </div>
            <Separator />
            <InformationForm
                data={data}
                onRefresh={onRefresh}
            />
        </>
    );
}
