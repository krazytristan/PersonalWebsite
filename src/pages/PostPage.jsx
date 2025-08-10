import { useParams, Link } from "react-router-dom";

export default function PostPage() {
  const { slug } = useParams();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-4">
          {slug?.replace(/-/g, " ") || "Untitled Post"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 mt-3">
          This is a placeholder post page. Wire this up to your content source
          (MDX, CMS, JSON) when ready.
        </p>
      </div>
    </main>
  );
}
