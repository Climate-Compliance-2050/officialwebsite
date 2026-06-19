"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/content/site";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dark hero pages get a transparent navbar until scroll
  const overDark = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // clear any pending dropdown-close timer if we unmount mid-hover
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // close menus on route change (adjust-state-during-render pattern)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overDark
          ? "bg-transparent"
          : "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(15,28,46,0.08)]"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        <Link href="/" aria-label="C2050 home" className="flex items-center">
          <Image
            src={overDark ? "/brand/logo-horizontal-white.webp" : "/brand/logo-horizontal.webp"}
            alt={`${site.legalName} logo`}
            width={140}
            height={37}
            priority
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {nav.links.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => openMenu(link.label)}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-expanded={openDropdown === link.label}
                aria-haspopup="true"
                onClick={() =>
                  setOpenDropdown(openDropdown === link.label ? null : link.label)
                }
                className={`nav-underline flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  overDark
                    ? "text-white/85 hover:text-white"
                    : "text-navy-800 hover:text-blue-600"
                }`}
              >
                {link.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openDropdown === link.label ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {openDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 top-full w-80 pt-2"
                  >
                    <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-white p-2 shadow-xl shadow-navy-900/10">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-4 py-3 transition-colors hover:bg-green-50"
                        >
                          <span className="block text-sm font-semibold text-navy-900">
                            {child.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-navy-900/60">
                            {child.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link
            href={nav.cta.href}
            className="btn-sheen ml-3 rounded-sm bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]"
          >
            {nav.cta.label}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg lg:hidden ${
            overDark && !mobileOpen ? "text-white" : "text-navy-900"
          }`}
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-navy-900/10 bg-white lg:hidden"
          >
            <div className="space-y-4 px-4 py-6">
              {nav.links.map((link) => (
                <div key={link.label}>
                  <span className="block px-2 text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                    {link.label}
                  </span>
                  <div className="mt-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-2 py-2.5 text-base font-medium text-navy-900 hover:bg-green-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link
                href={nav.cta.href}
                className="block rounded-sm bg-green-500 px-5 py-3 text-center text-base font-semibold text-white"
              >
                {nav.cta.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
