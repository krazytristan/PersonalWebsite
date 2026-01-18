import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ScrollToTop from "./components/ScrollToTop";

// Lazy load pages
const Portfolio = lazy(() => import("./portfolio/Portfolio.jsx"));
const BlogList = lazy(() => import("./pages/BlogList.jsx"));
// const PostPage = lazy(() => import("./pages/PostPage.jsx"));

export default function App() {
  return (
    <>
      {/* Ensures correct scroll position on route change */}
      <ScrollToTop />

      <Suspense
        fallback={
          <div className="min-h-screen grid place-items-center bg-brand-bg text-brand-text">
            <div className="animate-pulse text-sm opacity-70">
              Loading…
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blog" element={<BlogList />} />
          {/* <Route path="/blog/:slug" element={<PostPage />} /> */}
          <Route path="*" element={<Portfolio />} />
        </Routes>
      </Suspense>
    </>
  );
}
