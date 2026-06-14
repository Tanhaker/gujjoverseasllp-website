"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Loader2, TrendingUp, Users, Eye, MessageSquare } from "lucide-react";

const COLORS = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c'];

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryViews, setCategoryViews] = useState<any[]>([]);
  const [categoryInquiries, setCategoryInquiries] = useState<any[]>([]);
  const [sourceInquiries, setSourceInquiries] = useState<any[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Top 10 viewed products
    const { data: topProds } = await supabase
      .from('products')
      .select('name, view_count')
      .order('view_count', { ascending: false })
      .limit(10);
      
    if (topProds) setTopProducts(topProds);

    // 2. Views per category
    const { data: catViews } = await supabase
      .from('products')
      .select('categories(name), view_count');
      
    if (catViews) {
      const aggViews: Record<string, number> = {};
      catViews.forEach(p => {
        const catName = (p.categories as any)?.name || 'Uncategorized';
        aggViews[catName] = (aggViews[catName] || 0) + (p.view_count || 0);
      });
      setCategoryViews(Object.entries(aggViews).map(([name, value]) => ({ name, value })).filter(i => i.value > 0));
    }

    // 3. Inquiries
    const { data: inquiries } = await supabase.from('inquiries').select('category, source');
    if (inquiries) {
      // by category
      const aggInqCat: Record<string, number> = {};
      // by source
      const aggInqSrc: Record<string, number> = {};
      
      inquiries.forEach(i => {
        const c = i.category || 'Unknown';
        const s = i.source || 'Unknown';
        aggInqCat[c] = (aggInqCat[c] || 0) + 1;
        aggInqSrc[s] = (aggInqSrc[s] || 0) + 1;
      });
      
      setCategoryInquiries(Object.entries(aggInqCat).map(([name, value]) => ({ name, value })));
      setSourceInquiries(Object.entries(aggInqSrc).map(([name, value]) => ({ name, value })));
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Product Views</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {topProducts.reduce((a, b) => a + (b.view_count || 0), 0)}+
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
               <Eye className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Inquiries</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {sourceInquiries.reduce((a, b) => a + b.value, 0)}
              </h3>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
               <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Products */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top 10 Most Viewed Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Bar dataKey="view_count" fill="#2ecc71" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Views by Category */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Views by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryViews}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {categoryViews.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inquiries by Category */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Inquiries per Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryInquiries} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 12}} angle={-45} textAnchor="end" />
                <YAxis />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Bar dataKey="value" fill="#3498db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inquiries by Source */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Inquiries by Source</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceInquiries}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {sourceInquiries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
