"use client";

import { FormEvent, MouseEvent, useState } from "react";

const whatsappContacts = [
  { label: "+86 158 6690 2023", value: "8615866902023" },
  { label: "+86 188 5393 8376", value: "8618853938376" },
  { label: "+86 135 8397 2961", value: "8613583972961" },
];

type QuoteDetails = {
  product: string;
  size: string;
  quantity: string;
  destination: string;
  application: string;
  requiredDate: string;
  contact: string;
  whatsapp: string;
};

const initialDetails: QuoteDetails = {
  product: "",
  size: "",
  quantity: "",
  destination: "",
  application: "",
  requiredDate: "",
  contact: "",
  whatsapp: whatsappContacts[0].value,
};

function buildMessage(details: QuoteDetails) {
  return [
    "Hello Boreviax, I would like a board-material quotation.",
    "",
    `Product: ${details.product}`,
    `Size / thickness: ${details.size}`,
    `Quantity: ${details.quantity}`,
    `Destination: ${details.destination}`,
    `Application / performance target: ${details.application}`,
    `Required date: ${details.requiredDate}`,
    `Contact name / company: ${details.contact}`,
  ].join("\n");
}

export function QuoteForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const [details, setDetails] = useState<QuoteDetails>({
    ...initialDetails,
    product: defaultProduct,
  });

  const update = (field: keyof QuoteDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const sendWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = encodeURIComponent(buildMessage(details));
    window.open(`https://wa.me/${details.whatsapp}?text=${message}`, "_blank");
  };

  const sendEmail = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (form && !form.reportValidity()) {
      return;
    }

    const subject = encodeURIComponent(
      `Board RFQ — ${details.product || "New enquiry"}`,
    );
    const body = encodeURIComponent(buildMessage(details));
    window.location.href = `mailto:sales@boreviax.com?subject=${subject}&body=${body}`;
  };

  return (
    <form className="quote-form" onSubmit={sendWhatsApp}>
      <div className="field-grid">
        <label>
          <span>Product / board type</span>
          <input
            value={details.product}
            onChange={(event) => update("product", event.target.value)}
            placeholder="e.g. Duraply"
            required
          />
        </label>
        <label>
          <span>Size / thickness</span>
          <input
            value={details.size}
            onChange={(event) => update("size", event.target.value)}
            placeholder="e.g. 1220 × 2440 × 18 mm"
            required
          />
        </label>
        <label>
          <span>Quantity</span>
          <input
            value={details.quantity}
            onChange={(event) => update("quantity", event.target.value)}
            placeholder="Sheets or containers"
            required
          />
        </label>
        <label>
          <span>Destination</span>
          <input
            value={details.destination}
            onChange={(event) => update("destination", event.target.value)}
            placeholder="City / port / country"
            required
          />
        </label>
        <label className="field-wide">
          <span>Application / performance target</span>
          <textarea
            value={details.application}
            onChange={(event) => update("application", event.target.value)}
            placeholder="Finish, emission, moisture, fire, structural or acoustic requirement"
            rows={4}
            required
          />
        </label>
        <label>
          <span>Required date</span>
          <input
            value={details.requiredDate}
            onChange={(event) => update("requiredDate", event.target.value)}
            placeholder="Target production or arrival date"
            required
          />
        </label>
        <label>
          <span>Name / company</span>
          <input
            value={details.contact}
            onChange={(event) => update("contact", event.target.value)}
            placeholder="How should we address you?"
            required
          />
        </label>
        <label className="field-wide">
          <span>Choose a WhatsApp contact</span>
          <select
            value={details.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
          >
            {whatsappContacts.map((contact) => (
              <option key={contact.value} value={contact.value}>
                {contact.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit">
          Send via WhatsApp
        </button>
        <button className="button button-secondary" type="button" onClick={sendEmail}>
          Send by email
        </button>
      </div>
      <p className="form-note">
        Your information is used only to prepare and respond to this enquiry.
      </p>
    </form>
  );
}
