import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  HeartHandshake, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Send, 
  Info,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { FIRST_AID_GUIDES_EN, FIRST_AID_GUIDES_TA } from '../../data/mockData';
import { supabase } from '../../utils/supabaseClient';

interface AIGuidance {
  title: string;
  summary: string;
  actions: string[];
  cautions: string[];
}

export const FirstAidPanel: React.FC = () => {
  const { currentEmergency, updateFirstAidCondition } = useEmergency();
  const { t, language } = useLanguage();

  const FIRST_AID_GUIDES = language === 'TA' ? FIRST_AID_GUIDES_TA : FIRST_AID_GUIDES_EN;

  const [selectedCondition, setSelectedCondition] = useState<string>(
    currentEmergency?.firstAidCondition || 'Bone Injury'
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // AI "Other" flow state
  const [otherDescription, setOtherDescription] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  const [aiGuidance, setAiGuidance] = useState<AIGuidance | null>(null);

  const guide = FIRST_AID_GUIDES[selectedCondition] || FIRST_AID_GUIDES['Bone Injury'];

  const conditionOptions = [
    { key: 'Bone Injury', icon: '🦴', label: t('conditionBoneInjury') },
    { key: 'Road Accident', icon: '🚗', label: t('conditionRoadAccident') },
    { key: 'Chest Pain', icon: '❤️', label: t('conditionChestPain') },
    { key: 'Breathing Difficulty', icon: '🫁', label: t('conditionBreathing') },
    { key: 'Burn', icon: '🔥', label: t('conditionBurn') },
    { key: 'Bleeding', icon: '🩸', label: t('conditionBleeding') },
    { key: 'Fall / Injury', icon: '⚠️', label: t('conditionFallInjury') },
    { key: 'Other Emergency', icon: '🚨', label: t('conditionOther') },
  ];

  const handleSelectCondition = (conditionKey: string) => {
    setSelectedCondition(conditionKey);
    setAiGuidance(null);
    setAiError('');
    if (conditionKey !== 'Other Emergency') {
      updateFirstAidCondition(conditionKey);
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherDescription.trim()) return;

    setAiLoading(true);
    setAiError('');
    setAiGuidance(null);

    try {
      const { data, error } = await supabase.functions.invoke('first-aid-guidance', {
        body: { description: otherDescription, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAiGuidance(data as AIGuidance);
      updateFirstAidCondition('Other Emergency', otherDescription);
    } catch (err: any) {
      setAiError(t('otherErrorMsg'));
      console.error('AI first-aid error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl shadow-card overflow-hidden transition-all">
      
      {/* Panel Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-navy-900/90 px-4 py-3.5 border-b border-navy-700 flex items-center justify-between cursor-pointer hover:bg-navy-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t('firstAidPanelTitle')}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-normal px-2 py-0.5 rounded-full border border-emerald-500/30">
                {t('firstAidPanelBadge')}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {t('firstAidPanelSubtitle')}
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5 animate-fade-in">
          
          {/* Prompt */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('firstAidPrompt')}</span>
            </div>

            {/* Condition Selection Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {conditionOptions.map((item) => {
                const isSelected = selectedCondition === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectCondition(item.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan'
                        : 'bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* "Other Emergency" AI Flow */}
          {selectedCondition === 'Other Emergency' && (
            <div className="bg-navy-900/90 border border-navy-700 rounded-lg p-4 space-y-3">
              <form onSubmit={handleAskAI} className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('otherDescribeLabel')}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otherDescription}
                    onChange={(e) => setOtherDescription(e.target.value)}
                    placeholder={t('otherPlaceholder')}
                    className="flex-1 bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !otherDescription.trim()}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-navy-700 disabled:text-slate-500 text-black font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{aiLoading ? t('otherThinking') : t('otherGetGuidance')}</span>
                  </button>
                </div>
              </form>

              {aiError && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-300 text-xs p-2.5 rounded">
                  {aiError}
                </div>
              )}
            </div>
          )}

          {/* AI-Generated Guide Card */}
          {selectedCondition === 'Other Emergency' && aiGuidance && (
            <div className="bg-navy-900/90 border border-cyan-700/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-navy-700 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {aiGuidance.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {aiGuidance.summary}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-normal px-2 py-0.5 rounded-full border border-cyan-500/30 shrink-0">
                  {t('aiGeneratedBadge')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('recommendedActions')}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {aiGuidance.actions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-navy-800/60 p-2 rounded border border-navy-700/60">
                      <span className="text-cyan-400 font-bold font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {aiGuidance.cautions && aiGuidance.cautions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t('criticalCautions')}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-red-200/90">
                    {aiGuidance.cautions.map((caution, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-red-950/30 p-1.5 rounded border border-red-500/20">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{caution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-navy-950/80 border border-slate-700/50 p-2.5 rounded text-[11px] text-slate-400 italic">
                "{t('aiDisclaimerText')}"
              </div>
            </div>
          )}

          {/* Active Guide Card (for the fixed categories, not "Other") */}
          {selectedCondition !== 'Other Emergency' && guide && (
            <div className="bg-navy-900/90 border border-navy-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-navy-700 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{guide.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {guide.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {guide.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable Steps Checklist */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('recommendedActions')}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {guide.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-navy-800/60 p-2 rounded border border-navy-700/60">
                      <span className="text-cyan-400 font-bold font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Do Nots Warnings */}
              {guide.doNots && guide.doNots.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t('criticalCautions')}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-red-200/90">
                    {guide.doNots.map((caution, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-red-950/30 p-1.5 rounded border border-red-500/20">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{caution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mandatory Medical Disclaimer */}
              <div className="bg-navy-950/80 border border-slate-700/50 p-2.5 rounded text-[11px] text-slate-400 italic">
                "{guide.disclaimer}"
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
