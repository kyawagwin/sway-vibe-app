import { NextResponse } from "next/server";

export const runtime = "edge";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name");

        if (!name) {
            return new NextResponse("Missing photo name", { status: 400 });
        }

        // Construct the Google Places Media endpoint URL
        const googleUrl = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=800&maxWidthPx=800&key=${PLACES_API_KEY}`;

        // Fetch the image from Google server-side to prevent exposing the API Key to the client Network tab
        const response = await fetch(googleUrl, { redirect: 'follow' });

        if (!response.ok) {
            throw new Error(`Failed to fetch image from Google: ${response.status}`);
        }

        // We can just proxy the response body stream and forward the headers (like Content-Type and Cache-Control)
        const imageBuffer = await response.arrayBuffer();

        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
        headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

        return new NextResponse(imageBuffer, {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error("Image Proxy Error:", error);
        return new NextResponse("Internal Server Error fetching image", { status: 500 });
    }
}
