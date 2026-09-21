import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import {
  Video,
  VideoOff,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export const CameraSuppressionRequests: React.FC = () => {
  const { cctvCameras, setCameraSuppression } = useEmergency();

  const [requestText, setRequestText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fallback manual picker state (shown when AI isn't confident)
  const [needsManualPick, setNeedsManualPick] = useState<boolean>(false);
  const [pendingReason, setPendingReason] = useState<string>('');
  const [manualCamera, setManualCamera] = useState<string>('');

  const suppressedCameras = cctvCameras.filter(c => c.suppressed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    setLoading(true);
    setError('');
    setNeedsManualPick(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('camera-suppression', {
        body: { requestText },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      if (data?.confident && data?.camera) {
        setCameraSuppression(data.camera, true, data.reason || 'Operator request');
        setRequestText('');
      } else {
        // AI wasn't confident - fall back to manual picker
        setPendingReason(data?.reason || requestText);
        setNeedsManualPick(true);
      }
    } catch (err: any) {
      console.error('Camera suppression AI error:', err);
      // Fall back to manual picker on any failure
      setPendingReason(requestText);
      setNeedsManualPick(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualConfirm = () => {
    if (!manualCamera) return;
    setCameraSuppression(manualCamera, true, pendingReason || 'Operator request');
    setRequestText('');
    setNeedsManualPick(false);
    setManualCamera('');
    setPendingReason('');
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-5">

      {/* Header */}
      <div className="border-b border-navy-700 pb-3">
        <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
          <VideoOff className="w-5 h-5 text-amber-400" />
          <span>Camera Monitoring Requests</span>
        </h3>
        <p className="text-xs text-slate-400">
          Pause AI detection on a specific camera for known events (filming, protests, roadwork) to prevent false alerts
        </p>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Describe the request:</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="e.g. We're filming a movie scene near the Highway camera today, please pause detection there"
            className="flex-1 bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading || !requestText.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-navy-700 disabled:text-slate-500 text-black font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{loading ? 'Processing...' : 'Submit'}</span>
          </button>
        </div>
      </form>

      {/* Manual Fallback Picker */}
      {needsManualPick && (
        <div className="bg-navy-900/90 border border-amber-500/40 rounded-lg p-4 space-y-3">
          <div className="text-xs text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Couldn't confidently identify the camera. Please select it manually:</span>
          </div>
          <div className="flex gap-2">
            <select
              value={manualCamera}
              onChange={(e) => setManualCamera(e.target.value)}
              className="flex-1 bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select a camera...</option>
              {cctvCameras.map(c => (
                <option key={c.id} value={c.locationName}>{c.number} - {c.locationName}</option>
              ))}
            </select>
            <button
              onClick={handleManualConfirm}
              disabled={!manualCamera}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-navy-700 disabled:text-slate-500 text-black font-bold px-3 py-2 rounded-lg text-xs shrink-0 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-300 text-xs p-2.5 rounded">
          {error}
        </div>
      )}

      {/* Active Suppressions List */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <VideoOff className="w-3.5 h-3.5" />
          <span>Currently Paused Cameras ({suppressedCameras.length})</span>
        </div>

        {suppressedCameras.length === 0 ? (
          <div className="bg-navy-900/60 border border-navy-800 rounded-lg p-3 text-xs text-slate-500 text-center">
            No cameras currently paused. All monitoring active.
          </div>
        ) : (
          <div className="space-y-2">
            {suppressedCameras.map(cam => (
              <div
                key={cam.id}
                className="bg-navy-900/90 border border-amber-500/30 rounded-lg p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <VideoOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">{cam.number} - {cam.locationName}</div>
                    <div className="text-[11px] text-slate-400">{cam.suppressionReason}</div>
                  </div>
                </div>
                <button
                  onClick={() => setCameraSuppression(cam.locationName, false)}
                  className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resume</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
