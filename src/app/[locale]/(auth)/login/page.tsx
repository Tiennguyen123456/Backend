import LocaleSwitcherSelect from "@/components/LocaleSwitcherSelect";
import LoginForm from "./components/login-form";

export default function LoginPage() {
    return (
        <div className="container relative h-full flex flex-col items-center justify-center">
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <LocaleSwitcherSelect />
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[380px]">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
