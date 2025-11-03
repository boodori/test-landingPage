export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const NOTION_KEY = process.env.NOTION_KEY;
  const NOTION_DB  = process.env.NOTION_DB;
  if (!NOTION_KEY || !NOTION_DB) return res.status(500).json({ error: "Missing env" });

  const { page = "landing", ref = "-" } = (req.headers["content-type"] || "").includes("application/json")
    ? await req.json().catch(() => ({}))
    : {};

  const resp = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DB },
      properties: {
        Name: { title: [{ text: { content: String(page) } }] },
        date: { date: { start: new Date().toISOString() } },
        Referrer: ref === "-" ? undefined : { rich_text: [{ text: { content: String(ref) } }] }
      },
    }),
  });

  const data = await resp.json();
  if (!resp.ok) return res.status(500).json(data);
  return res.status(200).json({ success: true, id: data.id });
}
