import { Routes, Route } from "react-router-dom";
import Portfolio from "./portfolio/Portfolio.jsx";
import BlogList from "./pages/BlogList.jsx"; // optional page
// import PostPage from "./pages/PostPage.jsx"; // if you have it

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/blog" element={<BlogList />} />
      {/* <Route path="/blog/:slug" element={<PostPage />} /> */}
      <Route path="*" element={<Portfolio />} />
    </Routes>
  );
}
