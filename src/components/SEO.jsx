import { useEffect } from "react";

export default function SEO({
  title = "Tristan Cuartero | Systems Architect & Educator",
  description = "I design and build scalable systems, dashboards, and human-centered platforms.",
  image = "/og-image.jpg",
  url = "https://yourdomain.com",
}) {
  useEffect(() => {
    document.title = title;

    const meta = (name, content, property = false) => {
      let tag = document.querySelector(
        property
          ? `meta[property="${name}"]`
          : `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        property
          ? tag.setAttribute("property", name)
          : tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    meta("description", description);
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:image", image, true);
    meta("og:url", url, true);
    meta("og:type", "website", true);

    meta("twitter:card", "summary_large_image");
    meta("twitter:title", title);
    meta("twitter:description", description);
    meta("twitter:image", image);
  }, [title, description, image, url]);

  return null;
}
