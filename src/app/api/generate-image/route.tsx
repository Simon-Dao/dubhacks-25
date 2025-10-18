import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request): Promise<Response> {

  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const prompt = (form.get("prompt") as string) ?? "Enhance this outfit";

    if (!file) {
      return new Response(JSON.stringify({ error: "Missing 'image' file" }), { status: 400 });
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400 }
      );
    }

    const result = await openai.images.edit({
      model: "gpt-image-1-mini",
      image: file,
      prompt,
      size: "1024x1024",
    });

    if (!result.data) {
        return new Response(
            JSON.stringify({ error: "Image generation failed" }),
            { status: 500 }
        );
    }

    const b64 = result.data[0].b64_json;

    if(!b64) {
      return new Response(
        JSON.stringify({ error: "No image data received" }),
      )
    }

    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return new Response(bytes, { headers: { "Content-Type": "image/png" } });

  } catch (error: unknown) {
    console.error("Error generating image:", error);

    const message =
      error instanceof Error ? error.message : "Image generation failed";

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500 }
    );
  }
}
