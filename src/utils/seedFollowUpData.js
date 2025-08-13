import { COLLECTIONS, FOLLOW_UP_STATUS, FOLLOW_UP_PRIORITY } from '../constants/collections';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export const seedFollowUpData = async () => {
  const followUpData = [
    {
      title: "Ketidaksesuaian Pencatatan Aset",
      auditTitle: "Audit Keuangan Dinas Pendidikan 2024",
      recommendation: "Melakukan rekonsiliasi dan penyesuaian nilai aset tetap sesuai kondisi riil",
      assignedTo: "Kepala Bagian Keuangan",
      deadline: "2024-02-15T00:00:00.000Z",
      priority: FOLLOW_UP_PRIORITY.HIGH,
      status: FOLLOW_UP_STATUS.IN_PROGRESS,
      progress: 65,
      notes: "Tim sudah dibentuk, sedang proses inventarisasi aset",
      actions: "Pembentukan tim rekonsiliasi aset dan penyusunan berita acara penyesuaian",
      createdAt: "2024-01-15T00:00:00.000Z",
      updatedAt: "2024-01-20T00:00:00.000Z"
    },
    {
      title: "Dokumentasi Pengadaan Tidak Lengkap",
      auditTitle: "Audit Keuangan Dinas Pendidikan 2024",
      recommendation: "Menyusun sistem filing dan dokumentasi yang lebih tertib",
      assignedTo: "Kepala Bagian Umum",
      deadline: "2024-02-01T00:00:00.000Z",
      priority: FOLLOW_UP_PRIORITY.MEDIUM,
      status: FOLLOW_UP_STATUS.COMPLETED,
      progress: 100,
      notes: "Sistem dokumentasi telah diimplementasi dan staff telah dilatih",
      actions: "Implementasi sistem dokumentasi digital dan pelatihan staff",
      completionProof: "Sistem dokumentasi telah diimplementasi dan staff telah dilatih",
      completedAt: "2024-01-28T00:00:00.000Z",
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-28T00:00:00.000Z"
    },
    {
      title: "Target Cakupan Imunisasi Belum Tercapai",
      auditTitle: "Audit Kinerja Program Kesehatan",
      recommendation: "Meningkatkan sosialisasi dan jangkauan pelayanan imunisasi",
      assignedTo: "Kepala Bidang Kesehatan Masyarakat",
      deadline: "2024-01-25T00:00:00.000Z",
      priority: FOLLOW_UP_PRIORITY.HIGH,
      status: FOLLOW_UP_STATUS.OVERDUE,
      progress: 40,
      notes: "Terkendala cuaca dan akses ke daerah terpencil",
      actions: "Program sosialisasi intensif dan penambahan pos pelayanan",
      createdAt: "2024-01-05T00:00:00.000Z",
      updatedAt: "2024-01-25T00:00:00.000Z"
    },
    {
      title: "Sistem Pengendalian Internal Belum Optimal",
      auditTitle: "Audit Sistem Informasi Keuangan",
      recommendation: "Memperbaiki dan mengoptimalkan sistem pengendalian internal",
      assignedTo: "Kepala Bagian Sistem Informasi",
      deadline: "2024-03-01T00:00:00.000Z",
      priority: FOLLOW_UP_PRIORITY.MEDIUM,
      status: FOLLOW_UP_STATUS.NOT_STARTED,
      progress: 0,
      notes: "Menunggu persetujuan anggaran untuk pengembangan sistem",
      actions: "Pengembangan sistem pengendalian internal yang terintegrasi",
      createdAt: "2024-01-25T00:00:00.000Z",
      updatedAt: "2024-01-25T00:00:00.000Z"
    }
  ];

  try {
    console.log('Seeding follow-up data...');
    
    for (const data of followUpData) {
      await addDoc(collection(db, COLLECTIONS.FOLLOW_UPS), data);
    }
    
    console.log('Follow-up data seeded successfully!');
  } catch (error) {
    console.error('Error seeding follow-up data:', error);
  }
};

export default seedFollowUpData;
