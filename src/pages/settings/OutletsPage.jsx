import OutletsManagement from '../../components/business/OutletsManagement.jsx';

export default function OutletsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Outlets & Factories</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your processing factories and customer drop-off outlets. Factories are created first.
        </p>
      </div>
      <OutletsManagement compact={false} />
    </div>
  );
}
