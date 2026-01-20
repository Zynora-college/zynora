import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { HeroTagline } from '../../types';

interface EditTaglinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  taglines: HeroTagline[];
  onSuccess: () => void;
}

export const EditTaglinesModal: React.FC<EditTaglinesModalProps> = ({ isOpen, onClose, taglines, onSuccess }) => {
  const [formData, setFormData] = useState<HeroTagline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Clone taglines to form data
    setFormData(taglines.map(t => ({ ...t })));
  }, [taglines]);

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

  const handleTaglineChange = (index: number, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], tagline_text: value };
    setFormData(updated);
  };

  const handleAddTagline = () => {
    const newTagline: HeroTagline = {
      id: `tagline-new-${Date.now()}`,
      tagline_text: '',
      order: formData.length + 1,
      is_active: true,
    };
    setFormData([...formData, newTagline]);
  };

  const handleRemoveTagline = (index: number) => {
    if (formData.length <= 1) {
      setError('You must have at least one tagline');
      return;
    }
    const updated = formData.filter((_, i) => i !== index);
    // Update order numbers
    updated.forEach((item, i) => {
      item.order = i + 1;
    });
    setFormData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const emptyTaglines = formData.filter(t => !t.tagline_text.trim());
    if (emptyTaglines.length > 0) {
      setError('All taglines must have text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get existing taglines to determine what to insert/update/delete
      const { data: existingTaglines } = await supabase
        .from('hero_taglines')
        .select('id');

      const existingIds = new Set((existingTaglines || []).map(t => t.id));
      const formIds = new Set(formData.map(t => t.id));

      // Find taglines to delete (existing but not in form)
      const toDelete = [...existingIds].filter(id => !formIds.has(id) && !id.startsWith('tagline-new-'));

      // Delete removed taglines
      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('hero_taglines')
          .delete()
          .in('id', toDelete);
        
        if (deleteError) throw deleteError;
      }

      // Upsert all taglines
      for (let i = 0; i < formData.length; i++) {
        const tagline = formData[i];
        const isNew = tagline.id.startsWith('tagline-new-');
        
        if (isNew) {
          // Insert new tagline with generated ID
          const newId = `tagline-${Date.now()}-${i}`;
          const { error: insertError } = await supabase
            .from('hero_taglines')
            .insert({
              id: newId,
              tagline_text: tagline.tagline_text.trim(),
              order: i + 1,
              is_active: true,
            });
          
          if (insertError) throw insertError;
        } else {
          // Update existing tagline
          const { error: updateError } = await supabase
            .from('hero_taglines')
            .update({
              tagline_text: tagline.tagline_text.trim(),
              order: i + 1,
              is_active: tagline.is_active,
              updated_at: new Date().toISOString(),
            })
            .eq('id', tagline.id);
          
          if (updateError) throw updateError;
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update taglines');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-auto max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-100 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Hero Taglines</h2>
              <p className="text-sm text-gray-500 mt-1">Rotating phrases displayed in the hero section</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            {formData.map((tagline, index) => (
              <div key={tagline.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-gray-400 cursor-move">
                  <GripVertical size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">Tagline {index + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={tagline.tagline_text}
                    onChange={(e) => handleTaglineChange(index, e.target.value)}
                    placeholder="Enter tagline text..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    data-testid={`tagline-input-${index}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTagline(index)}
                  disabled={formData.length <= 1}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid={`tagline-delete-${index}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddTagline}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors border-2 border-dashed border-gray-300"
            data-testid="tagline-add-btn"
          >
            <Plus size={18} />
            Add New Tagline
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
              data-testid="tagline-save-btn"
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
