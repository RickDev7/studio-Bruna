'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavItem = ({ href, children, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={`
      px-4 py-2 text-sm font-medium transition-colors duration-200
      ${isActive 
        ? 'text-[#FF69B4] border-b-2 border-[#FF69B4]' 
        : 'text-gray-600 hover:text-[#FF69B4]'}
    `}
  >
    {children}
  </Link>
);

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email || null);
    };
    getSession();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-[#FF69B4] font-bold text-xl">
                Painel Admin
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <NavItem 
                href="/admin/agendamentos" 
                isActive={pathname === '/admin/agendamentos'}
              >
                Agendamentos
              </NavItem>
              <NavItem 
                href="/admin/agendar"
                isActive={pathname === '/admin/agendar'}
              >
                Novo Agendamento
              </NavItem>
              <NavItem 
                href="/admin/servicos"
                isActive={pathname === '/admin/servicos'}
              >
                Serviços
              </NavItem>
              <NavItem 
                href="/admin/clientes"
                isActive={pathname === '/admin/clientes'}
              >
                Clientes
              </NavItem>
              <NavItem 
                href="/admin/configuracoes"
                isActive={pathname === '/admin/configuracoes'}
              >
                Configurações
              </NavItem>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {userEmail}
              </span>
              <Link
                href="/logout"
                className="text-sm font-medium text-gray-600 hover:text-[#FF69B4]"
              >
                Sair
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu móvel */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <NavItem 
            href="/admin/agendamentos" 
            isActive={pathname === '/admin/agendamentos'}
          >
            Agendamentos
          </NavItem>
          <NavItem 
            href="/admin/agendar"
            isActive={pathname === '/admin/agendar'}
          >
            Novo Agendamento
          </NavItem>
          <NavItem 
            href="/admin/servicos"
            isActive={pathname === '/admin/servicos'}
          >
            Serviços
          </NavItem>
          <NavItem 
            href="/admin/clientes"
            isActive={pathname === '/admin/clientes'}
          >
            Clientes
          </NavItem>
          <NavItem 
            href="/admin/configuracoes"
            isActive={pathname === '/admin/configuracoes'}
          >
            Configurações
          </NavItem>
        </div>
      </div>
    </nav>
  );
} 