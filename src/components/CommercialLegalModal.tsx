/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS V11.0.0 — Commercial & Legal Center
 * Covers: Enterprise Pricing Tiers, SLA (99.99%), MSA, Privacy, DPA, and Token Calculator.
 */

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Check, 
  Sparkles, 
  Zap, 
  Building2, 
  Lock, 
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { FlashGlowCard } from './FlashGlowCard';

interface CommercialLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (tierId: string) => void;
}

export const CommercialLegalModal: React.FC<CommercialLegalModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'agreements' | 'calculator'>('pricing');
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<'msa' | 'sla' | 'privacy' | 'dpa'>('sla');
  const [calcTokens, setCalcTokens] = useState<number>(500000);
  const [calcModel, setCalcModel] = useState<'gemini-flash' | 'gemini-pro' | 'claude-sonnet' | 'deepseek-r1'>('gemini-flash');

  if (!isOpen) return null;

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Builder Starter',
      price: '$0',
      period: 'Forever free',
      description: 'Ideal for prototyping micro-apps and individual smart contract experiments.',
      features: [
        '500 Free AI Credits / mo',
        'Standard Gemini 2.5 Flash',
        '3 Concurrent Miniapp Deploys',
        'Community Discord Support',
        'Standard Rate Limits'
      ],
      cta: 'Current Tier',
      highlighted: false,
      variant: 'purple' as const
    },
    {
      id: 'pro',
      name: 'Professional Team',
      price: '$49',
      period: 'per seat / month',
      description: 'Production-ready agent pipeline for autonomous software teams.',
      features: [
        '15,000 High-Speed AI Credits / mo',
        'Claude 3.7 + Gemini 2.5 Pro Access',
        'Unlimited App Repositories & Forking',
        'Automated GitHub Actions CI/CD',
        'Base L2 Smart Escrow Integration',
        'Priority Ticket Queue'
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
      variant: 'orange' as const
    },
    {
      id: 'enterprise_elite',
      name: 'Enterprise Elite',
      price: '$499',
      period: 'per organization / month',
      description: 'Mission-critical autonomous software factory with dedicated security gates.',
      features: [
        '100,000 High-Capacity Credits / mo',
        'All 17 Autonomous Agents Orchestrated',
        '99.99% Financial Uptime SLA',
        'Multi-Tenant RBAC & Custom Roles',
        'Super Admin Console (gxqstudio@gmail.com)',
        'Zero Data Egress Guarantee',
        'Dedicated Solutions Architect'
      ],
      cta: 'Deploy Enterprise Elite',
      highlighted: false,
      variant: 'green' as const
    },
    {
      id: 'sovereign',
      name: 'Sovereign On-Prem',
      price: '$4,999',
      period: 'annually billed',
      description: 'Air-gapped deployment with local Ollama / Qwen models on your infrastructure.',
      features: [
        'Local Hardware Acceleration (Ollama)',
        '100% On-Premises Data Sovereignty',
        'Custom Fine-Tuning Adapters',
        'Continuous Vulnerability Monitoring',
        '24/7 Dedicated Incident Commander'
      ],
      cta: 'Contact Architecture Team',
      highlighted: false,
      variant: 'cyan' as const
    }
  ];

  const modelRates: Record<string, { name: string; ratePer1k: number }> = {
    'gemini-flash': { name: 'Gemini 2.5 Flash', ratePer1k: 0.0003 },
    'gemini-pro': { name: 'Gemini 2.5 Pro', ratePer1k: 0.005 },
    'claude-sonnet': { name: 'Claude 3.7 Sonnet', ratePer1k: 0.015 },
    'deepseek-r1': { name: 'DeepSeek R1', ratePer1k: 0.00219 }
  };

  const calculatedCostUsd = ((calcTokens / 1000) * modelRates[calcModel].ratePer1k).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0B1019] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#121927]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Master Gods Commercial & Legal Center
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  V11.0.0 Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">Production Agreements, Transparent Billing & Enterprise SLA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-800/80 bg-[#0B1019]">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'pricing'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Enterprise Pricing Tiers
          </button>
          <button
            onClick={() => setActiveTab('agreements')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'agreements'
                ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            SLA & Legal Agreements
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Token Credit Estimator
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-xl font-bold text-white">Transparent, Autonomous Scale</h3>
                <p className="text-xs text-slate-400">Zero hidden surcharges. Predictable token usage backed by automated failover.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pricingTiers.map((tier) => (
                  <FlashGlowCard
                    key={tier.id}
                    variant={tier.variant}
                    intensity={tier.highlighted ? 'high' : 'medium'}
                    className={`p-5 flex flex-col justify-between ${tier.highlighted ? 'ring-1 ring-orange-500/50' : ''}`}
                  >
                    <div className="space-y-4">
                      {tier.highlighted && (
                        <div className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Most Popular
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold text-white">{tier.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tier.description}</p>
                      </div>

                      <div className="pt-2">
                        <div className="text-3xl font-extrabold text-white tracking-tight">{tier.price}</div>
                        <div className="text-[11px] text-slate-500">{tier.period}</div>
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-slate-800">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onSelectPlan && onSelectPlan(tier.id)}
                      className={`mt-6 w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        tier.highlighted
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-lg shadow-orange-950/40'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/50'
                      }`}
                    >
                      {tier.cta}
                    </button>
                  </FlashGlowCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'agreements' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                {[
                  { id: 'sla', title: '99.99% Enterprise SLA' },
                  { id: 'msa', title: 'Master Subscription Agreement' },
                  { id: 'privacy', title: 'Privacy Policy (GDPR/CCPA)' },
                  { id: 'dpa', title: 'Data Processing Addendum' }
                ].map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedLegalDoc(doc.id as any)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedLegalDoc === doc.id
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <span>{doc.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              <div className="md:col-span-3 bg-[#070A0F] border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-4 font-mono leading-relaxed max-h-[500px] overflow-y-auto">
                {selectedLegalDoc === 'sla' && (
                  <>
                    <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      MASTER GODS 99.99% SERVICE LEVEL AGREEMENT (SLA)
                    </h4>
                    <p>
                      <strong>1. Service Commitment:</strong> Master Gods commits to providing an Monthly Uptime Percentage of at least 99.99% across our autonomous multi-model routing mesh and agentic runtime.
                    </p>
                    <p>
                      <strong>2. Service Credits:</strong> In the event the Monthly Uptime Percentage drops below 99.99%, Customer is eligible for Service Credits credited toward subsequent billing cycles:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>&lt; 99.99% but &ge; 99.0%: 15% Service Credit</li>
                      <li>&lt; 99.0% but &ge; 95.0%: 30% Service Credit</li>
                      <li>&lt; 95.0%: 100% Full Month Service Credit</li>
                    </ul>
                    <p>
                      <strong>3. Multi-Model Failover Protection:</strong> All requests automatically cascade through primary Gemini 2.5, Anthropic Claude 3.7, and OpenAI fallback routes, ensuring uninterrupted synthesis.
                    </p>
                  </>
                )}

                {selectedLegalDoc === 'msa' && (
                  <>
                    <h4 className="text-sm font-bold text-white font-sans">
                      MASTER SUBSCRIPTION AGREEMENT (MSA)
                    </h4>
                    <p>
                      This Master Subscription Agreement governs the deployment, orchestration, and autonomous synthesis services provided by Master Gods Aggregate. By accessing the Enterprise Operating System, Customer accepts all runtime invariants and zero-false-pass verification terms.
                    </p>
                    <p>
                      <strong>Intellectual Property & Code Ownership:</strong> Customer retains 100% exclusive intellectual property ownership of all generated source files, smart contracts, WebGL assets, and schemas synthesized by the system.
                    </p>
                  </>
                )}

                {selectedLegalDoc === 'privacy' && (
                  <>
                    <h4 className="text-sm font-bold text-white font-sans">
                      ENTERPRISE PRIVACY & ZERO DATA EGRESS
                    </h4>
                    <p>
                      Master Gods is architected for strict customer isolation. Prompt data, repository tokens, and synthesized code are never stored in public LLM training sets or shared across tenant boundaries.
                    </p>
                    <p>
                      Air-gapped and local Ollama model routing ensures zero external network packets leave your sovereign perimeter.
                    </p>
                  </>
                )}

                {selectedLegalDoc === 'dpa' && (
                  <>
                    <h4 className="text-sm font-bold text-white font-sans">
                      DATA PROCESSING ADDENDUM (DPA)
                    </h4>
                    <p>
                      Compliant with Article 28 of Regulation (EU) 2016/679 (GDPR) and the California Consumer Privacy Act (CCPA). Standard Contractual Clauses (SCCs) are natively incorporated.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Dynamic AI Token & Cost Estimator</h3>
                <p className="text-xs text-slate-400">Estimate enterprise workload costs based on token throughput and model selection.</p>
              </div>

              <div className="space-y-4 bg-[#070A0F] border border-slate-800 rounded-xl p-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span>Monthly Token Throughput</span>
                    <span className="text-cyan-400 font-mono font-bold">{calcTokens.toLocaleString()} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={calcTokens}
                    onChange={(e) => setCalcTokens(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Target Model Adapter</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(modelRates).map(([id, info]) => (
                      <button
                        key={id}
                        onClick={() => setCalcModel(id as any)}
                        className={`p-3 rounded-lg text-left border text-xs transition-colors ${
                          calcModel === id
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold">{info.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">${info.ratePer1k} / 1k</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-400">Estimated Monthly Token Cost:</div>
                    <div className="text-3xl font-black text-cyan-400 font-mono">${calculatedCostUsd} <span className="text-xs font-normal text-slate-500">USD</span></div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    Includes automatic multi-model failover<br />and 99.99% uptime guarantee.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0B1019] flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Super Admin: gxqstudio@gmail.com</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Center
          </button>
        </div>
      </div>
    </div>
  );
};
