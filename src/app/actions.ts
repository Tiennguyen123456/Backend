"use server";
import { revalidatePath } from "next/cache";

export async function revalidatePathTestPage(slug: string, formData: any) {
    let pathLocaleEN = `/landing-page/${slug}`;
    let pathLocaleVI = `/vi/landing-page/${slug}`;
    revalidatePath(pathLocaleEN);
    revalidatePath(pathLocaleVI);
}
