import { useTranslations } from "next-intl";

interface CompanyFormProps {
    initialData: null;
}
export const CompanyForm: React.FC<CompanyFormProps> = ({ initialData }: CompanyFormProps) => {
    // ** I18n
    const translation = useTranslations("");

    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create";
    return <></>;
};
