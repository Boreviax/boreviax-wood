"use client";

import { FormEvent, MouseEvent, useState } from "react";
import { quoteFormCopy, type Locale } from "../i18n/config";

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

function buildMessage(details: QuoteDetails, locale: Locale) {
  const copy = quoteFormCopy[locale];
  return [
    copy.greeting,
    "",
    `${copy.product}: ${details.product}`,
    `${copy.size}: ${details.size}`,
    `${copy.quantity}: ${details.quantity}`,
    `${copy.destination}: ${details.destination}`,
    `${copy.application}: ${details.application}`,
    `${copy.requiredDate}: ${details.requiredDate}`,
    `${copy.contact}: ${details.contact}`,
  ].join("\n");
}

export function QuoteForm({
  defaultProduct = "",
  locale = "en",
}: {
  defaultProduct?: string;
  locale?: Locale;
}) {
  const copy = quoteFormCopy[locale];
  const [details, setDetails] = useState<QuoteDetails>({
    ...initialDetails,
    product: defaultProduct,
  });

  const update = (field: keyof QuoteDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const sendWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = encodeURIComponent(buildMessage(details, locale));
    window.open(`https://wa.me/${details.whatsapp}?text=${message}`, "_blank");
  };

  const sendEmail = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (form && !form.reportValidity()) {
      return;
    }

    const subject = encodeURIComponent(
      `${copy.subject} — ${details.product || copy.newEnquiry}`,
    );
    const body = encodeURIComponent(buildMessage(details, locale));
    window.location.href = `mailto:sales@boreviax.com?subject=${subject}&body=${body}`;
  };

  return (
    <form className="quote-form" onSubmit={sendWhatsApp}>
      <div className="field-grid">
        <label>
          <span>{copy.product}</span>
          <input
            value={details.product}
            onChange={(event) => update("product", event.target.value)}
            placeholder={copy.productPlaceholder}
            required
          />
        </label>
        <label>
          <span>{copy.size}</span>
          <input
            value={details.size}
            onChange={(event) => update("size", event.target.value)}
            placeholder={copy.sizePlaceholder}
            required
          />
        </label>
        <label>
          <span>{copy.quantity}</span>
          <input
            value={details.quantity}
            onChange={(event) => update("quantity", event.target.value)}
            placeholder={copy.quantityPlaceholder}
            required
          />
        </label>
        <label>
          <span>{copy.destination}</span>
          <input
            value={details.destination}
            onChange={(event) => update("destination", event.target.value)}
            placeholder={copy.destinationPlaceholder}
            required
          />
        </label>
        <label className="field-wide">
          <span>{copy.application}</span>
          <textarea
            value={details.application}
            onChange={(event) => update("application", event.target.value)}
            placeholder={copy.applicationPlaceholder}
            rows={4}
            required
          />
        </label>
        <label>
          <span>{copy.requiredDate}</span>
          <input
            value={details.requiredDate}
            onChange={(event) => update("requiredDate", event.target.value)}
            placeholder={copy.requiredDatePlaceholder}
            required
          />
        </label>
        <label>
          <span>{copy.contact}</span>
          <input
            value={details.contact}
            onChange={(event) => update("contact", event.target.value)}
            placeholder={copy.contactPlaceholder}
            required
          />
        </label>
        <label className="field-wide">
          <span>{copy.chooseWhatsApp}</span>
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
          {copy.sendWhatsApp}
        </button>
        <button className="button button-secondary" type="button" onClick={sendEmail}>
          {copy.sendEmail}
        </button>
      </div>
      <p className="form-note">{copy.note}</p>
    </form>
  );
}
