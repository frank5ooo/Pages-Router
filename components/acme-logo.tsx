import { GlobeAltIcon } from '@heroicons/react/24/outline';
// import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-1 w-1 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
