import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faPenToSquare, faCircleCheck, faBan } from '@fortawesome/free-solid-svg-icons';

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const subCategoryOptions = {
    'Áo': ['Áo Thun', 'Áo Polo', 'Áo Sơ Mi'],
    'Quần': ['Quần Nỉ', 'Quần Âu', 'Quần Short'],
    'Phụ kiện': ['Mũ', 'Balo', 'Túi Sách'],
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(backendUrl + '/api/product/upload', formData, { headers: { token } });
      if (res.data.success) {
        const imageUrl = res.data.imageUrl;
        const newImages = [...editData.image];
        newImages[index] = imageUrl;
        setEditData(prev => ({ ...prev, image: newImages }));
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Tải ảnh thất bại");
    }
  }

  const saveEdit = async (productId) => {
    try {
      const res = await axios.post(backendUrl + '/api/product/update', {
        productId,
        updatedData: editData
      }, { headers: { token } });

      if (res.data.success) {
        toast.success("Cập nhật thành công");
        setEditingId(null);
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi cập nhật");
    }
  };

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='p-4 pr-[32px] overflow-x-auto'>
      <p className='mb-4 font-semibold text-2xl'>Tất cả sản phẩm</p>
      <table className='w-full border border-gray-300 text-sm'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='p-2 border w-[332px]'>Image</th>
            <th className='p-2 border w-[332px]'>Name</th>
            <th className='p-4 border w-[200px]'>Description</th>
            <th className='p-2 border w-[120px]'>Category</th>
            <th className='p-2 border w-[120px]'>SubCategory</th>
            <th className='p-2 border w-[100px]'>Price</th>
            <th className='p-2 border w-[80px]'>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index} className='border-t h-[108px] align-middle'>
              <td className="p-2 border align-middle leading-none text-center">
                <div className="grid grid-cols-4 gap-1 justify-center items-center">
                  {editingId === item._id
                    ? editData.image?.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 mx-auto">
                        <img
                          src={img || assets.upload_area}
                          alt=""
                          className="w-full h-full object-cover block"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleImageUpload(e, i)}
                        />
                      </div>
                    ))
                    : item.image?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-16 h-16 object-cover block mx-auto"
                      />
                    ))}
                </div>
              </td>

              <td className='p-2 border'>
                {editingId === item._id ? (
                  <textarea
                    className="w-full border border-gray-300 rounded p-1 text-sm resize-y"
                    rows={2}
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : (
                  <p className="whitespace-pre-wrap break-words">{item.name}</p>
                )}
              </td>

              <td className='p-2 border'>
                {editingId === item._id ? (
                  <textarea
                    rows={3}
                    className="w-full bg-transparent border border-gray-300 p-1 text-sm resize-y"
                    value={editData.description || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  />
                ) : (
                  <p className="whitespace-pre-wrap break-words text-gray-800">{item.description}</p>
                )}
              </td>

              <td className='p-2 border text-center'>
                {editingId === item._id ? (
                  <select
                    className="w-[100px] border border-gray-300 rounded p-1 text-sm"
                    value={editData.category}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      const defaultSub = subCategoryOptions[selectedCategory]?.[0] || '';
                      setEditData(prev => ({
                        ...prev,
                        category: selectedCategory,
                        subCategory: defaultSub
                      }));
                    }}
                  >
                    <option value="Áo">Áo</option>
                    <option value="Quần">Quần</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                  </select>
                ) : (
                  <p>{item.category}</p>
                )}
              </td>

              <td className='p-2 border text-center'>
                {editingId === item._id ? (
                  <select
                    className="w-[120px] border border-gray-300 rounded p-1 text-sm"
                    value={editData.subCategory}
                    onChange={(e) =>
                      setEditData(prev => ({ ...prev, subCategory: e.target.value }))
                    }
                  >
                    {(subCategoryOptions[editData.category] || []).map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                ) : (
                  <p>{item.subCategory}</p>
                )}
              </td>

              <td className='p-2 border text-center'>
                <input
                  type="number"
                  className='w-full bg-transparent border-b border-gray-300 disabled:border-none text-center'
                  value={editingId === item._id ? editData.price : item.price}
                  disabled={editingId !== item._id}
                  onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
                />
              </td>

              <td className="p-2 border text-center align-middle">
                {editingId === item._id ? (
                  <div className="flex justify-center items-center gap-2">
                    <FontAwesomeIcon onClick={() => saveEdit(item._id)} icon={faCircleCheck} className='text-green-500 text-2xl' />
                    <FontAwesomeIcon onClick={() => setEditingId(null)} icon={faBan} className='text-red-500 text-2xl' />
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-2">
                    <FontAwesomeIcon onClick={() => {
                      setEditingId(item._id);
                      setEditData(item);
                    }} icon={faPenToSquare} className='text-blue-500 text-2xl' />
                    <FontAwesomeIcon onClick={() => removeProduct(item._id)} icon={faDeleteLeft} className='text-red-500 text-2xl' />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default List
