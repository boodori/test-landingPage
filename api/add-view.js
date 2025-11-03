export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { NOTION_KEY, NOTION_DB } = process.env;

  if (!NOTION_KEY || !NOTION_DB) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DB },
      properties: {
        Page: {
          title: [{ text: { content: "landing" } }],
        },
        Date: {
          date: { start: new Date().toISOString() },
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json(data);
  }

  res.status(200).json({ success: true, id: data.id });
}
