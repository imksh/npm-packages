"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  noIndex?: boolean;
}) => {
  const pathname = usePathname();

  useEffect(() => {
    // TITLE
    if (title) {
      document.title = title;
    }

    // DESCRIPTION
    if (description) {
      let meta = document.querySelector(
        "meta[name='description']",
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    // KEYWORDS (optional)
    if (keywords) {
      let meta = document.querySelector(
        "meta[name='keywords']",
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "keywords";
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }

    // CANONICAL
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }

    link.href =
      canonical ||
      `https://shreebaglamukhi.com${pathname}`;

    // ROBOTS
    let robots = document.querySelector(
      "meta[name='robots']",
    ) as HTMLMetaElement;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }

    robots.content = noIndex ? "noindex,nofollow" : "index,follow";
  }, [title, description, keywords, canonical, noIndex, pathname]);

  return null;
};

export default SEO;