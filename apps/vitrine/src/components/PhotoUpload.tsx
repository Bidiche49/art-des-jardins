'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface PhotoUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_FILES = 3;
const MAX_SIZE_MB = 5;
const ACCEPTED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];
const ACCEPTED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

// Thumbnail: 160px for retina, displayed at 80x80
const THUMB_SIZE = 160;

function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_MIME.includes(file.type)) return true;
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  return ACCEPTED_EXT.includes(ext);
}

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

/** Try loading a blob into an HTMLImageElement */
function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}

/** Draw an image source (HTMLImageElement or ImageBitmap) to a square JPEG thumbnail */
function cropToThumbnail(source: HTMLImageElement | ImageBitmap): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = THUMB_SIZE;
    canvas.height = THUMB_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error('Canvas not supported')); return; }

    const w = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
    const h = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

    // Center crop to square
    const minDim = Math.min(w, h);
    const sx = (w - minDim) / 2;
    const sy = (h - minDim) / 2;
    ctx.drawImage(source, sx, sy, minDim, minDim, 0, 0, THUMB_SIZE, THUMB_SIZE);

    if ('close' in source) source.close();

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(URL.createObjectURL(blob));
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/jpeg',
      0.75,
    );
  });
}

/**
 * Generate a thumbnail for any image file.
 *
 * Strategy 1: native Image loading → Canvas resize
 *   Works for JPG/PNG/WebP on all browsers, and HEIC on Safari.
 *
 * Strategy 2: HEIC → ImageBitmap via heic-to (no JPEG round-trip, faster)
 *   Only loaded when strategy 1 fails (Chrome/Firefox + HEIC).
 *
 * Strategy 3: raw objectURL fallback
 *   If Canvas is blocked (e.g. anti-fingerprint extensions), show the image as-is.
 */
async function generateThumbnail(file: File): Promise<string> {
  // Strategy 1: native load + canvas resize
  try {
    const img = await loadImage(file);
    return await cropToThumbnail(img);
  } catch {
    // Native load failed — likely HEIC on Chrome/Firefox, or canvas blocked
  }

  // Strategy 2: HEIC decode → ImageBitmap → canvas (skips JPEG encode/decode round-trip)
  try {
    const { heicTo } = await import('heic-to/next');
    const bitmap = await heicTo({ blob: file, type: 'bitmap' as const });
    return await cropToThumbnail(bitmap);
  } catch {
    // heic-to or canvas failed
  }

  // Strategy 3: raw objectURL (no resize, but at least shows the image)
  return URL.createObjectURL(file);
}

export function PhotoUpload({ files, onChange }: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const pendingRef = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate thumbnails for new files
  useEffect(() => {
    for (const file of files) {
      const key = fileKey(file);
      if (key in thumbnails || pendingRef.current.has(key)) continue;

      pendingRef.current.add(key);
      setGenerating((prev) => ({ ...prev, [key]: true }));

      generateThumbnail(file)
        .then((url) => {
          setThumbnails((prev) => ({ ...prev, [key]: url }));
        })
        .catch(() => {
          setThumbnails((prev) => ({ ...prev, [key]: null }));
        })
        .finally(() => {
          pendingRef.current.delete(key);
          setGenerating((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        });
    }
  }, [files, thumbnails]);

  // Cleanup objectURLs when files are removed
  useEffect(() => {
    const currentKeys = new Set(files.map(fileKey));
    setThumbnails((prev) => {
      let changed = false;
      const next: Record<string, string | null> = {};
      for (const [key, url] of Object.entries(prev)) {
        if (currentKeys.has(key)) {
          next[key] = url;
        } else {
          if (url) URL.revokeObjectURL(url);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [files]);

  // Cleanup all on unmount
  useEffect(() => {
    return () => {
      Object.values(thumbnails).forEach((url) => { if (url) URL.revokeObjectURL(url); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateAndAdd = useCallback(
    (newFiles: FileList | File[]) => {
      setError('');
      const toAdd: File[] = [];

      for (const file of Array.from(newFiles)) {
        if (files.length + toAdd.length >= MAX_FILES) {
          setError(`Maximum ${MAX_FILES} photos autorisées.`);
          break;
        }
        if (!isAcceptedFile(file)) {
          setError('Format accepté : JPG, PNG, WebP ou HEIC.');
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`Taille maximale : ${MAX_SIZE_MB} Mo par photo.`);
          continue;
        }
        toAdd.push(file);
      }

      if (toAdd.length > 0) {
        onChange([...files, ...toAdd]);
      }
    },
    [files, onChange]
  );

  const preventDefaults = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        validateAndAdd(e.dataTransfer.files);
      }
    },
    [validateAndAdd]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setError('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photos du projet <span className="text-gray-400">(optionnel, max {MAX_FILES})</span>
      </label>

      {files.length < MAX_FILES && (
        <div
          role="button"
          tabIndex={0}
          onDragEnter={(e) => {
            preventDefaults(e);
            setDragOver(true);
          }}
          onDragOver={(e) => {
            preventDefaults(e);
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            preventDefaults(e);
            setDragOver(false);
          }}
          onDrop={handleDrop}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClick();
          }}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <svg
            className="w-8 h-8 mx-auto text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-600">
            <span className="text-primary-600 font-medium">Cliquez</span> ou glissez-déposez vos photos
          </p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, HEIC — max {MAX_SIZE_MB} Mo</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndAdd(e.target.files);
          }
          e.target.value = '';
        }}
      />

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {files.length > 0 && (
        <div className="flex gap-3 mt-3">
          {files.map((file, i) => {
            const key = fileKey(file);
            const thumb = thumbnails[key];
            const isLoading = generating[key];

            return (
              <div key={key} className="relative group">
                {isLoading ? (
                  <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                ) : thumb ? (
                  <img
                    src={thumb}
                    alt={`Aperçu ${i + 1}`}
                    className="w-20 h-20 rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 text-center leading-tight px-1">Aperçu indisponible</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                  aria-label={`Supprimer photo ${i + 1}`}
                >
                  &times;
                </button>
                <p className="text-xs text-gray-400 mt-1 truncate w-20">{file.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
