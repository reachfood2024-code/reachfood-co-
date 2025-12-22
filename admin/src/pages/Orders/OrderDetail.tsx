import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Order } from '../../lib/api';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      const response = await api.getOrder(id!);
      setOrder(response.data);
      setNewStatus(response.data.status);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate() {
    if (!order || newStatus === order.status) return;

    setIsUpdating(true);
    try {
      await api.updateOrderStatus(order.id, newStatus, statusNotes || undefined);
      await loadOrder();
      setStatusNotes('');
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-8 text-red-600">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
            <div className="flex items-center space-x-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              />
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === order.status}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.product?.nameEn || item.subscriptionPlan?.nameEn || 'Unknown Item'}
                    </p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${Number(item.totalPrice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>${Number(order.shippingCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>${Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tracking History */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h2>
            <div className="space-y-4">
              {order.tracking?.map((track) => (
                <div key={track.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-600"></div>
                  <div>
                    <p className="font-medium text-gray-900">{track.status}</p>
                    {track.notes && <p className="text-sm text-gray-500">{track.notes}</p>}
                    {track.location && (
                      <p className="text-sm text-gray-500">Location: {track.location}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(track.trackedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {!order.tracking?.length && (
                <p className="text-gray-500">No tracking updates yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                statusColors[order.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p className="text-sm text-gray-500">{order.customer?.email}</p>
              {order.customer?.phone && (
                <p className="text-sm text-gray-500">{order.customer?.phone}</p>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="capitalize">{order.orderType}</span>
              </div>
              {order.deliveryFreq && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span>{order.deliveryFreq}</span>
                </div>
              )}
              {order.dietaryPrefs?.length > 0 && (
                <div>
                  <span className="text-gray-500 block mb-1">Dietary Preferences</span>
                  <div className="flex flex-wrap gap-1">
                    {order.dietaryPrefs.map((pref) => (
                      <span
                        key={pref}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {order.specialNotes && (
                <div>
                  <span className="text-gray-500 block mb-1">Special Instructions</span>
                  <p className="text-gray-700">{order.specialNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
