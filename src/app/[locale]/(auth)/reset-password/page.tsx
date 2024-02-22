import LocaleSwitcherSelect from "@/components/LocaleSwitcherSelect";
import UpdatePasswordForm from "./components/update-password-form";

export default function LoginPage() {
    return (
        <div className="container relative h-full flex flex-col items-center justify-center">
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <LocaleSwitcherSelect />
            </div>
            <div className="lg:p-8">
                <div className="rounded-lg border overflow-hidden mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[380px]">
                    <UpdatePasswordForm />
                </div>
            </div>
        </div>
    );
}
