
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge" // Use Edge Runtime for speed

export async function POST(req: NextRequest) {
    const gatekeeperUrl = process.env.NEXT_PUBLIC_VEND402_GATEKEEPER_URL

    if (!gatekeeperUrl) {
        return NextResponse.json(
            { message: "VEND402_GATEKEEPER_URL is not configured" },
            { status: 500 }
        )
    }

    try {
        const body = await req.json()
        console.log("[Proxy] Forwarding request to:", gatekeeperUrl)

        // We don't log the full body in prod for privacy, but useful for dev
        if (process.env.NODE_ENV === 'development') {
            console.log("[Proxy] Payload:", body)
        }

        const response = await fetch(gatekeeperUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Forward auth headers if necessary
                "Authorization": !req.headers.get("Authorization")?.startsWith("Bearer ")
                    ? `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                    : req.headers.get("Authorization")!
            },
            body: JSON.stringify(body),
        })

        // Check if response has body
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            console.log("[Proxy] Response status:", response.status)
            return NextResponse.json(data, { status: response.status })
        } else {
            const text = await response.text()
            console.error("[Proxy] Non-JSON response:", text)
            return NextResponse.json(
                { message: `Upstream error: ${text || response.statusText}` },
                { status: response.status }
            )
        }

    } catch (error) {
        console.error("[Proxy] Error:", error)
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal Proxy Error" },
            { status: 500 }
        )
    }
}
