import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, Customer } from '../../lib/api';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  async function loadCustomer() {
    try {
      const response = await api.getCustomer(id!);
      setCustomer(response.data);
    } catch (err) {
      console.error('Failed to load customer:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!customer) {
    return <div className="text-center py-8 text-red-600">Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {customer.firstName} {customer.lastName}
        </h1>
        <button
          onClick={() => navigate('/customers')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Customers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="font-medium">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <span className="text-sm text-gray-500">Phone</span>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
            {customer.address && (
              <div>
                <span className="text-sm text-gray-500">Address</span>
                <p className="font-medium">{customer.address}</p>
              </div>
            )}
            {(customer.city || customer.country) && (
              <div>
                <span className="text-sm text-gray-500">Location</span>
                <p className="font-medium">
                  {[customer.city, customer.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {customer._count?.orders || 0}
              </p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {customer._count?.subscriptions || 0}
              </p>
              <p className="text-sm text-gray-500">Subscriptions</p>
            </div>
            <div className="col-span-2 bg-primary-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary-700">
                ${(customer.totalSpent || 0).toFixed(2)}
              </p>
              <p className="text-sm text-primary-600">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  customer.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Type</span>
              <span className="text-sm font-medium">
                {customer.isGuest ? 'Guest' : 'Registered'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Joined</span>
              <span className="text-sm font-medium">
                {new Date(customer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {(customer as unknown as { orders?: Array<{ id: string; orderNumber: string; total: number; status: string; createdAt: string }> }).orders &&
        (customer as unknown as { orders: Array<{ id: string; orderNumber: string; total: number; status: string; createdAt: string }> }).orders.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(customer as unknown as { orders: Array<{ id: string; orderNumber: string; total: number; status: string; createdAt: string }> }).orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
