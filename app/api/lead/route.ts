import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function htmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function readLeadPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json();

    return {
      isJson: true,
      name: String(body.name || "").trim(),
      company: String(body.company || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      automation_request: String(
        body.automation_request || ""
      ).trim(),
    };
  }

  const formData = await request.formData();

  return {
    isJson: false,
    name: String(formData.get("name") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    automation_request: String(
      formData.get("automation_request") || ""
    ).trim(),
  };
}

function successHtml() {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <title>Nexora - Request Received</title>

  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #000;
      color: white;
      font-family: Arial, Helvetica, sans-serif;
    }

    .card {
      width: min(92vw, 560px);
      border: 1px solid rgba(34, 211, 238, 0.25);
      border-radius: 28px;
      padding: 34px;
      box-sizing: border-box;

      background:
        radial-gradient(
          circle at top,
          rgba(34, 211, 238, 0.12),
          transparent 40%
        ),
        rgba(255, 255, 255, 0.035);

      box-shadow:
        0 0 90px rgba(34, 211, 238, 0.16);

      text-align: center;
    }

    .tick {
      width: 76px;
      height: 76px;

      display: grid;
      place-items: center;

      margin: 0 auto 22px;

      border-radius: 999px;

      background: rgba(34, 211, 238, 0.1);

      border:
        1px solid rgba(34, 211, 238, 0.28);

      color: #67e8f9;

      font-size: 38px;

      box-shadow:
        0 0 60px rgba(34, 211, 238, 0.2);
    }

    h1 {
      margin: 0;

      font-size:
        clamp(32px, 8vw, 54px);

      line-height: 0.95;

      letter-spacing: -0.05em;
    }

    p {
      margin: 18px auto 0;

      max-width: 420px;

      color:
        rgba(209, 213, 219, 0.78);

      line-height: 1.6;
    }

    a {
      display: inline-block;

      margin-top: 28px;

      padding: 13px 20px;

      border-radius: 999px;

      color: #cffafe;

      text-decoration: none;

      background:
        rgba(34, 211, 238, 0.1);

      border:
        1px solid rgba(34, 211, 238, 0.28);
    }
  </style>
</head>

<body>
  <main class="card">

    <div class="tick">
      ✓
    </div>

    <h1>
      Request received.
    </h1>

    <p>
      Your enquiry has been submitted to Nexora.
      We will review your automation requirements
      and get in touch.
    </p>

    <a href="/">
      Return to Nexora
    </a>

  </main>
</body>
</html>
`;
}

function errorHtml(message: string) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <title>Nexora - Submission Error</title>

  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #000;
      color: white;
      font-family: Arial, Helvetica, sans-serif;
    }

    .card {
      width: min(92vw, 560px);

      border:
        1px solid rgba(248, 113, 113, 0.3);

      border-radius: 28px;

      padding: 34px;

      box-sizing: border-box;

      background:
        rgba(255, 255, 255, 0.035);

      text-align: center;
    }

    h1 {
      margin: 0;
      font-size: 38px;
    }

    p {
      color:
        rgba(209, 213, 219, 0.8);

      line-height: 1.6;
    }

    a {
      display: inline-block;

      margin-top: 24px;

      color: #fecaca;
    }
  </style>
</head>

<body>

  <main class="card">

    <h1>
      Could not submit.
    </h1>

    <p>
      ${htmlEscape(message)}
    </p>

    <a href="/#demo-form">
      Go back to the form
    </a>

  </main>

</body>
</html>
`;
}

export async function POST(request: Request) {
  let isJson = false;

  try {
    const payload = await readLeadPayload(request);

    isJson = payload.isJson;

    const {
      name,
      company,
      email,
      phone,
      automation_request,
    } = payload;

    if (
      !name ||
      !company ||
      !email ||
      !automation_request
    ) {
      if (isJson) {
        return NextResponse.json(
          {
            error: "Missing required fields",
          },
          {
            status: 400,
          }
        );
      }

      return new Response(
        errorHtml(
          "Please complete all required fields."
        ),
        {
          status: 400,

          headers: {
            "Content-Type":
              "text/html; charset=utf-8",
          },
        }
      );
    }

    // CREATE LEAD

    const {
      data: leadData,
      error: leadError,
    } = await supabaseAdmin
      .from("nexora_leads")
      .insert({
        name,
        company,
        email,

        phone:
          phone || null,

        automation_request,

        status: "new",

        source: "website",
      })
      .select("id")
      .single();

    if (leadError) {
      throw leadError;
    }

    // CREATE CRM CONTACT

    const {
      data: contactData,
      error: contactError,
    } = await supabaseAdmin
      .from("crm_contacts")
      .insert({
        lead_id: leadData.id,

        name,
        company,
        email,

        phone:
          phone || null,

        source: "website",
      })
      .select("id")
      .single();

    if (contactError) {
      throw contactError;
    }

    // CREATE OPPORTUNITY

    const {
      data: opportunityData,
      error: opportunityError,
    } = await supabaseAdmin
      .from("crm_opportunities")
      .insert({
        contact_id:
          contactData.id,

        lead_id:
          leadData.id,

        title:
          `${company} - Automation Enquiry`,

        stage:
          "New Lead",

        status:
          "open",
      })
      .select("id")
      .single();

    if (opportunityError) {
      throw opportunityError;
    }

    // CREATE FOLLOW-UP TASK

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const {
      error: taskError,
    } = await supabaseAdmin
      .from("crm_tasks")
      .insert({
        contact_id:
          contactData.id,

        opportunity_id:
          opportunityData.id,

        title:
          `Follow up with ${name} from ${company}`,

        due_at:
          tomorrow.toISOString(),

        status:
          "todo",
      });

    if (taskError) {
      throw taskError;
    }

    // SEND EMAIL NOTIFICATION

    await resend.emails.send({
      from:
        "Nexora Website <onboarding@resend.dev>",

      to:
        process.env.NEXORA_NOTIFY_EMAIL!,

      subject:
        `New Nexora Lead - ${company}`,

      html: `
        <h2>
          New Nexora demo request
        </h2>

        <p>
          <strong>Name:</strong>
          ${htmlEscape(name)}
        </p>

        <p>
          <strong>Company:</strong>
          ${htmlEscape(company)}
        </p>

        <p>
          <strong>Email:</strong>
          ${htmlEscape(email)}
        </p>

        <p>
          <strong>Phone:</strong>
          ${htmlEscape(
            phone || "Not provided"
          )}
        </p>

        <p>
          <strong>
            Automation request:
          </strong>
        </p>

        <p>
          ${htmlEscape(
            automation_request
          )}
        </p>
      `,
    });

    // JSON RESPONSE FOR FETCH REQUESTS

    if (isJson) {
      return NextResponse.json({
        success: true,

        lead_id:
          leadData.id,

        contact_id:
          contactData.id,

        opportunity_id:
          opportunityData.id,
      });
    }

    // HTML RESPONSE FOR NATIVE MOBILE FORM

    return new Response(
      successHtml(),
      {
        status: 200,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error(
      "Lead workflow failed:",
      error
    );

    if (isJson) {
      return NextResponse.json(
        {
          error:
            "Lead workflow failed",
        },
        {
          status: 500,
        }
      );
    }

    return new Response(
      errorHtml(
        "The lead workflow failed. Check your terminal for the real error message."
      ),
      {
        status: 500,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",
        },
      }
    );
  }
}