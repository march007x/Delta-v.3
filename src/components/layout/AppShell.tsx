"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import { NAV, SITE } from "@/lib/site";
import { Icon, type IconName } from "./Icon";
import { DeltaMark } from "./DeltaMark";
import { ThemeToggle } from "./ThemeToggle";
import { SiteFooter } from "./SiteFooter";

/**
 * โครงหน้าจอของทั้งเว็บ
 *
 * มีสองโหมด:
 *  - หน้าแรก (/) ไม่มีแถบข้าง เพราะเป็นหน้าแนะนำตัวสำหรับคนที่ยังไม่รู้จักเว็บ
 *    การโยนเมนูเจ็ดอันใส่คนที่เพิ่งเปิดมาครั้งแรกไม่ได้ช่วยอะไร
 *  - หน้าที่เหลือเป็นโหมดแอป: แถบข้างถาวรบนจอใหญ่ · แถบล่างสี่ปุ่มบนมือถือ
 *    เพราะคนที่เข้ามาแล้วกำลัง "ใช้งาน" ไม่ได้กำลัง "อ่านโฆษณา"
 */
function Brand({ tone = "app" }: { tone?: "app" | "hero" }) {
  const hero = tone === "hero";
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <DeltaMark size={30} className={hero ? "text-hero-ink" : "text-ink"} />
      <span
        className={cx(
          "font-display text-[18px] font-medium tracking-[0.02em]",
          hero ? "text-hero-ink" : "text-ink",
        )}
      >
        {SITE.name.toUpperCase()}
      </span>
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/progress") return pathname === "/progress";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // ปิดเมนูมือถืออัตโนมัติเมื่อเปลี่ยนหน้า มิฉะนั้นมันจะค้างทับเนื้อหาที่เพิ่งเปิด
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ---------- หน้าแรก: ไม่มีแถบข้าง ----------
  if (pathname === "/") {
    return (
      <>
        <header className="on-hero absolute top-0 right-0 left-0 z-40">
          <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-6 py-4 sm:px-8">
            <Brand tone="hero" />
            <Link
              href="/progress"
              className="rounded-lg border border-hero-line px-4 py-2 text-[14px] font-medium text-hero-ink no-underline transition-colors hover:border-hero-ink-3"
            >
              เข้าใช้งาน
            </Link>
          </div>
        </header>
        <main id="main">{children}</main>
        <SiteFooter />
      </>
    );
  }

  // ---------- หน้าอื่น: โหมดแอป ----------
  return (
    <div className="flex min-h-screen">
      {/* แถบข้าง — จอ lg ขึ้นไป */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center px-5">
          <Brand />
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2" aria-label="เมนูหลัก">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] no-underline transition-colors",
                  active
                    ? "bg-surface-2 font-medium text-ink"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon name={item.icon as IconName} size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="border-t border-line px-5 py-4 font-mono text-[10.5px] tracking-wide text-ink-3">
          {SITE.author}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* แถบบน */}
        <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="เปิดเมนู"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-2 lg:hidden"
            >
              <Icon name="menu" size={17} />
            </button>

            <span className="lg:hidden">
              <Brand />
            </span>

            <Link
              href="/search"
              className="ml-auto flex min-w-0 items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-[14px] text-ink-3 no-underline hover:border-line-strong lg:mr-auto lg:ml-0 lg:w-full lg:max-w-md"
            >
              <Icon name="search" size={16} />
              <span className="hidden truncate lg:inline">ค้นหาบทเรียน สูตร หรือหัวข้อ…</span>
            </Link>

            <ThemeToggle />
          </div>
        </header>

        <main id="main" className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* แถบล่างมือถือ — สี่ปุ่มที่ใช้บ่อยที่สุด */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-line bg-surface lg:hidden"
        aria-label="เมนูด่วน"
      >
        {NAV.filter((n) => n.bar).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] no-underline",
                active ? "text-ink" : "text-ink-3",
              )}
            >
              <Icon name={item.icon as IconName} size={19} />
              {item.short}
            </Link>
          );
        })}
      </nav>

      {/* เมนูเต็มบนมือถือ */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/55"
          />
          <div className="absolute top-0 bottom-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-surface">
            <div className="flex h-16 items-center justify-between px-5">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="ปิดเมนู"
                className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-2"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2" aria-label="เมนูทั้งหมด">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] no-underline",
                      active ? "bg-surface-2 font-medium text-ink" : "text-ink-2",
                    )}
                  >
                    <Icon name={item.icon as IconName} size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <p className="border-t border-line px-5 py-4 font-mono text-[10.5px] text-ink-3">
              {SITE.author}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
