"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { contactPage } from "@/content/about";

/**
 * Static-export-friendly contact form. If FORM_ENDPOINT is set (e.g. a
 * Formspree URL), submits via fetch; otherwise falls back to a prefilled
 * mailto draft. Swap in the real endpoint once hosting is decided.
 */
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "contact@c2050.com";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const { form } = contactPage;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let message = "";
    if (!value.trim()) message = "This field is required.";
    else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      message = "Enter a valid email address, e.g. you@company.com.";
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const fields = ["name", "email", "organization", "message"];
    const allValid = fields
      .map((f) => validateField(f, String(data.get(f) ?? "")))
      .every(Boolean);
    if (!allValid) {
      const firstInvalid = formEl.querySelector<HTMLElement>("[aria-invalid='true'], input, textarea");
      firstInvalid?.focus();
      return;
    }

    if (FORM_ENDPOINT) {
      try {
        setStatus("sending");
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        setStatus(res.ok ? "sent" : "error");
        if (res.ok) formEl.reset();
      } catch {
        setStatus("error");
      }
    } else {
      const subject = encodeURIComponent(`[C2050 website] ${data.get("interest")}`);
      const body = encodeURIComponent(
        `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nOrganization: ${data.get("organization")}\nInterest: ${data.get("interest")}\n\n${data.get("message")}`,
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }
  };

  const inputCls = (field: string) =>
    `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-900/35 transition-colors focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 ${
      errors[field] ? "border-red-500" : "border-navy-900/15"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-navy-900">
            {form.name.label} <span className="text-red-600" aria-hidden>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={form.name.placeholder}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            onBlur={(e) => validateField("name", e.target.value)}
            className={inputCls("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-900">
            {form.email.label} <span className="text-red-600" aria-hidden>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={form.email.placeholder}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            onBlur={(e) => validateField("email", e.target.value)}
            className={inputCls("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-navy-900">
          {form.organization.label} <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          required
          autoComplete="organization"
          placeholder={form.organization.placeholder}
          aria-invalid={!!errors.organization}
          aria-describedby={errors.organization ? "organization-error" : undefined}
          onBlur={(e) => validateField("organization", e.target.value)}
          className={inputCls("organization")}
        />
        {errors.organization && (
          <p id="organization-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.organization}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-navy-900">
          {form.interest.label}
        </label>
        <select id="interest" name="interest" className={inputCls("interest")}>
          {form.interest.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-900">
          {form.message.label} <span className="text-red-600" aria-hidden>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={form.message.placeholder}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          onBlur={(e) => validateField("message", e.target.value)}
          className={inputCls("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-sheen inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-green-500 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.99] disabled:cursor-default disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden />
        {status === "sending" ? "Sending…" : form.submit}
      </button>

      <p aria-live="polite" className="text-sm">
        {status === "sent" && (
          <span className="font-medium text-green-700">
            Thank you! Your message is on its way. We respond within two business days.
          </span>
        )}
        {status === "error" && (
          <span className="font-medium text-red-600">
            Something went wrong sending your message. Please retry, or email us directly at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </span>
        )}
      </p>
    </form>
  );
}
