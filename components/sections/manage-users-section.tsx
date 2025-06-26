"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ManageUsersSection() {
  const [users, setUsers] = useState<any[]>([]);
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
  }, []);

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