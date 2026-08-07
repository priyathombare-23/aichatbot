interface SavedLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  createdAt: string;
}

let leadsDatabase: SavedLead[] = [];

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      leads: leadsDatabase,
    });
  }

  if (req.method === "POST") {
    const { fullName, email, phone, branch } = req.body || {};

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        error: "Name, email, and phone are required.",
      });
    }

    const newLead: SavedLead = {
      id: `lead-${Date.now()}`,
      fullName,
      email,
      phone,
      branch: branch || "Not specified",
      createdAt: new Date().toISOString(),
    };

    leadsDatabase.unshift(newLead);

    return res.status(200).json({
      success: true,
      lead: newLead,
    });
  }

  return res.status(405).json({
    error: "Method not allowed",
  });
}
