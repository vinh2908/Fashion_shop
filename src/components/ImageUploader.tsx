"use client";

import { DragEvent, ChangeEvent, useRef, useState } from "react";
import { compressImageFile, formatFileSize } from "@/lib/imageCompressor";

const SAMPLE_IMAGES = [
  { name: "Thiết bị nhà bếp", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80" },
  { name: "Thiết bị làm sạch", url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80" },
  { name: "Dụng cụ nhà bếp", url: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80" },
];

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  multiple?: boolean;
  onGalleryChange?: (images: string[]) => void;
  gallery?: string[];
  required?: boolean;
}

/** URL/file uploader that keeps the existing URL workflow and adds local image compression. */
export default function ImageUploader({
  value,
  onChange,
  label = "Ảnh sản phẩm",
  multiple = false,
  onGalleryChange,
  gallery = [],
  required = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"file" | "url" | "samples">("file");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; originalSize: number; compressedSize: number } | null>(null);

  const processFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      setError("Vui lòng chọn tệp JPG, PNG, WebP, AVIF hoặc GIF.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const results = await Promise.all(imageFiles.map((file) => compressImageFile(file)));
      const images = results.map((result) => result.dataUrl);
      onChange(images[0]);
      setFileInfo({
        name: results[0].fileName,
        originalSize: results[0].originalSize,
        compressedSize: results[0].compressedSize,
      });
      if (multiple && onGalleryChange) {
        const nextGallery = Array.from(new Set([...(gallery || []), ...images]));
        onGalleryChange(nextGallery);
      }
    } catch (processingError) {
      setError(processingError instanceof Error ? processingError.message : "Không thể xử lý ảnh.");
    } finally {
      setBusy(false);
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) void processFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void processFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <label className="block font-bold text-slate-700 uppercase">{label} {required ? "*" : ""}</label>
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-[11px] font-bold">
        <button type="button" onClick={() => setTab("file")} className={`flex-1 rounded-lg px-2 py-2 ${tab === "file" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}>📂 Tải từ máy</button>
        <button type="button" onClick={() => setTab("url")} className={`flex-1 rounded-lg px-2 py-2 ${tab === "url" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}>🔗 Dán URL</button>
        <button type="button" onClick={() => setTab("samples")} className={`flex-1 rounded-lg px-2 py-2 ${tab === "samples" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}>✨ Ảnh mẫu</button>
      </div>

      {tab === "file" && (
        <div
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-4 text-center transition ${dragging ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
        >
          <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleInput} className="hidden" />
          <button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700" disabled={busy}>
            {busy ? "Đang nén ảnh..." : "Duyệt ảnh từ thư mục máy tính"}
          </button>
          <p className="mt-2 text-[11px] text-slate-400">Hoặc kéo thả ảnh vào khu vực này</p>
          {fileInfo && <p className="mt-1 text-[11px] text-emerald-600">{fileInfo.name}: {formatFileSize(fileInfo.originalSize)} → {formatFileSize(fileInfo.compressedSize)}</p>}
        </div>
      )}

      {tab === "url" && (
        <input type="url" value={value} required={required} onChange={(event) => onChange(event.target.value)} placeholder="https://images.unsplash.com/..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:border-rose-500 focus:bg-white focus:outline-none" />
      )}

      {tab === "samples" && (
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button type="button" key={sample.url} onClick={() => onChange(sample.url)} className={`overflow-hidden rounded-xl border-2 ${value === sample.url ? "border-rose-500" : "border-transparent"}`} title={sample.name}>
              <img src={sample.url} alt={sample.name} className="h-16 w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
      {value && <img src={value} alt="Xem trước" className="h-24 w-24 rounded-xl border border-slate-200 object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
      {multiple && gallery.length > 1 && <p className="text-[11px] text-slate-500">Đã chọn {gallery.length} ảnh trong album.</p>}
    </div>
  );
}
