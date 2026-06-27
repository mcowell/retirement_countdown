import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify the caller's identity using their token (not the service role key —
  // we just need to know WHO is asking, which requires checking their JWT).
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  if (userData.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const { retirement_date, label } = req.body ?? {};
  if (!retirement_date) {
    return res.status(400).json({ error: "retirement_date is required" });
  }

  // TODO: once login is added, verify the requester is an admin here
  // (e.g. check a Supabase Auth JWT) before allowing the update.

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("retirement_settings")
    .select("uuid")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !existing) {
    return res.status(500).json({ error: "Could not find existing row" });
  }

  const { error: updateError } = await supabaseAdmin
    .from("retirement_settings")
    .update({
      retirement_date,
      label: label ?? "Retirement",
      updated_at: new Date().toISOString(),
    })
    .eq("uuid", existing.uuid);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.status(200).json({ success: true });
}