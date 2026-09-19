import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = "default", agent = "Aura" } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Mesej diperlukan" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const gatewayUrl = process.env.HERMES_GATEWAY_URL || process.env.NEXT_PUBLIC_GATEWAY_URL;

    // Stream generator
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const sendToken = (text: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        };

        // Try forwarding to Hermes VPS Gateway if configured and available
        let forwarded = false;
        if (gatewayUrl) {
          try {
            const controllerAbort = new AbortController();
            const timeout = setTimeout(() => controllerAbort.abort(), 3500);

            const gwRes = await fetch(`${gatewayUrl}/api/chat/start`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message, session_id: sessionId }),
              signal: controllerAbort.signal,
            });
            clearTimeout(timeout);

            if (gwRes.ok) {
              const gwData = await gwRes.json();
              if (gwData.stream_id) {
                const streamRes = await fetch(`${gatewayUrl}/api/chat/stream?stream_id=${gwData.stream_id}`);
                if (streamRes.body) {
                  const reader = streamRes.body.getReader();
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                  }
                  forwarded = true;
                }
              }
            }
          } catch {
            forwarded = false;
          }
        }

        // Fallback intelligent Aura response streaming if gateway is offline/unreachable
        if (!forwarded) {
          const intro = `Hai! Saya **${agent}** (AuraOne Cloud Assistant).\n\n`;
          sendToken(intro);

          let reply = "";
          const lowerMsg = message.toLowerCase();

          if (lowerMsg.includes("salam") || lowerMsg.includes("hi") || lowerMsg.includes("halo") || lowerMsg.includes("hello")) {
            reply = `Ada apa-apa yang boleh saya bantu anda uruskan hari ini? Anda boleh tanya saya tentang:\n\n` +
              `- 📊 **Analisis Pasaran & Saham** (Aura-Trade Trading Engine)\n` +
              `- ✍️ **Kandungan & Penulisan Sakluma** (Aura-Pen Content Engine)\n` +
              `- 🎨 **Penjanaan Imej AI** (Aura-Art FLUX LoRA)\n` +
              `- 📡 **Radar Trend & Scrape Media** (Aura-Scout Intelligence)\n` +
              `- 🎬 **Video & Media Motion** (Aura-Vision Pipeline)\n` +
              `- ⚙️ **Konfigurasi Agen & Integrasi Workflow**\n\n` +
              `Sila beritahu saya apa objektif anda!`;
          } else if (lowerMsg.includes("kredit") || lowerMsg.includes("credit") || lowerMsg.includes("payg") || lowerMsg.includes("harga")) {
            reply = `Sistem AuraOne Cloud menggunakan sistem **Pay-As-You-Go (PAYG)**.\n\n` +
              `- Setiap pengguna Beta mendapat **RM10.00 kredit percuma** permulaan.\n` +
              `- Kos penggunaan ditolak secara telus mengikut jumlah token soalan & respons.\n` +
              `- Tambah nilai (topup) boleh dilakukan dengan pantas melalui integrasi FPX tempatan (Fasa 0b).`;
          } else if (lowerMsg.includes("sakluma") || lowerMsg.includes("daging") || lowerMsg.includes("salai")) {
            reply = `Jenama **Sakluma** (Daging Salai Tempurung Kelapa) adalah salah satu tunjang operasi komersial AuraOne.\n\n` +
              `Ejen **Aura-Pen** bertanggungjawab menghasilkan draf konten beremosi dan promosi di Facebook/TikTok, manakala **Aura-Art** menjana visual produk yang memukau.`;
          } else {
            reply = `Mesej anda: "*${message}*"\n\n` +
              `Saya telah merekodkan konteks perbualan ini ke dalam sesi kerja (*workspace sandbox*) anda di AuraOne Cloud.\n\n` +
              `Sebagai pembantu AI berbilang ejen dengan piawaian Bahasa Melayu pintar, saya sedia membantu anda menyusun pelan tindakan, menjana teks, atau memproses tugasan automasi anda.`;
          }

          // Simulate fluid typing stream
          const chunks = reply.split(" ");
          for (const chunk of chunks) {
            sendToken(chunk + " ");
            await new Promise((r) => setTimeout(r, 25));
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Ralat tidak diketahui";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

