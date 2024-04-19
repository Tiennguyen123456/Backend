"use client";
import { revalidatePathTestPage } from "@/app/actions";

async function getListPost() {
    const res = await fetch("http://localhost:3333/posts");
    return res.json();
}

interface post {
    id: string;
    title: string;
    views: number;
}
export default async function TestPage() {
    const posts: post[] = await getListPost();
    const updateUserWithId = revalidatePathTestPage.bind(null, "5");
    return (
        <>
            <div style={{ display: "flex", gap: "2rem" }}>
                <ul>
                    {posts.map((post) => (
                        <li key={`${post.id}`}>
                            <a href={`/test/${Number(post.id)}`}>{post.title}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <form action={updateUserWithId}>
                <input
                    type="text"
                    name="name"
                />
                <button type="submit">Revalidate Path Page 5</button>
            </form>
        </>
    );
}
