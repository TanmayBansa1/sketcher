import Link from "next/link";
import { syncUser } from "../../lib/sync-user";
import { redirect } from "next/navigation";

// Force dynamic rendering - this route cannot be statically generated
export const dynamic = 'force-dynamic';

export default async function Page() {

    try{        
        await syncUser();
        return redirect("/dashboard");
    } catch (error) {
        console.error(error);
        return <div>
            Error synchronising your data, please try and sign up again
            <Link href="/sign-in">Sign in</Link>
        </div>
    }
}