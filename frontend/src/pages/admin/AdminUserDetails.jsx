import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails, updateUserRole, deleteUser, deleteUserProduct, deleteUserOrder, deleteUserChat, clearUserDetails } from '../../features/adminSlice';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiShield,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiDollarSign,
  FiTrendingUp,
  FiEye
} from 'react-icons/fi';

const AdminUserDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { userDetails, loading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userId) {
      dispatch(getUserDetails(userId));
    }
    return () => {
      dispatch(clearUserDetails());
    };
  }, [dispatch, userId]);

  const handleRoleUpdate = async (newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      toast.success(`User role updated to ${newRole}`);
      // Refresh user details
      dispatch(getUserDetails(userId));
    } catch (error) {
      toast.error(error || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete user "${userDetails?.user?.name}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully');
        navigate('/admin/users');
      } catch (error) {
        toast.error(error || 'Failed to delete user');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteUserProduct({ userId, productId })).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(deleteUserOrder({ userId, orderId })).unwrap();
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete order');
      }
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat and all its messages?')) {
      try {
        await dispatch(deleteUserChat({ userId, chatId })).unwrap();
        toast.success('Chat deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete chat');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found or failed to load user details.</p>
      </div>
    );
  }

  const { user, products, orders, chats, stats } = userDetails;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiEye },
    { id: 'products', label: `Products (${stats.totalProducts})`, icon: FiPackage },
    { id: 'orders', label: `Orders (${stats.totalOrders})`, icon: FiShoppingCart },
    { id: 'chats', label: `Chats (${stats.totalChats})`, icon: FiMessageSquare },
  ];

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Complete user information and activity</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-admin-primary flex items-center justify-center">
              <FiUser className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiMail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <FiPhone className="h-4 w-4 mr-1" />
                  {user.phone}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.role === 'admin' && <FiShield className="mr-1 h-4 w-4" />}
              {user.role}
            </span>
            
            {currentUser._id !== user._id && (
              <>
                <button
                  onClick={() => handleRoleUpdate(user.role === 'admin' ? 'user' : 'admin')}
                  className={`inline-flex items-center px-4 py-2 rounded text-sm font-medium ${
                    user.role === 'admin'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  <FiEdit className="mr-1 h-4 w-4" />
                  {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                </button>
                
                {user.role !== 'admin' && (
                  <button
                    onClick={handleDeleteUser}
                    className="inline-flex items-center px-4 py-2 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    <FiTrash2 className="mr-1 h-4 w-4" />
                    Delete User
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={FiPackage} 
            label="Total Products" 
            value={stats.totalProducts}
            color="blue"
          />
          <StatCard 
            icon={FiShoppingCart} 
            label="Total Orders" 
            value={stats.totalOrders}
            color="green"
          />
          <StatCard 
            icon={FiMessageSquare} 
            label="Chat Conversations" 
            value={stats.totalChats}
            color="purple"
          />
          <StatCard 
            icon={FiDollarSign} 
            label="Total Spent" 
            value={`$${stats.totalSpent.toFixed(2)}`}
            color="yellow"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-admin-primary text-admin-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Products:</span>
                      <span className="text-sm font-medium">{stats.activeProducts} / {stats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed Orders:</span>
                      <span className="text-sm font-medium">{stats.completedOrders} / {stats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Order Value:</span>
                      <span className="text-sm font-medium">
                        ${stats.totalOrders > 0 ? (stats.totalSpent / stats.totalOrders).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-medium font-mono">{user._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium">{new Date(user.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {user.address && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Address:</span>
                        <span className="text-sm font-medium text-right">
                          {user.address.street && `${user.address.street}, `}
                          {user.address.city && `${user.address.city}, `}
                          {user.address.state && `${user.address.state} `}
                          {user.address.zipCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">User Products</h3>
                <span className="text-sm text-gray-500">{products.length} products</span>
              </div>
              
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">${product.price}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.status === 'available' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{product.category}</span>
                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">User Orders</h3>
                <span className="text-sm text-gray-500">{orders.length} orders</span>
              </div>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">Order #{order._id.slice(-6)}</h4>
                          <p className="text-sm text-gray-600">
                            {order.products?.length || 0} items • Total: ${order.total}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">User Chats</h3>
                <span className="text-sm text-gray-500">{chats.length} conversations</span>
              </div>
              
              {chats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No chats found</p>
              ) : (
                <div className="space-y-3">
                  {chats.map((chat) => (
                    <div key={chat._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {chat.product?.title || 'Unknown Product'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Between {chat.buyer?.name} (buyer) and {chat.seller?.name} (seller)
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {chat.messageCount} messages
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteChat(chat._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {chat.lastMessage && (
                        <div className="bg-gray-50 rounded p-2 mt-2">
                          <p className="text-sm text-gray-800">{chat.lastMessage.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {chat.lastMessage.sender?.name} • {new Date(chat.lastMessage.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        Started: {new Date(chat.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
