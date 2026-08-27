export async function onRequestPost(context) {
  const { request, env } = context;

  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid form submission." }, 400);
  }

  const clean = (value, max = 4000) => String(value || "").trim().slice(0, max);
  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const phone = clean(data.phone, 80);
  const project = clean(data.project, 200);
  const message = clean(data.message, 5000);
  const company = clean(data.company, 200);

  if (company) return json({ ok: true });
  if (!name || !email || !message) {
    return json({ error: "Name, email, and story details are required." }, 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const accountId = env.CF_ACCOUNT_ID;
  const apiToken = env.CF_EMAIL_API_TOKEN;
  const to = env.CONTACT_TO;
  const from = env.CONTACT_FROM;

  if (!accountId || !apiToken || !to || !from) {
    return json({ error: "The contact form is not fully configured yet." }, 503);
  }

  const text = [
    "New Cornwell Legacy Films inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Project: ${project || "Not selected"}`,
    "",
    "Story:",
    message,
  ].join("\n");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: { address: from, name: "Cornwell Legacy Films Website" },
        to: [{ address: to }],
        replyTo: { address: email, name },
        subject: `New Legacy Film Inquiry — ${name}`,
        text,
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Contact email failed", response.status, detail);
    return json({ error: "Unable to send your message right now." }, 502);
  }

  return json({ ok: true });
}

export function onRequestGet() {
  return new Response("Method not allowed", { status: 405 });
}
