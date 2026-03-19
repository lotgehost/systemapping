'use client';

import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith('/auth')) return null;

  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push('/auth');
        router.refresh();
      }}
      className="fixed top-4 right-5 z-50 text-[13px] font-medium cursor-pointer transition-opacity duration-150 hover:opacity-100"
      style={{ color: 'rgba(30,30,40,0.55)', opacity: 0.85 }}
    >
      Sign out
    </button>
  );
}
