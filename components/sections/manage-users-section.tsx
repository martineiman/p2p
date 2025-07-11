"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";

interface ManageUsersSectionProps {
  users?: User[]; // Puedes recibirlos pero igual los cargas desde supabase si así lo deseas
  onRefreshData?: () => Promise<void>;
}

export default function ManageUsersSection({ users: initialUsers, onRefreshData }: ManageUsersSectionProps) {
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase no está configurado correctamente.");
      return;
    }
    supabase.from("users").select("*").then(({ data, error }) => {
      setUsers(data || []);
      setError(error);
    });
  }, [onRefreshData]);

  return (
    <div>
      <h2>Usuarios</h2>
      {error && <div style={{ color: "red" }}>{JSON.stringify(error)}</div>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Área</th>
            <th>Equipo</th>
            <th>Cumpleaños</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.area}</td>
              <td>{u.team}</td>
              <td>{u.birthday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}