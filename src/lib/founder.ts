import { useState, useEffect } from 'react';

const DEFAULT_FOUNDER_PHOTO = '/founder-garvit-ankit.svg';

export function useFounderPhoto() {
  const [photo, setPhoto] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('haven-founder-photo') || DEFAULT_FOUNDER_PHOTO;
    }
    return DEFAULT_FOUNDER_PHOTO;
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (typeof window !== 'undefined') {
        setPhoto(localStorage.getItem('haven-founder-photo') || DEFAULT_FOUNDER_PHOTO);
      }
    };

    window.addEventListener('haven-founder-photo-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('haven-founder-photo-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateFounderPhoto = (newPhoto: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('haven-founder-photo', newPhoto);
      window.dispatchEvent(new Event('haven-founder-photo-updated'));
      setPhoto(newPhoto);
    }
  };

  const resetFounderPhoto = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('haven-founder-photo');
      window.dispatchEvent(new Event('haven-founder-photo-updated'));
      setPhoto(DEFAULT_FOUNDER_PHOTO);
    }
  };

  return { photo, updateFounderPhoto, resetFounderPhoto };
}
