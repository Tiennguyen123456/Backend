"use client";

import LocaleSwitcherSelect from "@/components/LocaleSwitcherSelect";
import LoginForm from "./components/login-form";
import ResetPasswordForm from "./components/reset-password-form";
import { useState } from "react";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    const onChangeForm = () => {
        setIsLogin(!isLogin);
    }

    return (
        <div className="container relative h-full flex flex-col items-center justify-center">
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <LocaleSwitcherSelect />
            </div>
            <div className="lg:p-8">
                <div className="rounded-lg border overflow-hidden mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[380px]">
                    { isLogin ? <LoginForm onChangeForm={onChangeForm} /> : <ResetPasswordForm onChangeForm={onChangeForm} /> }
                </div>
            </div>
        </div>
    );
}
