import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Edit, Trash2, Check, X, Package, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    sku: '', 
    price: 0, 
    stock: 0, 
    category: '',
    image: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    sku: '', 
    price: 0, 
    stock: 0, 
    category: '',
    image: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; productId: string; productName: string }>({
    show: false,
    productId: '',
    productName: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  // Real-time search filtering
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const search = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
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
    if (!newProduct.name || !newProduct.price) {
        toast.error('Name and Price are required');
        return;
    }
    
    addProduct({
      name: newProduct.name,
      sku: newProduct.sku,
      price: newProduct.price,
      stock: newProduct.stock,
      category: newProduct.category || 'General',
      image: newProduct.image || '',
      description: '',
      taxExempt: false
    });
    setIsAdding(false);
    setNewProduct({ name: '', sku: '', price: 0, stock: 0, category: '', image: '' });
    setImagePreview('');
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || ''
    });
    setEditImagePreview(product.image || '');
  };

  const saveEdit = () => {
    if (editingId) {
      updateProduct(editingId, editForm);
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
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#5D4037] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4E342E] transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={20} />
          Add Product
        </button>
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
                  <input 
                    className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                    placeholder="Category" 
                    value={newProduct.category} 
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                  />
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
                    <td className="p-4"><input className="border border-[#D7CCC8] p-2 rounded w-full" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} /></td>
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
                    <td className="p-4 text-[#3E2723] font-bold">GH₵{product.price.toFixed(2)}</td>
                    <td className={clsx("p-4 font-medium", product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-orange-500" : "text-green-600")}>
                      <div className="flex items-center gap-2">
                        <span>{product.stock}</span>
                        {product.stock === 0 && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">OUT OF STOCK</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-[#8D6E63]"><span className="bg-[#FDFBF7] px-2 py-1 rounded border border-[#E6E0D4] text-xs">{product.category}</span></td>
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
    </div>
  );
};
