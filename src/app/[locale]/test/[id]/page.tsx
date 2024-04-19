import { unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";

const list = [
    {
        id: 1,
        name: "Test 1",
        slug: "test-1",
    },
    {
        id: 2,
        name: "Test 2",
        slug: "test-2",
    },
    {
        id: 3,
        name: "Test 3",
        slug: "test-3",
    },
];

export const dynamic = "force-static";
// export const dynamicParams = true
const locales = ["en", "vi"];
export async function generateStaticParams() {
    return [];
}
async function getListPostById(id: string) {
    const res = await fetch(`http://localhost:3333/posts/${id}`, { cache: "no-cache" });
    return res.json();
}

export default async function TestDetailPage({ params }: { params: { locale: string; id: string } }) {
    unstable_setRequestLocale(params.locale);
    const post = await getListPostById(params.id);
    return (
        <>
            <h1>Post Detail</h1>
            <ul>
                <li>Id: {post.id}</li>
                <li>Title: {post.title}</li>
                <li>Views: {post.views}</li>
            </ul>
            <Link href="/test">
                <p>Back</p>
            </Link>
        </>
    );
}
