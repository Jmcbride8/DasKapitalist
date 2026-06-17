import React, { useState, useRef, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Upload, Loader2 } from 'lucide-react';

const imageCache = {};

export default function AdminImage({ imageKey, defaultSrc, className, style, alt, ...rest }) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        if (imageCache[imageKey]) {
            setImageUrl(imageCache[imageKey]);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const records = await base44.entities.LandingImage.filter({ image_key: imageKey });
                const url = records?.[0]?.image_url || null;
                if (!cancelled) {
                    imageCache[imageKey] = url;
                    setImageUrl(url);
                }
            } catch {
                if (!cancelled) setImageUrl(null);
            }
        })();
        return () => { cancelled = true; };
    }, [imageKey]);

    const handleUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            const records = await base44.entities.LandingImage.filter({ image_key: imageKey });
            if (records?.[0]) {
                await base44.entities.LandingImage.update(records[0].id, { image_url: file_url });
            } else {
                await base44.entities.LandingImage.create({ image_key: imageKey, image_url: file_url });
            }
            imageCache[imageKey] = file_url;
            setImageUrl(file_url);
        } finally {
            setUploading(false);
        }
    }, [imageKey]);

    const displayUrl = imageUrl || defaultSrc;
    if (!displayUrl) return null;

    return (
        <div
            className={className}
            style={{
                ...style,
                position: 'relative',
                ...(rest.onLoad || rest.onError ? {} : { backgroundImage: `url(${displayUrl})` }),
            }}
            onMouseEnter={() => isAdmin && setShowUpload(true)}
            onMouseLeave={() => setShowUpload(false)}
        >
            {rest.onLoad || rest.onError ? (
                <img src={displayUrl} alt={alt || ''} {...rest} />
            ) : null}
            {isAdmin && showUpload && (
                <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute top-3 right-3 z-30 flex items-center gap-2 px-3 py-2 bg-black/70 border border-white/30 rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:bg-black/90 hover:border-white/50 transition-all backdrop-blur-sm"
                    disabled={uploading}
                    title="Replace image"
                >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploading ? 'Uploading...' : 'Replace'}
                </button>
            )}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
            />
        </div>
    );
}