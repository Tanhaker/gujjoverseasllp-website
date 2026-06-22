"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Pencil, Trash2, Plus, GripVertical, Check, X, Leaf, Scissors, Palette, Diamond, Flame, Sofa, Boxes } from "lucide-react";

interface Category {
 id: string;
 name: string;
 slug: string;
 description: string;
 icon: string;
 color: string;
 is_visible: boolean;
 display_order: number;
 product_count?: number;
}

const ICONS = [
 { name: 'plant-2', component: <Leaf className="w-5 h-5" /> },
 { name: 'scissors', component: <Scissors className="w-5 h-5" /> },
 { name: 'palette', component: <Palette className="w-5 h-5" /> },
 { name: 'diamond', component: <Diamond className="w-5 h-5" /> },
 { name: 'flame', component: <Flame className="w-5 h-5" /> },
 { name: 'sofa', component: <Sofa className="w-5 h-5" /> },
 { name: 'boxes', component: <Boxes className="w-5 h-5" /> },
];

const COLORS = [
 '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#34495e', '#16a085', '#d35400'
];

export default function CategoriesManager() {
 const [categories, setCategories] = useState<Category[]>([]);
 const [loading, setLoading] = useState(true);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [isAdding, setIsAdding] = useState(false);
 const [formData, setFormData] = useState<Partial<Category>>({});
 
 const supabase = createClient();

 useEffect(() => {
 fetchCategories();
 }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data: cats, error } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error("Fetch categories error:", error);
      alert("Error fetching categories: " + error.message + ". Did you run the SQL migration?");
    }
    
    if (cats) {
      setCategories(cats.map((c: any) => ({
        ...c,
        product_count: c.products?.[0]?.count || 0
      })));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Name is required");

    // Auto-generate slug if new
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const payload = {
      name: formData.name,
      slug,
      description: formData.description || '',
      icon: formData.icon || 'plant-2',
      color: formData.color || '#2ecc71',
      is_visible: formData.is_visible !== false,
      display_order: formData.display_order || categories.length + 1
    };

    if (editingId) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
      if (error) { alert("Error updating: " + error.message); return; }
    } else {
      const { error } = await supabase.from('categories').insert([payload]);
      if (error) { alert("Error adding: " + error.message); return; }
    }

    setEditingId(null);
    setIsAdding(false);
    fetchCategories();
  };

  const handleDelete = async (id: string, count: number) => {
    if (count > 0) {
      alert(`Cannot delete category with ${count} active products. Reassign or delete the products first.`);
      return;
    }
    if (confirm("Are you sure you want to delete this category?")) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) { alert("Error deleting: " + error.message); return; }
      fetchCategories();
    }
  };

  const startEdit = (cat: Category) => {
    setFormData(cat);
    setEditingId(cat.id);
    setIsAdding(false);
  };

  const startAdd = () => {
    setFormData({
      icon: 'plant-2',
      color: '#2ecc71',
      is_visible: true,
      display_order: categories.length + 1
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase.from('categories').update({ is_visible: !current }).eq('id', id);
    if (error) { alert("Error updating visibility: " + error.message); return; }
    fetchCategories();
  };

 if (loading) return <div className="text-slate-500">Loading categories...</div>;

 return (
 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
 
 {/* Header */}
 <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 ">
 <h2 className="text-xl font-bold text-slate-800 ">Product Categories</h2>
 {!isAdding && !editingId && (
 <button 
 onClick={startAdd}
 className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
 >
 <Plus className="w-4 h-4" /> Add Category
 </button>
 )}
 </div>

 <div className="p-6">
        {(isAdding || editingId) && (
          <div className="bg-slate-50 p-6 rounded-xl border border-brand-200 mb-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900">{isAdding ? 'Add New Category' : 'Edit Category'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input 
                  type="text" 
                  value={formData.slug || ''} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  placeholder="Auto-generated if empty"
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input 
                  type="text" 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map(i => (
                    <button 
                      key={i.name}
                      onClick={() => setFormData({...formData, icon: i.name})}
                      className={`p-2 rounded-lg border ${formData.icon === i.name ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {i.component}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Color Accent</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button 
                      key={c}
                      onClick={() => setFormData({...formData, color: c})}
                      className={`w-8 h-8 rounded-full shadow-sm ring-2 ring-offset-2 ${formData.color === c ? 'ring-slate-400' : 'ring-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Category
              </button>
            </div>
          </div>
        )}

 <div className="space-y-3">
 {categories.map((cat) => (
 <div 
 key={cat.id} 
 className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${!cat.is_visible ? 'border-dashed border-slate-300 opacity-60' : 'border-slate-200 bg-white hover:border-brand-300 '}`}
 >
 <div className="text-slate-400 cursor-grab hover:text-slate-600 ">
 <GripVertical className="w-5 h-5" />
 </div>
 
 <div 
 className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-inner"
 style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
 >
 {ICONS.find(i => i.name === cat.icon)?.component || <Leaf className="w-6 h-6" />}
 </div>
 
 <div className="flex-grow">
 <div className="flex items-center gap-2">
 <h4 className="font-bold text-slate-900 ">{cat.name}</h4>
 {!cat.is_visible && <span className="text-[10px] uppercase bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-500">Hidden</span>}
 </div>
 <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
 <span>/{cat.slug}</span>
 <span className="flex items-center gap-1"><Boxes className="w-3.5 h-3.5" /> {cat.product_count} products</span>
 </div>
 </div>
 
 <div className="flex items-center gap-2">
 <button 
 onClick={() => toggleVisibility(cat.id, cat.is_visible)}
 className="px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 "
 >
 {cat.is_visible ? 'Hide' : 'Show'}
 </button>
 <button 
 onClick={() => startEdit(cat)}
 className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
 >
 <Pencil className="w-5 h-5" />
 </button>
 <button 
 onClick={() => handleDelete(cat.id, cat.product_count || 0)}
 className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
 >
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 </div>
 ))}
 {categories.length === 0 && !loading && (
 <div className="text-center py-12 text-slate-500">No categories found. Create one above.</div>
 )}
 </div>
 </div>
 </div>
 );
}
