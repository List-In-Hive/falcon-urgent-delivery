// Netlify Forms with Next.js: forms are registered by the static file public/__forms.html,
// and submissions must be POSTed to that static file, not to the page.
// https://opennext.js.org/netlify/forms

export async function submitNetlifyForm(data: FormData): Promise<void> {
  const body = new URLSearchParams();
  data.forEach((value, key) => {
    if (typeof value === "string") body.append(key, value);
  });
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    // Netlify Forms only exists on Netlify. In local dev, log the submission instead of failing.
    if (process.env.NODE_ENV === "development") {
      console.info("[netlify form, dev only]", Object.fromEntries(body.entries()));
      return;
    }
    throw new Error(`Form submission failed (${res.status})`);
  }
}
