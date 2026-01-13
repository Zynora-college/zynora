import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EditAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  about: { id: string; paragraphs: string[] };
  onSuccess: () => void;
}

export const EditAboutModal: React.FC<EditAboutModalProps> = ({ isOpen, onClose, about, onSuccess }) => {
  const [paragraphs, setParagraphs] = useState<string[]>(about.paragraphs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setParagraphs(about.paragraphs);
  }, [about]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('about_content')
        .update({
          paragraphs: paragraphs.filter(p => p.trim() !== ''),
          updated_at: new Date().toISOString(),
        })
        .eq('id', about.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update about content');
    } finally {
      setIsLoading(false);
    }
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (index: number) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const updateParagraph = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Edit About Content</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                  Paragraph {index + 1}
                </label>
                {paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter paragraph text..."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addParagraph}
            className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-green-200"
          >
            <Plus size={16} />
            Add Paragraph
          </button>

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
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
