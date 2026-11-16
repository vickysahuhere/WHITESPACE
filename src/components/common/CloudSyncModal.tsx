import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDocuments } from '../../context/DocumentContext';
import { useTasks } from '../../context/TaskContext';
import { useBrowser } from '../../context/BrowserContext';
import { firebaseSync, DEMO_SPARK_CONFIG, OFFICIAL_TEAM_INVITE_CODE } from '../../services/firebaseSync';
import { 
  Cloud, 
  UploadCloud, 
  DownloadCloud, 
  Key, 
  Lock, 
  Check, 
  AlertCircle, 
  X, 
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({ isOpen, onClose }) => {
  const { spaces } = useWorkspace();
  const { documents } = useDocuments();
  const { tasks } = useTasks();
  const { tabs } = useBrowser();

  const [inviteCode, setInviteCode] = useState(() => firebaseSync.getSavedInviteCode() || OFFICIAL_TEAM_INVITE_CODE);
  const [isAuthorized, setIsAuthorized] = useState(() => firebaseSync.isAuthorized());
  const [config, setConfig] = useState(() => firebaseSync.getConfig() || DEMO_SPARK_CONFIG);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(() => firebaseSync.getLastSyncedAt());

  if (!isOpen) return null;

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = firebaseSync.validateInviteCode(inviteCode);
    setIsAuthorized(valid);
    if (valid) {
      setFeedback('INVITE CODE VERIFIED // CLOUD ACCESS AUTHORIZED');
    } else {
      setFeedback('INVALID INVITE CODE // ACCESS DENIED');
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  const handlePush = async () => {
    setIsSyncing(true);
    setFeedback(null);
    try {
      const sharedTabs = tabs.filter(t => t.isShared);
      const res = await firebaseSync.pushLocalStateToCloud({
        spaces,
        documents,
        tasks,
        sharedTabs
      });
      setLastSynced(res.timestamp);
      setFeedback(`CLOUD SYNC SUCCESS // ${res.count} ENTITIES REPLICATED TO FIRESTORE`);
    } catch (err: any) {
      setFeedback(`ERROR: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePull = async () => {
    setIsSyncing(true);
    setFeedback(null);
    try {
      const data = await firebaseSync.pullCloudStateToLocal();
      if (data) {
        setLastSynced(new Date().toISOString());
        setFeedback('PULLED CLOUD STATE // LOCAL CACHE SYNCHRONIZED');
      } else {
        setFeedback('NO REMOTE CLOUD SNAPSHOT FOUND // PUSH STATE FIRST');
      }
    } catch (err: any) {
      setFeedback(`ERROR: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUseDemo = () => {
    setConfig(DEMO_SPARK_CONFIG);
    firebaseSync.saveConfig(DEMO_SPARK_CONFIG);
    setInviteCode(OFFICIAL_TEAM_INVITE_CODE);
    firebaseSync.validateInviteCode(OFFICIAL_TEAM_INVITE_CODE);
    setIsAuthorized(true);
    setFeedback('LOADED FIREBASE SPARK DEMO PROJECT CREDENTIALS');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-[#0C0C0C] border border-[#404040] p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Cloud size={16} className="text-[#FFFFFF]" />
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] uppercase">
              CLOUD FIRESTORE SYNC // FIREBASE SPARK TIER
            </span>
          </div>
          <button onClick={onClose} className="text-[#A3A3A3] hover:text-[#FFFFFF]">
            <X size={15} />
          </button>
        </div>

        {/* 1. Team Invite Code Authorization */}
        <div className="bg-[#080808] border border-[#202020] p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
              <Lock size={13} />
              <span>INVITE-ONLY TEAM GATE</span>
            </span>
            <span className={`px-2 py-0.5 text-[9px] font-bold border ${
              isAuthorized
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                : 'bg-[#171717] text-[#737373] border-[#333333]'
            }`}>
              {isAuthorized ? 'AUTHORIZED' : 'ACCESS LOCKED'}
            </span>
          </div>

          <form onSubmit={handleValidateCode} className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="ENTER TEAM INVITE CODE..."
              className="flex-1 bg-[#000000] border border-[#262626] focus:border-[#FFFFFF] px-3 py-1.5 text-xs text-[#FFFFFF] outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC]"
            >
              VERIFY
            </button>
          </form>
          <div className="text-[10px] text-[#555555]">
            Default Invite Code: <code className="text-[#A3A3A3] font-bold">{OFFICIAL_TEAM_INVITE_CODE}</code>
          </div>
        </div>

        {/* 2. Firebase Credentials */}
        <div className="bg-[#080808] border border-[#202020] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
              <Database size={13} />
              <span>FIREBASE PROJECT CREDENTIALS</span>
            </span>
            <button
              onClick={handleUseDemo}
              className="text-[10px] text-[#A3A3A3] hover:text-[#FFFFFF] underline"
            >
              USE DEMO SPARK PROJECT
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-[#737373] block mb-0.5">PROJECT ID</label>
              <input
                type="text"
                value={config.projectId}
                onChange={e => {
                  const updated = { ...config, projectId: e.target.value };
                  setConfig(updated);
                  firebaseSync.saveConfig(updated);
                }}
                className="w-full bg-[#000000] border border-[#262626] p-1.5 text-[11px] text-[#FFFFFF] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#737373] block mb-0.5">AUTH DOMAIN</label>
              <input
                type="text"
                value={config.authDomain}
                onChange={e => {
                  const updated = { ...config, authDomain: e.target.value };
                  setConfig(updated);
                  firebaseSync.saveConfig(updated);
                }}
                className="w-full bg-[#000000] border border-[#262626] p-1.5 text-[11px] text-[#FFFFFF] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Sync Action Operations */}
        <div className="bg-[#080808] border border-[#202020] p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFFFFF] font-bold">STATE REPLICATION CENTER</span>
            <span className="text-[10px] text-[#737373]">
              LAST SYNC: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'NEVER'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePush}
              disabled={!isAuthorized || isSyncing}
              className="p-2.5 bg-[#FFFFFF] hover:bg-[#CCCCCC] disabled:opacity-30 disabled:cursor-not-allowed text-[#000000] font-bold text-xs border border-[#FFFFFF] flex items-center justify-center gap-2"
            >
              <UploadCloud size={14} />
              <span>PUSH LOCAL TO CLOUD</span>
            </button>

            <button
              onClick={handlePull}
              disabled={!isAuthorized || isSyncing}
              className="p-2.5 bg-[#171717] hover:bg-[#222222] disabled:opacity-30 disabled:cursor-not-allowed text-[#FFFFFF] font-bold text-xs border border-[#333333] flex items-center justify-center gap-2"
            >
              <DownloadCloud size={14} />
              <span>PULL CLOUD TO LOCAL</span>
            </button>
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#1C1C1C] text-center text-[10px]">
            <div className="bg-[#000000] p-1.5 border border-[#202020]">
              <div className="text-[#FFFFFF] font-bold">{spaces.length}</div>
              <div className="text-[#737373]">SPACES</div>
            </div>
            <div className="bg-[#000000] p-1.5 border border-[#202020]">
              <div className="text-[#FFFFFF] font-bold">{documents.length}</div>
              <div className="text-[#737373]">DOCS</div>
            </div>
            <div className="bg-[#000000] p-1.5 border border-[#202020]">
              <div className="text-[#FFFFFF] font-bold">{tasks.length}</div>
              <div className="text-[#737373]">TASKS</div>
            </div>
            <div className="bg-[#000000] p-1.5 border border-[#202020]">
              <div className="text-[#FFFFFF] font-bold">{tabs.filter(t => t.isShared).length}</div>
              <div className="text-[#737373]">SHARED TABS</div>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="p-2 bg-[#141414] border border-[#333333] text-xs text-[#FFFFFF] flex items-center gap-2">
            <Sparkles size={12} className="text-[#FFFFFF]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#262626]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FFFFFF] text-[#000000] font-bold text-xs border border-[#FFFFFF] hover:bg-[#CCCCCC]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
