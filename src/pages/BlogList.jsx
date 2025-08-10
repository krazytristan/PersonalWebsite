import BlogSection from "../components/BlogSection.jsx";

export default function BlogList() {
  return (
    <div className="py-20">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
          Blog <span className="text-indigo-600 dark:text-indigo-400">Posts</span>
        </h1>
        <BlogSection />
      </div>
    </div>
  );
}
