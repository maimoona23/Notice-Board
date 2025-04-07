import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Notice, getNotices, createNotice, deleteNotice } from '../lib/api';

export default function NoticeBoard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const notice = await createNotice(newNotice);
      setNotices([notice, ...notices]);
      setNewNotice({ title: '', content: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await deleteNotice(id);
      setNotices(notices.filter(notice => notice._id !== id));
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const canCreateNotice = ['admin', 'teacher'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      {canCreateNotice && (
        <div className="bg-white rounded-lg shadow p-6">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="h-5 w-5" />
              Create New Notice
            </button>
          ) : (
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Post Notice
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notices.map((notice) => (
          <div
            key={notice._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                {(user?.role === 'admin' || user?.id === notice.createdBy._id) && (
                  <button
                    onClick={() => handleDeleteNotice(notice._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap">{notice.content}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Posted by {notice.createdBy.fullName} ({notice.createdBy.role})
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(notice.createdAt), 'PPP')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}