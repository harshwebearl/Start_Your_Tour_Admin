import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "BASE_URL";

export default function BlogPage() {
  const [bloggers, setBloggers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("sytAdmin");

    const loadBloggers = async () => {
      try {
        setIsLoading(true);
        const resp = await fetch(`${BASE_URL}api/blogger`, {
          method: "GET",
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
        });

        if (!resp.ok) {
          throw new Error(`Bloggers fetch failed: ${resp.status}`);
        }

        const json = await resp.json();
        const data = json?.data ?? (Array.isArray(json) ? json : [json]);

        if (!mounted) return;
        setBloggers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err);
        console.error("Failed to load bloggers:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadBloggers();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  // helper inside component
  const isUrl = (s) => {
    if (!s || typeof s !== "string") return false;
    try {
      const u = new URL(s);
      return ["http:", "https:", "data:"].includes(u.protocol) || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(s);
    } catch {
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(s);
    }
  };

  const looksLikeHtml = (s) => typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s);

  const stripTags = (s) => (typeof s === "string" ? s.replace(/<\/?[^>]+(>|$)/g, "") : s);

  // base URL to prepend for relative image paths
  const IMG_BASE = "https://start-your-tour-harsh.onrender.com/images/blogger_content/";

  const getImageSrc = (media) => {
    if (!media) return "";
    if (looksLikeHtml(media)) return media;
    if (/^(https?:|data:)/i.test(media)) return media;
    return `${IMG_BASE}${String(media).replace(/^\/+/, "")}`;
  };

  const handleEdit = (id) => {
    // open edit page (adjust route as needed)
    navigate(`/blogger/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this blog? This cannot be undone.");
    if (!ok) return;
    try {
      const token = localStorage.getItem("sytAdmin");
      const resp = await fetch(`${BASE_URL}api/blogger/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        throw new Error(`Delete failed: ${resp.status}`);
      }
      // remove locally
      setBloggers((prev) => prev.filter((b) => (b.id ?? b._id) !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 28,
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          alignItems: "start",
        }}
      >
        {bloggers.map((b, i) => {
          const media = b?.image_1 ?? "";
          const headlineText = b?.headline ?? "headline";
          const imageSrc = getImageSrc(media);
          const id = b.id ?? b._id ?? i;

          return (
            <div
              key={id}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 14,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 10px 30px rgba(20,30,50,0.08)",
                border: "1px solid rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* image area (bigger) */}
              <div
                style={{
                  width: "100%",
                  height: 480,
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {looksLikeHtml(media) ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: 18,
                      boxSizing: "border-box",
                      overflow: "auto",
                      background: "#fff",
                    }}
                    dangerouslySetInnerHTML={{ __html: media }}
                  />
                ) : isUrl(imageSrc) ? (
                  <img
                    src={imageSrc}
                    alt={stripTags(headlineText)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9aa0a6",
                      fontSize: 16,
                      padding: 12,
                      textAlign: "center",
                    }}
                  >
                    No image available
                  </div>
                )}
              </div>

              {/* headline area */}
              <div
                style={{
                  padding: "18px 20px",
                  borderTop: "1px solid #f0f0f0",
                  background: "#fafafa",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                  Headline:
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    color: "#0f172a",
                    lineHeight: "1.2",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={stripTags(headlineText)}
                >
                  {stripTags(headlineText)}
                </h3>
              </div>

              {/* actions */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 16px 20px",
                  justifyContent: "flex-end",
                  background: "#fff",
                }}
              >
                <button
                  onClick={() => handleEdit(id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #2b6cb0",
                    background: "#3182ce",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(220,38,38,0.15)",
                    background: "#fff",
                    color: "#dc2638",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}