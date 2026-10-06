"use client";

import { useRef, useState } from "react";
import type { SurfaceDecor } from "../data/surfaces";
import { surfaceCopy } from "../data/surfaces";
import type { Locale } from "../i18n/config";
import { QuoteForm } from "./QuoteForm";

export function SurfaceCatalogue({ decors, productName, locale }: { decors: SurfaceDecor[]; productName: string; locale: Locale }) {
  const copy = surfaceCopy[locale];
  const [group, setGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(12);
  const [preview, setPreview] = useState<SurfaceDecor | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const groups = Array.from(new Set(decors.map((decor) => decor.group)));
  const filtered = decors.filter((decor) => (group === "all" || decor.group === group) && decor.name.toLowerCase().includes(search.trim().toLowerCase()));
  const visible = filtered.slice(0, limit);
  const label = (key: string) => copy.groupLabels[key as keyof typeof copy.groupLabels] ?? key;
  const requestLink = (decor: SurfaceDecor) => {
    const subject = `${copy.sampleSubject} — ${productName} — ${decor.name}`;
    const body = `${copy.sampleGreeting}\n${productName}\n${decor.name}\n${label(decor.group)}\n${copy.page}: ${decor.page}\n\n${copy.sampleDetails}`;
    return `mailto:sales@boreviax.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const reset = () => { setGroup("all"); setSearch(""); setLimit(12); };

  return (
    <>
      <section className="section surface-catalogue" id="decors">
        <div className="shell">
          <div className="section-heading-row" data-reveal>
            <div><p className="eyebrow">{copy.decorEyebrow}</p><h2 className="section-title">{copy.decorTitle}</h2></div>
            <p>{copy.decorIntro}</p>
          </div>
          <div className="decor-controls">
            <div className="decor-filters" aria-label={copy.all}>
              {["all", ...groups].map((key) => <button key={key} type="button" aria-pressed={group === key} onClick={() => { setGroup(key); setLimit(12); }}>{key === "all" ? copy.all : label(key)}</button>)}
            </div>
            <label className="decor-search"><span>{copy.search}</span><input type="search" value={search} placeholder={copy.searchPlaceholder} onChange={(event) => { setSearch(event.target.value); setLimit(12); }} /></label>
          </div>
          <p className="decor-count" role="status">{copy.showing} {visible.length} {copy.of} {filtered.length} {copy.decors}</p>
          {visible.length ? (
            <div className="decor-grid">
              {visible.map((decor) => (
                <article className="decor-card" key={decor.id}>
                  <button className="decor-image-button" type="button" aria-label={`${copy.open}: ${decor.name}`} onClick={() => { setPreview(decor); dialog.current?.showModal(); }}>
                    <img src={decor.image} alt={`${decor.name} — ${productName}`} width={decor.width} height={decor.height} loading="lazy" />
                    <span aria-hidden="true">＋</span>
                  </button>
                  <div className="decor-card-copy"><p>{label(decor.group)}</p><h3><bdi dir="ltr">{decor.name}</bdi></h3><a className="text-link" href={requestLink(decor)}>{copy.sample} <span aria-hidden="true">↗</span></a></div>
                </article>
              ))}
            </div>
          ) : <div className="decor-empty"><p>{copy.noResults}</p><button type="button" className="button button-secondary" onClick={reset}>{copy.reset}</button></div>}
          {limit < filtered.length ? <div className="decor-more"><button className="button button-secondary" type="button" onClick={() => setLimit((current) => current + 12)}>{copy.more}</button></div> : null}
          <p className="decor-swatch-note">{copy.swatchNote}</p>
        </div>
      </section>

      <dialog className="decor-dialog" ref={dialog} aria-labelledby="decor-preview-title" dir={locale === "ar" ? "rtl" : "ltr"}>
        <button className="decor-dialog-close" type="button" aria-label={copy.close} onClick={() => dialog.current?.close()}>×</button>
        {preview ? <>
          <img src={preview.image} alt={`${preview.name} — ${productName}`} width={preview.width} height={preview.height} />
          <div className="decor-dialog-copy"><p className="eyebrow">{productName} · {label(preview.group)}</p><h2 id="decor-preview-title"><bdi dir="ltr">{preview.name}</bdi></h2><p>{copy.page} {preview.page}</p><p>{copy.swatchNote}</p><a className="button button-primary" href={requestLink(preview)}>{copy.sample}</a></div>
        </> : <h2 id="decor-preview-title">{copy.open}</h2>}
      </dialog>

      <section className="section product-quote" id="quote" data-reveal>
        <div className="shell quote-layout"><div className="quote-copy"><p className="eyebrow">{copy.quoteEyebrow}</p><h2 className="section-title">{copy.quoteTitle}</h2><p>{copy.quoteIntro}</p></div><QuoteForm defaultProduct={productName} locale={locale} productOptions={decors.map((decor) => `${productName} — ${decor.name}`)} /></div>
      </section>
    </>
  );
}
