import { useState, useRef } from 'react';
import { uploadApi } from '@/api';
import { Button, Spinner } from '@/components/ui';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images autorisees`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} depasse 10MB`);
        continue;
      }

      try {
        const result = await uploadApi.uploadImage(file);
        newUrls.push(result.url);
      } catch (error) {
        toast.error(`Erreur upload ${file.name}`);
        console.error('Upload error:', error);
      }
    }

    if (newUrls.length > 0) {
      onImagesChange([...images, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploadee(s)`);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (url: string) => {
    try {
      const key = url.split('/').pop();
      if (key) {
        await uploadApi.delete(key);
      }
      onImagesChange(images.filter((img) => img !== url));
      toast.success('Image supprimee');
    } catch (error) {
      console.error('Delete error:', error);
      onImagesChange(images.filter((img) => img !== url));
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  onClick={() => handleRemove(url)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && !disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Upload en cours...
            </>
          ) : (
            <>
              <span className="mr-2">📷</span>
              Ajouter des photos ({images.length}/{maxImages})
            </>
          )}
        </Button>
      )}
    </div>
  );
}
