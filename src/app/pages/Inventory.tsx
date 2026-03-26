import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Edit, Trash2, Check, X, Package, Search, Upload, Image as ImageIcon, Tag, FolderPlus } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { categoryAPI } from '../services/api';
import { formatCurrency } from '../utils/currency';

export const Inventory = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, currentShop } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    sku: '', 
    price: 0,
    stock: 0, 
    categoryId: '',
    barcode: '',
    image: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    sku: '', 
    price: 0,
    stock: 0, 
    categoryId: '',
    barcode: '',
    image: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; productId: string; productName: string }>({
    show: false,
    productId: '',
    productName: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  
  // Category management state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<{ show: boolean; categoryId: string; categoryName: string }>({
    show: false,
    categoryId: '',
    categoryName: ''
  });

  // Real-time search filtering
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const search = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      (product.category?.name || '').toLowerCase().includes(search)
    );
  }, [products, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Update local categories when categories prop changes
  useMemo(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!currentShop) {
      toast.error('No shop selected');
      return;
    }

    setLoadingCategory(true);
    try {
      const response: any = await categoryAPI.create(currentShop.id, {
        name: categoryName,
        description: categoryDescription,
      });
      setLocalCategories([...localCategories, response.data]);
      toast.success('Category added successfully');
      setCategoryName('');
      setCategoryDescription('');
      // Don't close modal - keep it open
    } catch (error: any) {
      toast.error(error.error || 'Failed to add category');
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!currentShop) {
      toast.error('No shop selected');
      return;
    }

    try {
      await categoryAPI.delete(currentShop.id, categoryId);
      setLocalCategories(localCategories.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete category');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEdit) {
          setEditForm({ ...editForm, image: result });
          setEditImagePreview(result);
        } else {
          setNewProduct({ ...newProduct, image: result });
          setImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
        toast.error('Name, Price, and Category are required');
        return;
    }
    
    addProduct({
      name: newProduct.name,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      price: newProduct.price,
      costPrice: newProduct.price * 0.6, // Auto-calculate cost as 60% of price
      categoryId: newProduct.categoryId,
      barcode: newProduct.barcode,
      stock: newProduct.stock || 0,
      image: newProduct.image,
    });
    setIsAdding(false);
    setNewProduct({ name: '', sku: '', price: 0, stock: 0, categoryId: '', barcode: '', image: '' });
    setImagePreview('');
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      barcode: product.barcode || '',
      image: product.image || ''
    });
    setEditImagePreview(product.image || '');
  };

  const saveEdit = () => {
    if (editingId) {
      updateProduct(editingId, {
        name: editForm.name,
        sku: editForm.sku,
        price: editForm.price,
        stock: editForm.stock,
        categoryId: editForm.categoryId,
        barcode: editForm.barcode,
        image: editForm.image,
      });
      setEditingId(null);
      setEditImagePreview('');
    }
  };

  const handleDeleteClick = (productId: string, productName: string) => {
    setDeleteConfirm({ show: true, productId, productName });
  };

  const confirmDelete = () => {
    deleteProduct(deleteConfirm.productId);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-screen bg-[#FDFBF7] overflow-y-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#5D4037]">Inventory Management</h1>
            <p className="text-[#8D6E63] mt-1 text-sm">Manage your products, stock levels, and prices.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="bg-white border border-[#5D4037] text-[#5D4037] px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#FDFBF7] transition-colors shadow-sm"
          >
            <Tag size={20} />
            Manage Categories
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-[#5D4037] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4E342E] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 md:mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all bg-white"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-[#8D6E63] mt-2">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E6E0D4] overflow-hidden">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full text-left min-w-[800px]">
          <thead className="bg-[#F5F5F5] border-b border-[#E6E0D4]">
            <tr>
              <th className="p-4 font-medium text-[#8D6E63]">Image</th>
              <th className="p-4 font-medium text-[#8D6E63]">Name</th>
              <th className="p-4 font-medium text-[#8D6E63]">SKU</th>
              <th className="p-4 font-medium text-[#8D6E63]">Price</th>
              <th className="p-4 font-medium text-[#8D6E63]">Stock</th>
              <th className="p-4 font-medium text-[#8D6E63]">Category</th>
              <th className="p-4 font-medium text-[#8D6E63] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-[#FFF8E1] animate-in fade-in duration-300">
                <td className="p-4">
                  <div className="flex flex-col items-center gap-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[#E6E0D4]" />
                    ) : (
                      <div className="w-16 h-16 bg-[#FDFBF7] rounded-lg border border-[#E6E0D4] flex items-center justify-center">
                        <ImageIcon size={24} className="text-[#D7CCC8]" />
                      </div>
                    )}
                    <label className="cursor-pointer text-xs text-[#5D4037] hover:underline flex items-center gap-1">
                      <Upload size={14} />
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, false)}
                      />
                    </label>
                  </div>
                </td>
                <td className="p-4">
                  <input 
                    className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                    placeholder="Product Name" 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    autoFocus
                  />
                </td>
                <td className="p-4">
                  <input 
                    className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                    placeholder="SKU" 
                    value={newProduct.sku} 
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})} 
                  />
                </td>
                <td className="p-4">
                  <input 
                    className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                    type="number" 
                    placeholder="0.00" 
                    value={newProduct.price || ''} 
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} 
                  />
                </td>
                <td className="p-4">
                  <input 
                    className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                    type="number" 
                    placeholder="0" 
                    value={newProduct.stock || ''} 
                    onChange={e => setNewProduct({...newProduct, stock: parseFloat(e.target.value)})} 
                  />
                </td>
                <td className="p-4">
                  <select 
                    className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                    value={newProduct.categoryId} 
                    onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {localCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                    <div className="flex gap-2 justify-end">
                        <button onClick={handleAdd} className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-lg transition-colors"><Check size={20} /></button>
                        <button onClick={() => { setIsAdding(false); setImagePreview(''); }} className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition-colors"><X size={20} /></button>
                    </div>
                </td>
              </tr>
            )}
            
            {filteredProducts.length === 0 && !isAdding && (
                <tr>
                    <td colSpan={7} className="p-12 text-center text-[#8D6E63]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center">
                                <Package size={32} className="text-[#D7CCC8]" />
                            </div>
                            <p className="font-medium">
                              {searchTerm ? 'No products match your search' : 'No products in inventory'}
                            </p>
                            {!searchTerm && (
                              <button onClick={() => setIsAdding(true)} className="text-[#5D4037] hover:underline text-sm">Add your first product</button>
                            )}
                        </div>
                    </td>
                </tr>
            )}

            {paginatedProducts.map(product => (
              <tr key={product.id} className="border-b border-[#F0EBE0] hover:bg-[#FAFAFA] transition-colors group">
                {editingId === product.id ? (
                  <>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        {editImagePreview ? (
                          <img src={editImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[#E6E0D4]" />
                        ) : (
                          <div className="w-16 h-16 bg-[#FDFBF7] rounded-lg border border-[#E6E0D4] flex items-center justify-center">
                            <ImageIcon size={24} className="text-[#D7CCC8]" />
                          </div>
                        )}
                        <label className="cursor-pointer text-xs text-[#5D4037] hover:underline flex items-center gap-1">
                          <Upload size={14} />
                          Change
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(e, true)}
                          />
                        </label>
                      </div>
                    </td>
                    <td className="p-4"><input className="border border-[#D7CCC8] p-2 rounded w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                    <td className="p-4"><input className="border border-[#D7CCC8] p-2 rounded w-full" value={editForm.sku} onChange={e => setEditForm({...editForm, sku: e.target.value})} /></td>
                    <td className="p-4"><input className="border border-[#D7CCC8] p-2 rounded w-full" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} /></td>
                    <td className="p-4"><input className="border border-[#D7CCC8] p-2 rounded w-full" type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: parseFloat(e.target.value)})} /></td>
                    <td className="p-4">
                      <select 
                        className="border border-[#D7CCC8] p-2 rounded w-full" 
                        value={editForm.categoryId} 
                        onChange={e => setEditForm({...editForm, categoryId: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {localCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                        <div className="flex gap-2 justify-end">
                            <button onClick={saveEdit} className="bg-green-100 text-green-700 p-2 rounded-lg"><Check size={18} /></button>
                            <button onClick={() => { setEditingId(null); setEditImagePreview(''); }} className="bg-gray-100 text-gray-700 p-2 rounded-lg"><X size={18} /></button>
                        </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-[#E6E0D4]" />
                      ) : (
                        <div className="w-16 h-16 bg-[#FDFBF7] rounded-lg border border-[#E6E0D4] flex items-center justify-center">
                          <ImageIcon size={24} className="text-[#D7CCC8]" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-[#3E2723]">{product.name}</td>
                    <td className="p-4 text-[#8D6E63]">{product.sku}</td>
                    <td className="p-4 text-[#3E2723] font-bold">{formatCurrency(product.price)}</td>
                    <td className={clsx("p-4 font-medium", product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-orange-500" : "text-green-600")}>
                      <div className="flex items-center gap-2">
                        <span>{product.stock}</span>
                        {product.stock === 0 && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">OUT OF STOCK</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-[#8D6E63]"><span className="bg-[#FDFBF7] px-2 py-1 rounded border border-[#E6E0D4] text-xs">{product.category?.name || 'N/A'}</span></td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => startEdit(product)}
                            className="text-[#8D6E63] hover:text-[#5D4037] p-2 hover:bg-[#EFEBE0] rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(product.id, product.name)}
                            className="text-[#8D6E63] hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <p className="text-sm text-[#8D6E63]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors",
                  currentPage === page
                    ? "bg-[#5D4037] text-white"
                    : "border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7]"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, productId: '', productName: '' })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm.productName}"? This action cannot be undone and will remove the product from your inventory.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#5D4037] rounded-xl">
                  <Tag className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#3E2723]">Manage Categories</h2>
                  <p className="text-sm text-[#8D6E63]">Add and organize product categories</p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-[#8D6E63]" />
              </button>
            </div>

            {/* Add Category Form */}
            <div className="mb-6 p-4 bg-[#FDFBF7] rounded-xl border border-[#E6E0D4]">
              <h3 className="font-semibold text-[#5D4037] mb-4 flex items-center gap-2">
                <FolderPlus size={20} />
                Add New Category
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D4037] mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., Beverages, Snacks, Dairy"
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5D4037] mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Brief description of this category"
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037] resize-none"
                  />
                </div>
                <button
                  onClick={handleAddCategory}
                  disabled={loadingCategory}
                  className="w-full px-4 py-2 bg-[#5D4037] text-white rounded-xl hover:bg-[#4E342E] transition-colors disabled:opacity-50 font-medium"
                >
                  {loadingCategory ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div>
              <h3 className="font-semibold text-[#5D4037] mb-3">Existing Categories ({localCategories.length})</h3>
              {localCategories.length === 0 ? (
                <div className="text-center py-8 text-[#8D6E63]">
                  <Tag size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No categories yet. Add your first category above.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {localCategories.map((category) => {
                    const productCount = products.filter(p => p.categoryId === category.id).length;
                    
                    return (
                      <div
                        key={category.id}
                        className="p-3 bg-white border border-[#E6E0D4] rounded-xl hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#3E2723]">{category.name}</h4>
                            {category.description && (
                              <p className="text-sm text-[#8D6E63] mt-1">{category.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#FDFBF7] px-3 py-1 rounded-full text-[#8D6E63] border border-[#E6E0D4]">
                              {productCount} products
                            </span>
                            <button
                              onClick={() => setDeleteCategoryConfirm({ 
                                show: true, 
                                categoryId: category.id, 
                                categoryName: category.name 
                              })}
                              disabled={productCount > 0}
                              className={`p-2 rounded-lg transition-colors ${
                                productCount > 0
                                  ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                              title={productCount > 0 ? 'Cannot delete category with products' : 'Delete category'}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={deleteCategoryConfirm.show}
        onClose={() => setDeleteCategoryConfirm({ show: false, categoryId: '', categoryName: '' })}
        onConfirm={() => {
          handleDeleteCategory(deleteCategoryConfirm.categoryId);
          setDeleteCategoryConfirm({ show: false, categoryId: '', categoryName: '' });
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategoryConfirm.categoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};
