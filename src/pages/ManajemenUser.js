import React, { useEffect, useMemo, useState } from 'react';
import { userService } from '../services/firebaseService';
import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';

function ManajemenUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Auditor',
    department: 'Inspektorat',
    phone: '',
    position: 'Auditor'
  });


  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setError('Gagal memuat daftar user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // 1) Create Auth user via secondary app to preserve admin session
      const authUser = await userService.createAuthUserWithSecondaryApp(form.email, form.password, {
        name: form.name
      });

      // 2) Create Firestore user profile with the same uid
      await userService.createUserWithId(authUser.uid, {
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department,
        phone: form.phone,
        position: form.position,
        emailVerified: false,
        photoURL: ''
      });

      setSuccess('User berhasil dibuat.');
      setForm({ name: '', email: '', password: '', role: 'Auditor', department: 'Inspektorat', phone: '', position: 'Auditor' });
      await loadUsers();
    } catch (err) {
      const msg = err?.message || 'Gagal membuat user.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Manajemen User</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <UserForm form={form} submitting={submitting} error={error} success={success} onChange={onChange} onSubmit={onSubmit} />
        <UserTable users={users} loading={loading} />
      </div>
    </div>
  );
}

export default ManajemenUser;


