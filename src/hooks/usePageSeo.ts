import { useEffect } from "react";
import { setPageSeo, type PageSeoOptions } from "@/lib/seo";

export const usePageSeo = (options: PageSeoOptions) => {
  useEffect(() => {
    setPageSeo(options);
  }, [
    options.title,
    options.description,
    options.path,
    options.image,
    options.type,
    options.noindex,
    JSON.stringify(options.jsonLd),
  ]);
};
