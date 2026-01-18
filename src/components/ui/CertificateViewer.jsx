export default function CertificateViewer({ title, src, type = "image" }) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      {type === "image" ? (
        <img
          src={src}
          alt={title}
          className="w-full rounded-xl ring-1 ring-black/10"
        />
      ) : (
        <iframe
          src={src}
          className="w-full h-[70vh] rounded-xl ring-1 ring-black/10"
          title={title}
        />
      )}
    </div>
  );
}
