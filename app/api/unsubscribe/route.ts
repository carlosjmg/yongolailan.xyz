import { prisma } from "@/lib/prisma";

function page(title: string, message: string) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
     <title>${title}</title></head>
     <body style="background:#0a0a0a;color:#eee;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0">
       <div style="text-align:center;padding:40px;max-width:460px">
         <h1 style="font-weight:400;font-size:28px;margin-bottom:12px">${title}</h1>
         <p style="color:#aaa;line-height:1.6">${message}</p>
         <p style="margin-top:28px"><a href="/" style="color:#d9a441;text-decoration:none">← Back to yongolailan.xyz</a></p>
       </div>
     </body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return page("Invalid link", "This unsubscribe link is missing its token.");

  const result = await prisma.subscriber.deleteMany({ where: { unsubscribeToken: token } });
  if (result.count === 0) {
    return page("Already unsubscribed", "You're not on the list — nothing to do.");
  }
  return page("Unsubscribed", "You've been removed from the newsletter. Sorry to see you go.");
}
