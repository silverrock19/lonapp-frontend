import { useState } from 'react';
import { Smartphone, Globe, LogOut, Trash2, AlertTriangle, Info } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { mockSessions } from '../../data/mockStaff.js';

const SessionsTab = () => {
  const [sessions, setSessions]         = useState(mockSessions);
  const [revokeModal, setRevokeModal]   = useState(null);
  const [revokeAll, setRevokeAll]       = useState(false);
  const [revokeAllDone, setRevokeAllDone] = useState(false);

  const handleRevoke = id => {
    setSessions(s => s.filter(sess => sess.id !== id));
    setRevokeModal(null);
  };
  const handleRevokeAll = () => {
    setSessions(s => s.filter(sess => sess.current));
    setRevokeAll(false);
    setRevokeAllDone(true);
  };

  return (
    <div className="space-y-6">
      {revokeAllDone && (
        <Alert type="success" title="All other sessions revoked">Only your current session remains active.</Alert>
      )}

      <SectionCard
        title="Active sessions"
        description="Devices currently signed in to your account."
        action={
          sessions.filter(s => !s.current).length > 0 ? (
            <Button variant="outline" size="sm" onClick={() => setRevokeAll(true)}>
              <LogOut className="h-3.5 w-3.5" /> Revoke all others
            </Button>
          ) : null
        }
      >
        <div className="divide-y divide-neutral-100">
          {sessions.map(sess => (
            <div key={sess.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: sess.current ? '#EAF2FC' : '#F3F4F6' }}
              >
                {sess.device.toLowerCase().includes('iphone') || sess.device.toLowerCase().includes('android')
                  ? <Smartphone className="h-4 w-4" style={{ color: sess.current ? '#0C5FC5' : '#6B7280' }} />
                  : <Globe      className="h-4 w-4" style={{ color: sess.current ? '#0C5FC5' : '#6B7280' }} />
                }
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-small font-semibold text-neutral-900">{sess.device}</p>
                  {sess.current && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-caption font-semibold" style={{ background: '#EAF2FC', color: '#0C5FC5' }}>
                      This device
                    </span>
                  )}
                  {sess.unusualLocation && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold" style={{ background: '#FFF4E0', color: '#945800' }}>
                      <AlertTriangle className="h-3 w-3" /> New location
                    </span>
                  )}
                </div>
                <p className="text-caption text-neutral-500">{sess.location} · {sess.ip} · Last active {sess.lastActive}</p>
                <p className="text-caption text-neutral-400">Signed in {sess.loginTime}</p>
              </div>
              <button
                onClick={() => !sess.current && setRevokeModal(sess)}
                disabled={sess.current}
                title={sess.current ? 'Cannot revoke your current session' : 'Revoke this session'}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-error disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {sessions.length <= 1 && (
            <p className="py-4 text-center text-small text-neutral-500">Only your current session is active.</p>
          )}
        </div>
      </SectionCard>

      <div className="flex items-start gap-2 rounded-lg px-4 py-3 text-caption" style={{ background: '#EAF2FC', color: '#093F84' }}>
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        Sessions expire automatically after 30 days of inactivity. Revoking a session signs the device out immediately.
      </div>

      {revokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-h4 font-bold text-neutral-900">Revoke session?</h3>
            <p className="mt-2 text-small text-neutral-600">
              <strong>{revokeModal.device}</strong> in {revokeModal.location} will be signed out immediately.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRevokeModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleRevoke(revokeModal.id)}>Revoke session</Button>
            </div>
          </div>
        </div>
      )}

      {revokeAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-h4 font-bold text-neutral-900">Revoke all other sessions?</h3>
            <p className="mt-2 text-small text-neutral-600">
              All {sessions.filter(s => !s.current).length} other active sessions will be signed out immediately. Your current session will remain active.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRevokeAll(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleRevokeAll}><LogOut className="h-3.5 w-3.5" /> Revoke all others</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsTab;
