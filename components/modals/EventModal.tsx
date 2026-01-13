import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStorageOperations } from '../../hooks/useSupabaseData';
import type { EventCard } from '../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: EventCard;
  onSuccess: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, onSuccess }) => {
  const isEdit = !!event;
  const { uploadToStorage, deleteFromStorage } = useStorageOperations();
  const [formData, setFormData] = useState<Omit<EventCard, 'id'> & { id?: string }>({
    title: '',
    description: '',
    image: '',
    day: 1,
    vibe: 'action',
    google_forms: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData(event);
      setFile(null);
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        day: 1,
        vibe: 'action',
        google_forms: '',
      });
      setFile(null);
    }
  }, [event, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let imageUrl = formData.image;

      // Upload new image if file is selected
      if (file) {
        // If editing and has old image, delete it from storage
        if (isEdit && formData.image) {
          try {
            await deleteFromStorage('event-posters', formData.image);
          } catch (err) {
            console.warn('Failed to delete old image:', err);
          }
        }

        // Upload new image
        imageUrl = await uploadToStorage('event-posters', file);
      }

      // Validate that we have an image URL
      if (!imageUrl) {
        throw new Error('Please upload an event poster image');
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('events')
          .update({
            title: formData.title,
            description: formData.description,
            image: imageUrl,
            day: formData.day,
            vibe: formData.vibe,
            google_forms: formData.google_forms || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', event.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('events').insert({
          id: formData.title.toLowerCase().replace(/\s+/g, '-'),
          title: formData.title,
          description: formData.description,
          image: imageUrl,
          day: formData.day,
          vibe: formData.vibe,
          google_forms: formData.google_forms || null,
        });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-auto max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Add'} Event</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Poster Image {isEdit && !file && '(Current image will be kept)'}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              required={!isEdit}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <Upload size={14} />
                Selected: {file.name}
              </p>
            )}
            {isEdit && !file && formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Current poster" className="h-20 rounded border border-gray-200" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Forms Link (Optional)</label>
            <input
              type="url"
              value={formData.google_forms || ''}
              onChange={(e) => setFormData({ ...formData, google_forms: e.target.value })}
              placeholder="https://forms.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              data-testid="event-google-forms-input"
            />
            <p className="text-xs text-gray-500 mt-1">Add a Google Forms link for event registration</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) as 1 | 2 })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value={1}>Day 1</option>
                <option value={2}>Day 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vibe</label>
              <select
                value={formData.vibe}
                onChange={(e) => setFormData({ ...formData, vibe: e.target.value as EventCard['vibe'] })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="thriller">Thriller</option>
                <option value="fantasy">Fantasy</option>
                <option value="action">Action</option>
                <option value="horror">Horror</option>
                <option value="adventure">Adventure</option>
                <option value="crime">Crime</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Add Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
