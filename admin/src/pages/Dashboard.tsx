import { useState, useEffect } from 'react';
import { api, OrderStats, CustomerStats } from '../lib/api';

export default function Dashboard() {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [orders, customers] = await Promise.all([
        api.getOrderStats(),
        api.getCustomerStats(),
      ]);
      setOrderStats(orders.data);
      setCustomerStats(customers.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Orders Today"
          value={orderStats?.orders.today || 0}
          subtitle="New orders"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <StatCard
          title="Orders This Week"
          value={orderStats?.orders.week || 0}
          subtitle="Weekly total"
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <StatCard
          title="Pending Orders"
          value={orderStats?.orders.pending || 0}
          subtitle="Awaiting processing"
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
        />
        <StatCard
          title="Revenue Today"
          value={`$${(orderStats?.revenue.today || 0).toFixed(2)}`}
          subtitle="Today's earnings"
          bgColor="bg-purple-50"
          textColor="text-purple-700"
        />
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={customerStats?.total || 0}
          subtitle="Registered users"
          bgColor="bg-indigo-50"
          textColor="text-indigo-700"
        />
        <StatCard
          title="New Today"
          value={customerStats?.newToday || 0}
          subtitle="New signups"
          bgColor="bg-pink-50"
          textColor="text-pink-700"
        />
        <StatCard
          title="New This Month"
          value={customerStats?.newThisMonth || 0}
          subtitle="Monthly signups"
          bgColor="bg-cyan-50"
          textColor="text-cyan-700"
        />
        <StatCard
          title="Active Subscriptions"
          value={customerStats?.activeSubscriptions || 0}
          subtitle="Recurring customers"
          bgColor="bg-orange-50"
          textColor="text-orange-700"
        />
      </div>

      {/* Revenue Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Today's Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(orderStats?.revenue.today || 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(orderStats?.revenue.month || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      {orderStats?.byStatus && Object.keys(orderStats.byStatus).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(orderStats.byStatus).map(([status, count]) => (
              <div key={status} className="p-3 bg-gray-50 rounded text-center">
                <p className="text-sm text-gray-500 capitalize">{status}</p>
                <p className="text-xl font-semibold text-gray-900">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  bgColor,
  textColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold ${textColor} mt-2`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
