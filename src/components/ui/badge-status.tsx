import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { EStatus } from "@/constants/enum";

interface ModalProps {
    status: string;
    children?: React.ReactNode;
}
export const BadgeStatus: React.FC<ModalProps> = ({ status, children }) => {
    let classNameStatus = "";
    switch (status) {
        case EStatus.ACTIVE:
        case EStatus.DONE:
        case EStatus.SUCCESS:
        case EStatus.FINISHED:
            classNameStatus = "bg-green-700 text-white";
            break;
        case EStatus.INACTIVE:
        case EStatus.DELETED:
        case EStatus.STOPPED:
        case EStatus.ERROR:
            classNameStatus = "bg-red-700 text-white";
            break;
        case EStatus.CANCEL:
            classNameStatus = "bg-orange-500 text-white";
            break;
        case EStatus.PAUSED:
        case EStatus.PENDING:
            classNameStatus = "bg-yellow-600 text-white";
            break;
        case EStatus.RUNNING:
        case EStatus.PROCESSING:
            classNameStatus = "bg-blue-500 text-white";
            break;
        default:
            break;
    }
    return <Badge className={cn(classNameStatus, "")}>{children}</Badge>;
};
