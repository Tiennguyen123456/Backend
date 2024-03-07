"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title?: string;
    description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading, title, description }) => {
    // ** I18n
    const translation = useTranslations("");

    const titleTrans = title ?? translation("label.titleAlert");
    const descriptionTrans = description ?? translation("label.descriptionAlert");
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title={titleTrans}
            description={descriptionTrans}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={onConfirm}
                >
                    {translation("action.continue")}
                </Button>
                <Button
                    disabled={loading}
                    variant="outline"
                    onClick={onClose}
                >
                    {translation("action.cancel")}
                </Button>
            </div>
        </Modal>
    );
};
