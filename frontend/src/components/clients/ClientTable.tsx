import api from '../../lib/api';
import { Table } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { DropdownMenu } from '../ui/dropdown-menu';

export default function ClientTable() {
  return (
    <Table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>João Silva</td>
          <td>joao@email.com</td>
          <td>
            <Badge color="green">Ativo</Badge>
          </td>
          <td>
            <Button><Edit size={16} /></Button>
            <Button variant="destructive"><Trash2 size={16} /></Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
