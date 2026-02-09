import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils.ts";
import type {
  groupedNavbarParents,
  navbarParents,
  pages,
} from "./navigationConfig";

// We have to access these navbar configs via astro props because they are not available on the client side
export interface NavContentsProps {
  mobile?: boolean;
  groupedNavbarParents: typeof groupedNavbarParents;
  navbarParents: typeof navbarParents;
  pages: typeof pages;
}

export function NavContents({
  mobile = false,
  groupedNavbarParents,
  navbarParents,
  pages,
}: NavContentsProps) {
  const [expanded, setExpanded] = useState<string | undefined>();

  const containerClass = cn(
    "flex flex-col",
    mobile ? "space-y-3 mb-6" : "space-y-1 mb-4 text-sm",
  );
  const buttonClass = cn(
    mobile ? "py-1.5 [--pad-inline:1.5rem]" : "py-1 [--pad-inline:0rem]",
    "ps-[calc(1rem*var(--depth)+var(--pad-inline))] pe-[var(--pad-inline)]",
  );
  const linkClass = "hover:underline";

  return (
    <>
      {navbarParents
        .map((i) => {
          return {
            navbarItem: i,
            title:
              pages.find((page) => page.slug === i.title.toLowerCase())
                ?.title ?? i.title,
          };
        })
        .map(({ navbarItem, title }) => (
          <div
            key={navbarItem.title}
            className={containerClass}
            style={{ "--depth": 0 } as CSSProperties}
          >
            <h4 className={cn(buttonClass, "py-0", "font-semibold")}>
              {title}
            </h4>

            <div className={"flex flex-col"}>
              {navbarItem.subcategories !== undefined &&
                navbarItem.subcategories.length > 0 && (
                  <div className={mobile ? "" : "text-sm"}>
                    {navbarItem.subcategories.map((c) => (
                      <div key={c}>
                        <button
                          type="button"
                          className={cn(
                            "collapsibleNav group flex flex-row w-full items-center gap-1 peer text-muted-foreground hover:underline cursor-pointer py-1",
                            buttonClass,
                          )}
                          data-state={c === expanded ? "open" : "closed"}
                          onClick={() =>
                            c === expanded
                              ? setExpanded(undefined)
                              : setExpanded(c)
                          }
                        >
                          <span className="flex-1 text-left">{c}</span>
                          <ChevronDownIcon className="group-data-[state=closed]:block hidden" />
                          <ChevronUpIcon className="group-data-[state=closed]:hidden" />
                        </button>
                        <div
                          className={cn(
                            "peer-data-[state=open]:grid hidden text-muted-foreground",
                          )}
                          style={{ "--depth": 1 } as CSSProperties}
                        >
                          {groupedNavbarParents[c]?.map((post) => (
                            <a
                              className={cn(linkClass, buttonClass)}
                              key={post.slug}
                              href={["/docs", post.slug].join("/")}
                            >
                              {post.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {groupedNavbarParents[navbarItem.title]?.map((page) => (
                <a
                  href={["/docs", page.slug].join("/")}
                  key={page.slug}
                  className={cn(
                    "text-muted-foreground",
                    linkClass,
                    buttonClass,
                  )}
                >
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}
