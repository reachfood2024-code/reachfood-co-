import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, Product } from '../../lib/api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
    originalPrice: '',
    category: '',
    badgeEn: '',
    badgeAr: '',
    imageUrl: '',
    featuresEn: '',
    featuresAr: '',
    isFeatured: false,
    isActive: true,
    stockQuantity: '0',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      const response = await api.getProduct(id!);
      const product = response.data;
      setFormData({
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        descriptionEn: product.descriptionEn || '',
        descriptionAr: product.descriptionAr || '',
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        category: product.category,
        badgeEn: product.badgeEn || '',
        badgeAr: product.badgeAr || '',
        imageUrl: product.imageUrl || '',
        featuresEn: product.featuresEn.join('\n'),
        featuresAr: product.featuresAr.join('\n'),
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        stockQuantity: String(product.stockQuantity),
      });
    } catch (err) {
      setError('Failed to load product');
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data: Partial<Product> = {
        nameEn: formData.nameEn,
        nameAr: formData.nameAr,
        descriptionEn: formData.descriptionEn || undefined,
        descriptionAr: formData.descriptionAr || undefined,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        badgeEn: formData.badgeEn || undefined,
        badgeAr: formData.badgeAr || undefined,
        imageUrl: formData.imageUrl || undefined,
        featuresEn: formData.featuresEn.split('\n').filter(Boolean),
        featuresAr: formData.featuresAr.split('\n').filter(Boolean),
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        stockQuantity: parseInt(formData.stockQuantity),
      };

      if (isEditing) {
        await api.updateProduct(id!, data);
      } else {
        await api.createProduct(data);
      }

      navigate('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Product' : 'New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name (Arabic)</label>
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              required
              dir="rtl"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (English)</label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={3}
              dir="rtl"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Original Price (optional)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Badge (English)</label>
            <input
              type="text"
              name="badgeEn"
              value={formData.badgeEn}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Badge (Arabic)</label>
            <input
              type="text"
              name="badgeAr"
              value={formData.badgeAr}
              onChange={handleChange}
              dir="rtl"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features (English, one per line)</label>
            <textarea
              name="featuresEn"
              value={formData.featuresEn}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features (Arabic, one per line)</label>
            <textarea
              name="featuresAr"
              value={formData.featuresAr}
              onChange={handleChange}
              rows={4}
              dir="rtl"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
