"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { Search, Mail, MessageCircle, Filter, ChevronDown, CheckCircle, Clock, Archive, MoreHorizontal, MessageSquare } from "lucide-react";

interface Inquiry {
 id: string;
 customer_name: string;
 company_name: string;
 whatsapp_number: string;
 email: string;
 product_name: string;
 category: string;
 quantity: string;
 destination_country: string;
 message: string;
 source: 'chatbot' | 'contact_form' | 'direct';
 pipeline_stage: 'new' | 'contacted' | 'negotiating' | 'closed';
 status: 'new' | 'read' | 'replied' | 'archived';
 created_at: string;
}

export default function InquiriesList() {
 const [inquiries, setInquiries] = useState<Inquiry[]>([]);
 const [loading, setLoading] = useState(true);
 const [statusFilter, setStatusFilter] = useState('all');
 const [stageFilter, setStageFilter] = useState('all');
 
 const supabase = createClient();

 useEffect(() => {
 fetchInquiries();
 }, [statusFilter, stageFilter]);

 const fetchInquiries = async () => {
 setLoading(true);
 let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });
 
 if (statusFilter !== 'all') query = query.eq('status', statusFilter);
 if (stageFilter !== 'all') query = query.eq('pipeline_stage', stageFilter);

 const { data } = await query;
 if (data) setInquiries(data);
 setLoading(false);
 };

 const updateStatus = async (id: string, newStatus: string) => {
 await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
 fetchInquiries();
 };

 const updateStage = async (id: string, newStage: string) => {
 await supabase.from('inquiries').update({ pipeline_stage: newStage }).eq('id', id);
 fetchInquiries();
 };

 return (
 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
 
 {/* Filters Bar */}
 <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50 ">
 <div className="flex items-center gap-4">
 <div className="relative">
 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
 <input 
 type="text" 
 placeholder="Search inquiries..." 
 className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 "
 />
 </div>
 <div className="flex items-center gap-2">
 <Filter className="w-4 h-4 text-slate-500" />
 <select 
 value={statusFilter} 
 onChange={e => setStatusFilter(e.target.value)}
 className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 "
 >
 <option value="all">All Status</option>
 <option value="new">New</option>
 <option value="read">Read</option>
 <option value="replied">Replied</option>
 <option value="archived">Archived</option>
 </select>
 <select 
 value={stageFilter} 
 onChange={e => setStageFilter(e.target.value)}
 className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 "
 >
 <option value="all">All Pipeline Stages</option>
 <option value="new">New</option>
 <option value="contacted">Contacted</option>
 <option value="negotiating">Negotiating</option>
 <option value="closed">Closed</option>
 </select>
 </div>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 ">
 <thead className="text-xs text-slate-700 uppercase bg-slate-50 ">
 <tr>
 <th className="px-6 py-4 font-semibold">Date</th>
 <th className="px-6 py-4 font-semibold">Customer</th>
 <th className="px-6 py-4 font-semibold">Requirement</th>
 <th className="px-6 py-4 font-semibold">Stage</th>
 <th className="px-6 py-4 font-semibold">Status</th>
 <th className="px-6 py-4 font-semibold text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 ">
 {loading ? (
 <tr><td colSpan={6} className="px-6 py-12 text-center">Loading inquiries...</td></tr>
 ) : inquiries.length === 0 ? (
 <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No inquiries found matching criteria.</td></tr>
 ) : (
 inquiries.map(inq => (
 <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
 <td className="px-6 py-4 whitespace-nowrap">
 {format(new Date(inq.created_at), 'MMM dd, yyyy')}<br/>
 <span className="text-xs text-slate-400">{format(new Date(inq.created_at), 'hh:mm a')}</span>
 </td>
 <td className="px-6 py-4">
 <div className="font-medium text-slate-900 ">{inq.customer_name}</div>
 <div className="text-xs text-slate-500">{inq.destination_country} {inq.company_name ? `• ${inq.company_name}` : ''}</div>
 <div className="flex gap-2 mt-1">
 {inq.source === 'chatbot' ? (
 <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded"><MessageSquare className="w-3 h-3"/> Chatbot</span>
 ) : (
 <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded"><Mail className="w-3 h-3"/> Web Form</span>
 )}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="font-medium text-slate-900 ">{inq.product_name}</div>
 <div className="text-xs text-slate-500">{inq.category} • Qty: {inq.quantity || 'TBD'}</div>
 </td>
 <td className="px-6 py-4">
 <select 
 value={inq.pipeline_stage}
 onChange={(e) => updateStage(inq.id, e.target.value)}
 className="text-xs font-medium px-2 py-1 border border-slate-200 rounded bg-white cursor-pointer"
 >
 <option value="new">New</option>
 <option value="contacted">Contacted</option>
 <option value="negotiating">Negotiating</option>
 <option value="closed">Closed</option>
 </select>
 </td>
 <td className="px-6 py-4">
 {inq.status === 'new' && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">New</span>}
 {inq.status === 'read' && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700">Read</span>}
 {inq.status === 'replied' && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">Replied</span>}
 {inq.status === 'archived' && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">Archived</span>}
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <a 
 href={`https://wa.me/${inq.whatsapp_number.replace(/\D/g,'')}`}
 target="_blank" rel="noopener noreferrer"
 className="p-1.5 text-slate-400 hover:text-green-500 bg-slate-100 rounded-lg transition-colors"
 title="Reply via WhatsApp"
 >
 <MessageCircle className="w-4 h-4" />
 </a>
 <a 
 href={`mailto:${inq.email}`}
 className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100 rounded-lg transition-colors"
 title="Reply via Email"
 >
 <Mail className="w-4 h-4" />
 </a>
 <select 
 className="text-xs bg-slate-100 border-none rounded-lg p-1.5 text-slate-600 cursor-pointer w-24"
 value={inq.status}
 onChange={(e) => updateStatus(inq.id, e.target.value)}
 >
 <option value="new">Mark New</option>
 <option value="read">Mark Read</option>
 <option value="replied">Mark Replied</option>
 <option value="archived">Archive</option>
 </select>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}
