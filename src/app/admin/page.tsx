import { requireAdminUser } from '@/lib/auth/guards';
import {
  getAdminDashboardStats,
  listBookingsForAdmin,
  listListingsForAdmin,
  listUsersForAdmin,
} from '@/lib/db';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export default async function AdminDashboardPage() {
  await requireAdminUser();

  try {
    const [stats, users, listings, bookings] = await Promise.all([
      getAdminDashboardStats(),
      listUsersForAdmin(),
      listListingsForAdmin(),
      listBookingsForAdmin(),
    ]);

    return (
      <AdminDashboardClient
        stats={stats}
        users={users}
        listings={listings}
        bookings={bookings}
      />
    );
  } catch {
    return (
      <AdminDashboardClient
        stats={{ totalUsers: 0, activeListings: 0, totalBookings: 0, totalRevenue: 0 }}
        users={[]}
        listings={[]}
        bookings={[]}
        dataUnavailable
      />
    );
  }
}
