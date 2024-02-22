import Breadcrumbs from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { generateBreadcrumbs } from "@/helpers/funcs";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CompanyForm } from "./components/company-form";

export default function CompanyPage({ params }: { params: { companyId: string } }) {
    // ** I18n
    const translation = useTranslations("");

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("companyPage.create.title")}</h2>
                    {/* <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <Button variant={"secondary"}>
                            <PlusCircle className="w-5 h-5 md:mr-2" />
                            <p className="hidden md:block">{translation("action.create")}</p>
                        </Button>
                    </div> */}
                </div>
            </div>
            <CompanyForm initialData={null} />
        </>
    );
}
