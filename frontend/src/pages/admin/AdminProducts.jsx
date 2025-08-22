import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, deleteProduct } from '../../features/adminSlice';
import { toast } from 'react-toastify';
import { FiTrash2, FiPackage, FiEye } from 'react-icons/fi';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to delete product "${productTitle}"?`)) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesType = !filterType || product.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const types = [...new Set(products.map(p => p.type))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Monitor and manage marketplace products</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Products: {products.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-4">
              {/* Product Image */}
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:5001${product.images[0]}`}
                    alt={product.title}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <FiPackage className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                    {product.type === 'rent' && (
                      <span className="text-sm text-gray-500">
                        /${product.rentPricePerDay} day
                      </span>
                    )}
                  </span>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.type === 'sell' ? 'bg-green-100 text-green-800' :
                      product.type === 'rent' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {product.type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'available' ? 'bg-green-100 text-green-800' :
                      product.status === 'sold' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Category: {product.category}</p>
                  <p>Condition: {product.condition}</p>
                  <p>Owner: {product.owner?.name || 'Unknown'}</p>
                  <p>Views: {product.views || 0}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <a
                    href={`/product/${product._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    <FiEye className="mr-1 h-3 w-3" />
                    View
                  </a>
                  <button
                    onClick={() => handleDeleteProduct(product._id, product.title)}
                    className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    <FiTrash2 className="mr-1 h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No products match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
