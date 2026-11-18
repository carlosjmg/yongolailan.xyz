import type { MerchItem } from "@prisma/client";
import { MerchGallery } from "@/components/site/Merch";

/**
 * The closing block of the Havanece page: the limited-edition vinyl, taken from
 * the Merch list (photos, description, price and order link all come from
 * there, so editing the item in the admin updates this page too).
 */
export default function VinylSection({ item }: { item: MerchItem }) {
  const images = [item.image, item.image2, item.image3, item.image4].filter((x): x is string => Boolean(x));
  // "$$33" is a typo-prone field: show a single dollar sign.
  const price = (item.price || "").trim().replace(/^\$+/, "$");

  return (
    <section className="jad-vinyl" aria-label="Limited edition vinyl">
      <div className="jad-eyebrow">Limited edition vinyl</div>
      {images.length > 0 ? (
        <div className="jad-vinyl-photos">
          <MerchGallery images={images} alt={item.title} />
        </div>
      ) : null}
      <h2 className="jad-vinyl-title">{item.title.replace(/\s*[•·]\s*/g, " · ").replace(/\s+/g, " ").trim()}</h2>
      {item.description ? <p className="jad-vinyl-desc">{item.description}</p> : null}
      {price ? <div className="jad-vinyl-price">{price}</div> : null}
      {item.linkUrl ? (
        <a className="jad-cta" href={item.linkUrl} target="_blank" rel="noopener noreferrer">
          Order the vinyl
        </a>
      ) : null}
    </section>
  );
}
