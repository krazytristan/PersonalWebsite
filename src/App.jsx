import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollReset from "./components/ScrollReset";

// Lazy load pages
const Portfolio = lazy(() => import("./portfolio/Portfolio.jsx"));
const BlogList = lazy(() => import("./pages/BlogList.jsx"));
const PostPage = lazy(() => import("./pages/PostPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

export default function App() {
  return (
    <>
      {/* Ensures correct scroll position on route change */}
      <ScrollReset />

      <Suspense
        fallback={
          <div className="min-h-screen grid place-items-center bg-brand-bg text-brand-text">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
              <div className="text-xs font-mono tracking-widest text-brand-muted uppercase">
                Loading Architecture...
              </div>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
