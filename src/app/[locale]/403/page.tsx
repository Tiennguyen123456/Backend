import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <>
            <h1>403</h1>
            <p>Unauthorized - Access Denied!</p>
            <p>You do not have the necessary permissions to view the requested page or resource.</p>
            <button>Back To Dashboard</button>
        </>
    );
}
