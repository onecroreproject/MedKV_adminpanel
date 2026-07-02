import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, Package } from 'lucide-react';

const mockPlans = [
  { id: 'PLAN-01', name: 'Monthly Plan', price: '$99', duration: '1 Month', features: ['Access to Basic Courses', 'Standard Support', 'Monthly Quiz Access'] },
  { id: 'PLAN-02', name: 'Quarterly Plan', price: '$249', duration: '3 Months', features: ['Access to All Courses', 'Priority Support', 'Quarterly Mock Exams', 'Downloadable Resources'] },
  { id: 'PLAN-03', name: 'Annual Premium', price: '$899', duration: '12 Months', features: ['Full Platform Access', '1-on-1 Mentorship', 'All Mock Exams', 'Live Case Discussions', 'Certificate Generation'] },
];

export default function SubscriptionPlans() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/subscriptions')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Subscription Plans</h1>
            <p className="text-sm text-text-muted mt-1">Manage pricing tiers and membership access levels.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30">
            <Plus className="w-4 h-4 text-brand-accent" /> Add New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:border-brand-primary/30 transition-colors">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-1">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-brand-primary">{plan.price}</span>
                <span className="text-sm text-gray-500 mb-1">/ {plan.duration}</span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Features Included</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="flex items-center justify-center p-2 border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
