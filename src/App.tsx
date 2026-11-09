import { useEffect, useLayoutEffect } from "react";
import { blocks, footer } from "./content";
import { ReadingProgress } from "./components/ReadingProgress";

// Text is independent of composition; every original block is rendered once.
function Copy({
  from,
  index,
  className = "",
}: {
  from: string;
  index: number;
  className?: string;
}) {
  return (
    <div
      data-copy-source={from}
      data-copy-index={index}
      className={`copy-block ${className}`}
    >
      {blocks[from][index]}
    </div>
  );
}
export default function App() {
  useLayoutEffect(() => {
    window.dispatchEvent(new Event("richmarketing:ready"));
  }, []);
  useEffect(() => {
    const first = document.querySelector(".product-overview")!;
    const last = document.querySelector(".application .consult-link")!;
    const update = () => {
      const a = first.getBoundingClientRect(),
        b = last.getBoundingClientRect();
      document.documentElement.classList.toggle(
        "has-floating-cta",
        a.bottom < 64 && !(b.top < innerHeight && b.bottom > 0),
      );
    };
    const observer = new IntersectionObserver(update, { threshold: [0, 1] });
    observer.observe(first);
    observer.observe(last);
    update();
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-floating-cta");
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <ReadingProgress />
      <Copy from="intro" index={0} className="header-shell" />
      <main id="main">
        <section id="intro" className="product-overview">
          <div className="container">
            <div className="product-cover">
              <div className="cover-copy">
                <Copy from="pricing" index={0} />
                <Copy from="pricing" index={1} />
              </div>
              <Copy from="intro" index={1} className="cover-art" />
              <div className="cover-wordmark" aria-hidden="true">
                RICH MARKETING
              </div>
            </div>
            <div className="product-summary">
              <div className="product-summary__info">
                <Copy from="pricing" index={3} />
                <Copy from="consult" index={4} />
              </div>
              <div className="product-summary__action">
                <Copy from="consult" index={6} />
                <Copy from="consult" index={7} />
              </div>
            </div>
          </div>
        </section>
        <nav className="chapter-nav" aria-label="페이지 내용">
          <a href="#patent">특허출원 기술</a>
          <a href="#deliverables">결과물 예시</a>
          <a href="#process">진행 과정</a>
          <a href="#pricing">서비스 비용</a>
        </nav>
        <section id="market" className="chapter market-chapter">
          <div className="container">
            <div className="market-opening">
              <div className="market-question">
                <span className="chapter-number" aria-hidden="true">
                  01 /
                </span>
                <Copy from="problem" index={0} />
              </div>
              <div className="market-evidence">
                <Copy from="intro" index={2} />
                <Copy from="intro" index={3} />
                <Copy from="intro" index={4} />
                <Copy from="intro" index={5} />
              </div>
            </div>
            <div className="market-context">
              <Copy from="problem" index={1} />
              <Copy from="problem" index={2} />
            </div>
            <Copy from="intro" index={6} className="market-turn" />
          </div>
        </section>
        <section id="patent" className="chapter proof-chapter">
          <div className="container">
            <div className="proof-heading">
              <span className="chapter-number" aria-hidden="true">
                02 /
              </span>
              <Copy from="patent" index={0} />
              <Copy from="patent" index={1} />
            </div>
            <div id="deliverables" className="proof-workspace">
              <Copy from="deliverables" index={0} className="module-label" />
              <Copy from="deliverables" index={1} />
            </div>
            <div className="proof-gallery">
              <Copy from="patent" index={2} />
              <Copy from="patent" index={3} />
            </div>
          </div>
        </section>
        <section id="impact" className="chapter impact-chapter">
          <div className="container">
            <div className="impact-opening">
              <div>
                <span className="chapter-number" aria-hidden="true">
                  03 /
                </span>
                <Copy from="perception" index={0} />
                <Copy from="perception" index={1} />
              </div>
              <Copy from="perception" index={2} />
            </div>
            <Copy from="perception" index={3} className="impact-conclusion" />
            <div id="reactions" className="reaction-module">
              <Copy from="reactions" index={0} />
              <Copy from="reactions" index={1} />
              <Copy from="reactions" index={2} />
            </div>
          </div>
        </section>
        <section id="examples" className="chapter campaign-chapter">
          <div className="container">
            <div className="campaign-layout">
              <div className="campaign-story">
                <span className="chapter-number" aria-hidden="true">
                  04 /
                </span>
                <Copy from="examples" index={0} />
                <Copy from="examples" index={1} />
              </div>
              <Copy from="examples" index={2} />
            </div>
            <div id="results" className="results-module">
              <div className="results-heading">
                <Copy from="results" index={0} />
                <Copy from="results" index={3} />
              </div>
              <Copy from="results" index={1} />
              <Copy from="results" index={2} />
              <div className="results-ribbon">
                <Copy from="results" index={4} />
                <Copy from="results" index={5} />
              </div>
            </div>
          </div>
        </section>
        <section id="process" className="chapter process-chapter">
          <div className="container">
            <div id="expertise" className="expertise-banner">
              <Copy from="expertise" index={0} />
              <div>
                <Copy from="expertise" index={1} />
                <Copy from="expertise" index={2} />
                <Copy from="expertise" index={3} />
              </div>
            </div>
            <div className="process-layout">
              <div className="process-heading">
                <span className="chapter-number" aria-hidden="true">
                  05 /
                </span>
                <Copy from="process" index={0} />
                <Copy from="process" index={1} />
              </div>
              <Copy from="process" index={2} />
            </div>
          </div>
        </section>
        <section id="consult" className="chapter consult-chapter">
          <div className="container">
            <div className="consult-layout">
              <div className="consult-copy">
                <span className="chapter-number" aria-hidden="true">
                  06 /
                </span>
                <Copy from="consult" index={0} />
                <Copy from="consult" index={1} />
                <Copy from="consult" index={3} />
              </div>
              <Copy from="consult" index={2} />
            </div>
            <div id="eligibility" className="eligibility-layout">
              <Copy from="eligibility" index={0} />
              <div>
                <Copy from="eligibility" index={1} />
                <Copy from="consult" index={5} />
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="chapter offer-chapter">
          <div className="container">
            <div className="offer-layout">
              <div>
                <span className="chapter-number" aria-hidden="true">
                  07 /
                </span>
                <Copy from="eligibility" index={2} />
              </div>
              <Copy from="pricing" index={2} />
            </div>
            <Copy from="pricing" index={4} className="offer-legal" />
            <div id="apply" className="application">
              <Copy from="apply" index={0} />
              <Copy from="apply" index={1} />
              <Copy from="apply" index={2} />
              <Copy from="apply" index={3} />
              <Copy from="apply" index={4} />
            </div>
          </div>
        </section>
      </main>
      <div data-copy-source="footer" data-copy-index="0">
        {footer}
      </div>
    </>
  );
}
