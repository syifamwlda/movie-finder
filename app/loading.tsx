import { HeroSkeleton, RowSkeleton } from '@/components/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="page-content">
      <HeroSkeleton />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </div>
  );
}
