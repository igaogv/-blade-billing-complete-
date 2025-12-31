import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import React from 'react';

// Ajuste as props conforme o seu componente!
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={cn('sidebar', { open: isOpen })}>
      {/* Conteúdo do sidebar */}
      <Button onClick={onClose}>Fechar</Button>
    </aside>
  );
}
