export interface IModal {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    loading?: boolean;
}
