"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { compressImageFile, formatFileSize } from "@/lib/imageCompressor";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 8;
const SAMPLE_IMAGES = [
  { name: "Thiết bị nhà bếp", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80" },
  { name: "Thiết bị làm sạch", url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80" },
  { name: "Dụng cụ nhà bếp", url: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80" },
  { name: "Thiết bị tiện ích", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80" },
  { name: "Máy hút bụi", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80" },
  { name: "Máy xay sinh tố", url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80" },
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

function normalizeGallery(images: string[] = []) {
  return Array.from(new Set(images.filter(Boolean))).slice(0, MAX_GALLERY_IMAGES);
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

  const updateGallery = (images: string[]) => {
    if (!onGalleryChange) return;
    onGalleryChange(normalizeGallery(images));
  };

  const processFiles = async (files: FileList | File[]) => {
    const selected = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!selected.length) {
      setError("Vui lòng chọn tệp JPG, PNG, WebP, AVIF hoặc GIF.");
      return;
    }

    const invalid = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (invalid) {
      setError(`Ảnh "${invalid.name}" vượt quá giới hạn 10 MB.`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const results = await Promise.all(selected.map((file) => compressImageFile(file)));
      const images = results.map((result) => result.dataUrl);
      const nextImage = images[0] ?? value;
      const nextGallery = normalizeGallery([...gallery, ...images]);

      onChange(nextImage);
      setFileInfo({
        name: results[0].fileName,
        originalSize: results[0].originalSize,
        compressedSize: results[0].compressedSize,
      });

      if (onGalleryChange) {
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

  const removeImage = (image: string) => {
    if (image === value) onChange("");
    updateGallery((gallery || []).filter((item) => item !== image));
  };

  const selectSample = (url: string) => {
    const nextGallery = normalizeGallery([...(gallery || []), url]);
    onChange(url);
    updateGallery(nextGallery);
    setError("");
  };

  return (
    <div className="space-y-2">
      <label className="block font-bold uppercase text-slate-700">{label} {required ? "*" : ""}</label>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-[11px] font-bold">
        <button type="button" onClick={() => setTab("file")} className={`flex-1 rounded-lg px-2 py-2 ${tab === "file" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}>
          📂 Tải từ máy
        </button>
        <button type="button" onClick={() => setTab("url")} className={`flex-1 rounded-lg px-2 py-2 ${tab === "url" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}>
          🔗 Dán URL
        </button>
        <button type="button" onClick={() => setTab("samples")} className={`flex-1 rounded-lg px-2 py-2 ${tab === "samples" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}>
          ✨ Ảnh mẫu
        </button>
      </div>

      {tab === "file" && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-4 text-center transition ${dragging ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
        >
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple={multiple} onChange={handleInput} className="hidden" />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60">
            {busy ? "Đang nén ảnh..." : multiple ? "Chọn ảnh chính / ảnh phụ" : "Duyệt ảnh từ thư mục máy tính"}
          </button>
          <p className="mt-2 text-[11px] text-slate-400">Kéo thả ảnh vào đây • Tối đa 10 MB/ảnh</p>
          {fileInfo && (
            <p className="mt-1 text-[11px] text-emerald-600">
              {fileInfo.name}: {formatFileSize(fileInfo.originalSize)} → {formatFileSize(fileInfo.compressedSize)}
            </p>
          )}
        </div>
      )}

      {tab === "url" && (
        <input
          type="url"
          value={value}
          required={required}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue);
            if (nextValue) {
              updateGallery(normalizeGallery([...(gallery || []), nextValue]));
            }
            setError("");
          }}
          placeholder="https://images.unsplash.com/..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white"
        />
      )}

      {tab === "samples" && (
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              type="button"
              key={sample.url}
              onClick={() => selectSample(sample.url)}
              className={`overflow-hidden rounded-xl border-2 ${value === sample.url ? "border-rose-500" : "border-transparent"}`}
              title={sample.name}
            >
              <img src={sample.url} alt={sample.name} className="h-16 w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}

      {value && (
        <div className="flex items-start gap-2">
          <div className="relative">
            <img
              src={value}
              alt="Xem trước"
              className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <button
              type="button"
              onClick={() => removeImage(value)}
              className="absolute -right-2 -top-2 rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white"
              aria-label="Xóa ảnh"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {multiple && gallery.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {gallery.map((image) => (
            <div key={`${image}-${Math.random()}`} className="relative">
              <img src={image} alt="Ảnh phụ" className="h-16 w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-1 top-1 rounded-full bg-slate-900/70 px-1 text-[10px] text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
