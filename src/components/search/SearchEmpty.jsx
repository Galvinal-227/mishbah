import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import EmptyState from '../ui/EmptyState';

export default function SearchEmpty({ query }) {
  return (
    <EmptyState
      icon={<HiOutlineMagnifyingGlass className="h-7 w-7" />}
      title="Tidak ada hasil"
      description={`Kami tidak menemukan hasil untuk "${query}". Coba kata kunci lain, atau cari dalam bahasa Indonesia.`}
    />
  );
}