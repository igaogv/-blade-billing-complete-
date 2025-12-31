import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { getAppointments, createAppointment } from '../api/appointmentsApi';

// Defina a interface para garantir tipagem de cada item
interface Appointment {
  id: string;
  date: string;
  clientId: string;
  service: string;
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({ date: '', clientId: '', service: '' });

  useEffect(() => {
    getAppointments().then(setAppointments);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createAppointment(form);
    setAppointments(await getAppointments());
    setForm({ date: '', clientId: '', service: '' });
  }

  return (
    <div>
      <h2>Agendamentos</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Data:
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="datetime-local"
            required
            placeholder="Data e hora"
          />
        </label>
        <label>
          Cliente ID:
          <input
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            placeholder="ID do Cliente"
            required
          />
        </label>
        <label>
          Serviço:
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            placeholder="Serviço"
            required
          />
        </label>
        <button type="submit">Criar</button>
      </form>
      <ul>
        {appointments.map(appt => (
          <li key={appt.id}>
            {appt.date} - {appt.service} (Cliente: {appt.clientId})
          </li>
        ))}
      </ul>
    </div>
  );
}
