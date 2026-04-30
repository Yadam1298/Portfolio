// app/admin/page.js - Modern Dark Theme Dashboard with Sidebar Menu
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [newItem, setNewItem] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [educationForm, setEducationForm] = useState({
    level: 'Bachelor',
    schoolName: '',
    department: '',
    score: '',
  });
  const [editingEducationIndex, setEditingEducationIndex] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [localData, setLocalData] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [editTechInput, setEditTechInput] = useState('');
  const [editTechIndex, setEditTechIndex] = useState(null);

  const [editingCertificate, setEditingCertificate] = useState(null);
  const [localCertData, setLocalCertData] = useState([]);

  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [localTestimonialData, setLocalTestimonialData] = useState([]);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesStats, setMessagesStats] = useState({ total: 0, unread: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [editingInternship, setEditingInternship] = useState(null);
  const [localInternData, setLocalInternData] = useState([]);
  const [internTechInput, setInternTechInput] = useState('');
  const [editInternTechInput, setEditInternTechInput] = useState('');
  const [editInternTechIndex, setEditInternTechIndex] = useState(null);
  // Sync local data
  useEffect(() => {
    if (Array.isArray(data)) {
      setLocalTestimonialData(data);
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setLocalInternData(data);
    }
  }, [data]);

  // Sync local data
  useEffect(() => {
    if (Array.isArray(data)) {
      setLocalCertData(data);
    }
  }, [data]);
  // Fetch data when tab changes
  useEffect(() => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');

    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setLocalData(data);
    }
  }, [data]);

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchData = async () => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');

    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Special handling for about tab
      let endpoint = `/api/admin/${activeTab}`;
      if (activeTab === 'about') {
        endpoint = '/api/admin/about';
      }

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch ${activeTab} data`);
      }

      const result = await res.json();

      // For skills, projects, certificates, testimonials - they should be arrays
      if (
        activeTab === 'skills' ||
        activeTab === 'projects' ||
        activeTab === 'certificates' ||
        activeTab === 'testimonials' ||
        activeTab === 'internships'
      ) {
        setData(Array.isArray(result) ? result : []);
      } else {
        setData(result || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default empty state based on tab
      if (
        activeTab === 'skills' ||
        activeTab === 'projects' ||
        activeTab === 'certificates' ||
        activeTab === 'testimonials' ||
        activeTab === 'internships'
      ) {
        setData([]);
      } else {
        setData({});
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

  const saveData = async (updatedData) => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert('✨ Saved successfully!');
        await fetchData();
      } else {
        const error = await res.json();
        alert(`Failed to save: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        alert('✅ Added successfully!');
        setNewItem({});
        await fetchData();
      } else {
        alert('Failed to add');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('🗑️ Deleted successfully!');
        await fetchData();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, updatedData) => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updatedData }),
      });

      if (res.ok) {
        alert('💾 Updated successfully!');
        await fetchData();
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    setMessagesLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_token');
        router.push('/login');
        return;
      }
      const data = await res.json();
      setMessages(data.messages || []);
      const unreadCount = (data.messages || []).filter((m) => !m.read).length;
      setMessagesStats({ total: data.total || 0, unread: unreadCount });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Add this function to mark message as read
  const markAsRead = async (messageId) => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageId, read: true }),
      });
      if (res.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Add this function to delete message
  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/messages?id=${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('Message deleted successfully!');
        await fetchMessages();
        if (selectedMessage?._id === messageId) setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'about',
      label: 'About',
      icon: '👤',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '🚀',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'internships',
      label: 'Internships',
      icon: '💼',
      color: 'from-teal-500 to-green-500',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: '🎓',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: '💬',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '📧',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const renderHomeEditor = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Profile Information
        </h2>
        <p className="text-gray-400 mt-2">
          Customize your profile and social links
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Picture */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profile Picture URL
          </label>
          <input
            type="text"
            placeholder="https://example.com/profile-pic.jpg"
            value={data.pictureLink || ''}
            onChange={(e) => setData({ ...data, pictureLink: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
          />
          {data.pictureLink && (
            <div className="mt-3 flex justify-center">
              <img
                src={data.pictureLink}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={data.fullName || ''}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
          />
        </div>

        {/* Aspirings Array */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Aspirings / Roles (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g., Full Stack Developer, Software Engineer, UI/UX Designer"
            value={data.aspirings ? data.aspirings.join(', ') : ''}
            onChange={(e) =>
              setData({
                ...data,
                aspirings: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter((s) => s),
              })
            }
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            These will be displayed as your professional roles/titles
          </p>
        </div>

        {/* Description Array */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>

          <div className="relative">
            <textarea
              placeholder="e.g., 5+ years experience, MERN Stack Expert, B.S. Computer Science..."
              value={data.description || ''}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              rows={4}
              className="
        w-full px-4 py-3 rounded-xl
        bg-gray-900/60 border border-gray-700
        text-white placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-300
        resize-none
      "
              maxLength={5000}
            />

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent focus-within:border-blue-500/40"></div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>These will be displayed as info cards</span>
            <span>{(data.description || '').length}/5000</span>
          </div>
        </div>

        {/* Resume Link */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Resume Link (PDF/DOC)
          </label>
          <input
            type="text"
            placeholder="https://example.com/resume.pdf"
            value={data.resumeLink || ''}
            onChange={(e) => setData({ ...data, resumeLink: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
          />
        </div>

        {/* Social Links Section */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 mt-4">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> Social Links
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>💚</span> WhatsApp Link
              </label>
              <input
                type="text"
                placeholder="https://wa.me/1234567890"
                value={data.socialLinks?.whatsapp || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialLinks: {
                      ...data.socialLinks,
                      whatsapp: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>🔵</span> LinkedIn URL
              </label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/username"
                value={data.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialLinks: {
                      ...data.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>🐙</span> GitHub URL
              </label>
              <input
                type="text"
                placeholder="https://github.com/username"
                value={data.socialLinks?.github || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialLinks: {
                      ...data.socialLinks,
                      github: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>✉️</span> Email ID
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={data.socialLinks?.mailId || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socialLinks: {
                      ...data.socialLinks,
                      mailId: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {(data.pictureLink || data.fullName || data.aspirings?.length > 0) && (
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/30 mt-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              👀 Live Preview
            </h3>
            <div className="flex flex-col items-center text-center space-y-3">
              {data.pictureLink && (
                <img
                  src={data.pictureLink}
                  alt={data.fullName || 'Profile'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
              )}
              {data.fullName && (
                <h4 className="text-2xl font-bold text-white">
                  {data.fullName}
                </h4>
              )}
              {data.aspirings && data.aspirings.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.aspirings.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
              {data.description || 'description'}
              <br />
              <br />
              {data.resumeLink || 'Resume link'}
              <br />
              <br />
              {data.socialLinks?.whatsapp || 'Whatsapp link'}
              <br />
              <br />
              {data.socialLinks?.linkedin || 'Whatsapp link'}
              <br />
              <br />
              {data.socialLinks?.mailId || 'Whatsapp link'}
              <br />
              <br />
              {data.socialLinks?.github || 'Whatsapp link'}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => saveData(data)}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-blue-500/25"
      >
        {loading ? 'Saving...' : '💾 Save Profile Changes'}
      </button>
    </div>
  );

  const renderAboutEditor = () => {
    const handleAddEducation = () => {
      if (!educationForm.schoolName || !educationForm.score) {
        alert('Please fill in school name and score');
        return;
      }

      const updatedEducation = [...(data.education || [])];
      if (editingEducationIndex !== null) {
        updatedEducation[editingEducationIndex] = { ...educationForm };
        setEditingEducationIndex(null);
      } else {
        updatedEducation.push({ ...educationForm });
      }

      setData({ ...data, education: updatedEducation });
      setEducationForm({
        level: 'Bachelor',
        schoolName: '',
        department: '',
        score: '',
      });
    };

    const handleEditEducation = (index) => {
      const edu = data.education[index];
      setEducationForm({
        level: edu.level || 'Bachelor',
        schoolName: edu.schoolName || '',
        department: edu.department || '',
        score: edu.score || '',
      });
      setEditingEducationIndex(index);
    };

    const handleDeleteEducation = (index) => {
      const updatedEducation = (data.education || []).filter(
        (_, i) => i !== index,
      );
      setData({ ...data, education: updatedEducation });
      if (editingEducationIndex === index) {
        setEditingEducationIndex(null);
        setEducationForm({
          level: 'Bachelor',
          schoolName: '',
          department: '',
          score: '',
        });
      }
    };

    const handleAddSkill = () => {
      if (newSkill.trim()) {
        const updatedSkills = [...(data.skills || []), newSkill.trim()];
        setData({ ...data, skills: updatedSkills });
        setNewSkill('');
      }
    };

    const handleRemoveSkill = (index) => {
      const updatedSkills = (data.skills || []).filter((_, i) => i !== index);
      setData({ ...data, skills: updatedSkills });
    };

    const handleAddInterest = () => {
      if (newInterest.trim()) {
        const updatedInterests = [
          ...(data.interests || []),
          newInterest.trim(),
        ];
        setData({ ...data, interests: updatedInterests });
        setNewInterest('');
      }
    };

    const handleRemoveInterest = (index) => {
      const updatedInterests = (data.interests || []).filter(
        (_, i) => i !== index,
      );
      setData({ ...data, interests: updatedInterests });
    };

    const handleAddHobby = () => {
      if (newHobby.trim()) {
        const updatedHobbies = [...(data.hobbies || []), newHobby.trim()];
        setData({ ...data, hobbies: updatedHobbies });
        setNewHobby('');
      }
    };

    const handleRemoveHobby = (index) => {
      const updatedHobbies = (data.hobbies || []).filter((_, i) => i !== index);
      setData({ ...data, hobbies: updatedHobbies });
    };

    const saveAboutData = async () => {
      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);
      try {
        const res = await fetch('/api/admin/about', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server response:', errorText);
          throw new Error(`Failed to save: ${res.status}`);
        }

        const result = await res.json();
        alert('✨ Saved successfully!');
        setData(result);
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            About Section
          </h2>
          <p className="text-gray-400 mt-2">
            Tell your story and showcase your background
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Image URL
            </label>
            <input
              type="text"
              placeholder="Enter profile image URL"
              value={data.profileImage || ''}
              onChange={(e) =>
                setData({ ...data, profileImage: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
            />
            {data.profileImage && (
              <div className="mt-3">
                <img
                  src={data.profileImage}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-emerald-500"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter your title (e.g., Full Stack Developer)"
              value={data.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
            />
          </div>

          {/* Bio Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio Description
            </label>
            <textarea
              placeholder="Tell your story..."
              value={data.description || ''}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
              rows="6"
            />
          </div>

          {/* Birth Date and Nationality */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={
                  data.birthDate
                    ? new Date(data.birthDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setData({ ...data, birthDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nationality
              </label>
              <input
                type="text"
                placeholder="Your nationality"
                value={data.nationality || ''}
                onChange={(e) =>
                  setData({ ...data, nationality: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-2xl p-6 border border-emerald-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              🎓 Education
            </h3>

            {/* Education Form */}
            <div className="space-y-4 mb-6">
              <select
                value={educationForm.level}
                onChange={(e) =>
                  setEducationForm({ ...educationForm, level: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
              >
                <option value="10th">10th Standard</option>
                <option value="12th">12th Standard</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>

              <input
                type="text"
                placeholder="School/College Name"
                value={educationForm.schoolName}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    schoolName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
              />

              <input
                type="text"
                placeholder="Department/Field of Study"
                value={educationForm.department}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    department: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
              />

              <input
                type="text"
                placeholder="Score/CGPA/Percentage"
                value={educationForm.score}
                onChange={(e) =>
                  setEducationForm({ ...educationForm, score: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
              />

              <button
                onClick={handleAddEducation}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
              >
                {editingEducationIndex !== null
                  ? '✏️ Update Education'
                  : '➕ Add Education'}
              </button>
            </div>

            {/* Education List */}
            <div className="space-y-3">
              {data.education && data.education.length > 0 ? (
                data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {edu.level}
                        </h4>
                        <p className="text-emerald-400">{edu.schoolName}</p>
                        {edu.department && (
                          <p className="text-gray-300 text-sm">
                            {edu.department}
                          </p>
                        )}
                        <p className="text-gray-400 text-sm">
                          Score: {edu.score}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEducation(index)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-800/30 rounded-xl">
                  <p className="text-gray-400">No education added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              ⚡ Skills
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a skill (e.g., React, Python)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
              />
              <button
                onClick={handleAddSkill}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills && data.skills.length > 0 ? (
                data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/30 text-purple-300 rounded-full text-sm border border-purple-500/50"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              💡 Interests
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add an interest (e.g., Reading, Traveling)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button
                onClick={handleAddInterest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.interests && data.interests.length > 0 ? (
                data.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/30 text-blue-300 rounded-full text-sm border border-blue-500/50"
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(index)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No interests added yet</p>
              )}
            </div>
          </div>

          {/* Hobbies Section */}
          <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              🎯 Hobbies
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a hobby (e.g., Chess, Photography)"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white"
              />
              <button
                onClick={handleAddHobby}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.hobbies && data.hobbies.length > 0 ? (
                data.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/30 text-orange-300 rounded-full text-sm border border-orange-500/50"
                  >
                    {hobby}
                    <button
                      onClick={() => handleRemoveHobby(index)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No hobbies added yet</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={saveAboutData}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-emerald-500/25"
        >
          {loading ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>
    );
  };

  const renderProjectsEditor = () => {
    const handleAddProject = async () => {
      if (!newItem.projectTitle || !newItem.description) {
        alert('Please fill in project title and description');
        return;
      }

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectTitle: newItem.projectTitle,
            description: newItem.description,
            technologies: newItem.technologies || [],
            gitrepoLink: newItem.gitrepoLink || '',
            abstractLink: newItem.abstractLink || '',
            liveDemoVideoLink: newItem.liveDemoVideoLink || '',
            featured: newItem.featured || false,
          }),
        });

        if (res.ok) {
          alert('✅ Project added successfully!');
          setNewItem({
            projectTitle: '',
            description: '',
            technologies: [],
            gitrepoLink: '',
            abstractLink: '',
            liveDemoVideoLink: '',
            featured: false,
          });
          setTechInput('');
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to add: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project');
      } finally {
        setLoading(false);
      }
    };

    const handleAddTechnology = () => {
      if (techInput.trim()) {
        const updatedTechs = [
          ...(newItem.technologies || []),
          techInput.trim(),
        ];
        setNewItem({ ...newItem, technologies: updatedTechs });
        setTechInput('');
      }
    };

    const handleRemoveTechnology = (indexToRemove) => {
      const updatedTechs = (newItem.technologies || []).filter(
        (_, index) => index !== indexToRemove,
      );
      setNewItem({ ...newItem, technologies: updatedTechs });
    };

    const handleAddEditTechnology = () => {
      if (editTechInput.trim() && editTechIndex !== null) {
        const updated = localData.map((p) =>
          p._id === editingProject
            ? {
                ...p,
                technologies: (p.technologies || []).map((tech, idx) =>
                  idx === editTechIndex ? editTechInput.trim() : tech,
                ),
              }
            : p,
        );
        setLocalData(updated);
        setEditTechInput('');
        setEditTechIndex(null);
      }
    };

    const handleAddNewEditTechnology = () => {
      if (editTechInput.trim() && editingProject) {
        const updated = localData.map((p) =>
          p._id === editingProject
            ? {
                ...p,
                technologies: [...(p.technologies || []), editTechInput.trim()],
              }
            : p,
        );
        setLocalData(updated);
        setEditTechInput('');
      }
    };

    const handleRemoveEditTechnology = (indexToRemove) => {
      const updated = localData.map((p) =>
        p._id === editingProject
          ? {
              ...p,
              technologies: (p.technologies || []).filter(
                (_, index) => index !== indexToRemove,
              ),
            }
          : p,
      );
      setLocalData(updated);
    };

    const handleUpdateProject = async (id, updatedProject) => {
      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, ...updatedProject }),
        });

        if (res.ok) {
          alert('💾 Project updated successfully!');
          setEditingProject(null);
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to update: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating project:', error);
        alert('Error updating project');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteProject = async (id) => {
      if (!confirm('Are you sure you want to delete this project?')) return;

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/projects?id=${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert('🗑️ Project deleted successfully!');
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to delete: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Projects Portfolio
          </h2>
          <p className="text-gray-400 mt-2">Showcase your best work</p>
        </div>

        {/* Add New Project Form */}
        <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl p-6 border border-orange-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">
            ✨ Add New Project
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project Title *"
              value={newItem.projectTitle || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, projectTitle: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
            />

            <textarea
              placeholder="Description *"
              value={newItem.description || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
              rows="3"
            />

            {/* Technologies Management */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Technologies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add technology (e.g., React, Node.js)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                />
                <button
                  onClick={handleAddTechnology}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                >
                  + Add
                </button>
              </div>

              {/* Technologies Tags */}
              {newItem.technologies && newItem.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-800/30 rounded-lg">
                  {newItem.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/40 text-orange-300 rounded-lg text-sm border border-orange-500/50 group"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => handleRemoveTechnology(idx)}
                        className="hover:text-red-400 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Git Repository Link"
              value={newItem.gitrepoLink || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, gitrepoLink: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Abstract / Documentation Link"
              value={newItem.abstractLink || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, abstractLink: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Live Demo Video Link (YouTube, Vimeo, etc.)"
              value={newItem.liveDemoVideoLink || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, liveDemoVideoLink: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
            />

            <label className="flex items-center gap-3 text-gray-300">
              <input
                type="checkbox"
                checked={newItem.featured || false}
                onChange={(e) =>
                  setNewItem({ ...newItem, featured: e.target.checked })
                }
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              ⭐ Featured Project
            </label>

            <button
              onClick={handleAddProject}
              disabled={
                loading || !newItem.projectTitle || !newItem.description
              }
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : '✨ Add Project'}
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            📁 Your Projects ({localData.length})
          </h3>

          {localData.length === 0 && (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl">
              <p className="text-gray-400">
                No projects added yet. Add your first project above!
              </p>
            </div>
          )}

          {localData.map((project) => (
            <div
              key={project._id}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
            >
              {editingProject === project._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={project.projectTitle || ''}
                    onChange={(e) => {
                      const updated = localData.map((p) =>
                        p._id === project._id
                          ? { ...p, projectTitle: e.target.value }
                          : p,
                      );
                      setLocalData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <textarea
                    placeholder="Description"
                    value={project.description || ''}
                    onChange={(e) => {
                      const updated = localData.map((p) =>
                        p._id === project._id
                          ? { ...p, description: e.target.value }
                          : p,
                      );
                      setLocalData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    rows="3"
                  />

                  {/* Edit Technologies Management */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Technologies
                    </label>

                    {/* Current Technologies */}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-800/30 rounded-lg">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/40 text-orange-300 rounded-lg text-sm border border-orange-500/50"
                            >
                              <span>{tech}</span>
                              <button
                                onClick={() => {
                                  setEditTechInput(tech);
                                  setEditTechIndex(idx);
                                }}
                                className="hover:text-blue-400 transition-colors"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleRemoveEditTechnology(idx)}
                                className="hover:text-red-400 transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Edit/Create Technology Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={
                          editTechIndex !== null
                            ? 'Edit technology...'
                            : 'Add new technology...'
                        }
                        value={editTechInput}
                        onChange={(e) => setEditTechInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (editTechIndex !== null) {
                              handleAddEditTechnology();
                            } else {
                              handleAddNewEditTechnology();
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      />
                      {editTechIndex !== null ? (
                        <>
                          <button
                            onClick={handleAddEditTechnology}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              setEditTechInput('');
                              setEditTechIndex(null);
                            }}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleAddNewEditTechnology}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Git Repo Link"
                    value={project.gitrepoLink || ''}
                    onChange={(e) => {
                      const updated = localData.map((p) =>
                        p._id === project._id
                          ? { ...p, gitrepoLink: e.target.value }
                          : p,
                      );
                      setLocalData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Abstract Link"
                    value={project.abstractLink || ''}
                    onChange={(e) => {
                      const updated = localData.map((p) =>
                        p._id === project._id
                          ? { ...p, abstractLink: e.target.value }
                          : p,
                      );
                      setLocalData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Live Demo Video Link"
                    value={project.liveDemoVideoLink || ''}
                    onChange={(e) => {
                      const updated = localData.map((p) =>
                        p._id === project._id
                          ? { ...p, liveDemoVideoLink: e.target.value }
                          : p,
                      );
                      setLocalData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={project.featured || false}
                      onChange={(e) => {
                        const updated = localData.map((p) =>
                          p._id === project._id
                            ? { ...p, featured: e.target.checked }
                            : p,
                        );
                        setLocalData(updated);
                      }}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    ⭐ Featured Project
                  </label>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdateProject(project._id, {
                          projectTitle: project.projectTitle,
                          description: project.description,
                          technologies: project.technologies,
                          gitrepoLink: project.gitrepoLink,
                          abstractLink: project.abstractLink,
                          liveDemoVideoLink: project.liveDemoVideoLink,
                          featured: project.featured,
                        })
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setEditTechInput('');
                        setEditTechIndex(null);
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {project.projectTitle}
                        {project.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                            ⭐ Featured
                          </span>
                        )}
                      </h4>

                      <p className="text-gray-300 mb-3">
                        {project.description}
                      </p>

                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded-md text-xs flex items-center gap-1"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="space-y-1 text-sm">
                        {project.gitrepoLink && (
                          <p className="text-gray-400">
                            🔗 Git Repo:{' '}
                            <a
                              href={project.gitrepoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline break-all"
                            >
                              {project.gitrepoLink}
                            </a>
                          </p>
                        )}
                        {project.abstractLink && (
                          <p className="text-gray-400">
                            📄 Abstract:{' '}
                            <a
                              href={project.abstractLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline break-all"
                            >
                              View Document
                            </a>
                          </p>
                        )}
                        {project.liveDemoVideoLink && (
                          <p className="text-gray-400">
                            🎥 Live Demo:{' '}
                            <a
                              href={project.liveDemoVideoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline break-all"
                            >
                              Watch Video
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingProject(project._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInternshipsEditor = () => {
    const handleAddInternship = async () => {
      if (
        !newItem.company ||
        !newItem.role ||
        !newItem.duration ||
        !newItem.description
      ) {
        alert('Please fill in company, role, duration, and description');
        return;
      }

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/internships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company: newItem.company,
            role: newItem.role,
            duration: newItem.duration,
            description: newItem.description,
            technologies: newItem.technologies || [],
            certificateLink: newItem.certificateLink || '',
            companyLogoUrl: newItem.companyLogoUrl || '',
            featured: newItem.featured || false,
          }),
        });

        if (res.ok) {
          alert('✅ Internship added successfully!');
          setNewItem({
            company: '',
            role: '',
            duration: '',
            description: '',
            technologies: [],
            certificateLink: '',
            companyLogoUrl: '',
            featured: false,
          });
          setInternTechInput('');
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to add: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error adding internship:', error);
        alert('Error adding internship');
      } finally {
        setLoading(false);
      }
    };

    const handleAddTechnology = () => {
      if (internTechInput.trim()) {
        const updatedTechs = [
          ...(newItem.technologies || []),
          internTechInput.trim(),
        ];
        setNewItem({ ...newItem, technologies: updatedTechs });
        setInternTechInput('');
      }
    };

    const handleRemoveTechnology = (indexToRemove) => {
      const updatedTechs = (newItem.technologies || []).filter(
        (_, index) => index !== indexToRemove,
      );
      setNewItem({ ...newItem, technologies: updatedTechs });
    };

    const handleAddEditTechnology = () => {
      if (editInternTechInput.trim() && editInternTechIndex !== null) {
        const updated = localInternData.map((i) =>
          i._id === editingInternship
            ? {
                ...i,
                technologies: (i.technologies || []).map((tech, idx) =>
                  idx === editInternTechIndex
                    ? editInternTechInput.trim()
                    : tech,
                ),
              }
            : i,
        );
        setLocalInternData(updated);
        setEditInternTechInput('');
        setEditInternTechIndex(null);
      }
    };

    const handleAddNewEditTechnology = () => {
      if (editInternTechInput.trim() && editingInternship) {
        const updated = localInternData.map((i) =>
          i._id === editingInternship
            ? {
                ...i,
                technologies: [
                  ...(i.technologies || []),
                  editInternTechInput.trim(),
                ],
              }
            : i,
        );
        setLocalInternData(updated);
        setEditInternTechInput('');
      }
    };

    const handleRemoveEditTechnology = (indexToRemove) => {
      const updated = localInternData.map((i) =>
        i._id === editingInternship
          ? {
              ...i,
              technologies: (i.technologies || []).filter(
                (_, index) => index !== indexToRemove,
              ),
            }
          : i,
      );
      setLocalInternData(updated);
    };

    const handleUpdateInternship = async (id, updatedInternship) => {
      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/internships', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, ...updatedInternship }),
        });

        if (res.ok) {
          alert('💾 Internship updated successfully!');
          setEditingInternship(null);
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to update: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating internship:', error);
        alert('Error updating internship');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteInternship = async (id) => {
      if (!confirm('Are you sure you want to delete this internship?')) return;

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/internships?id=${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          alert('🗑️ Internship deleted successfully!');
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to delete: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting internship:', error);
        alert('Error deleting internship');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent">
            Internships Experience
          </h2>
          <p className="text-gray-400 mt-2">
            Showcase your professional internships
          </p>
        </div>

        {/* Add New Internship Form */}
        <div className="bg-gradient-to-br from-teal-900/20 to-green-900/20 rounded-2xl p-6 border border-teal-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">
            ✨ Add New Internship
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Company Name *"
              value={newItem.company || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, company: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Role / Position *"
              value={newItem.role || ''}
              onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Duration (e.g., June 2023 - August 2023) *"
              value={newItem.duration || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, duration: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
            />

            <textarea
              placeholder="Description *"
              value={newItem.description || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
              rows="3"
            />

            {/* Technologies Management */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Technologies Used
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add technology (e.g., React, Node.js)"
                  value={internTechInput}
                  onChange={(e) => setInternTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
                />
                <button
                  onClick={handleAddTechnology}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                >
                  + Add
                </button>
              </div>

              {newItem.technologies && newItem.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-800/30 rounded-lg">
                  {newItem.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-600/40 text-teal-300 rounded-lg text-sm border border-teal-500/50"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => handleRemoveTechnology(idx)}
                        className="hover:text-red-400 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Certificate Link (URL)"
              value={newItem.certificateLink || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, certificateLink: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Company Logo URL"
              value={newItem.companyLogoUrl || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, companyLogoUrl: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500"
            />

            {newItem.companyLogoUrl && (
              <div className="mt-2 p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Logo Preview:</p>
                <img
                  src={newItem.companyLogoUrl}
                  alt="Company Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}

            <label className="flex items-center gap-3 text-gray-300">
              <input
                type="checkbox"
                checked={newItem.featured || false}
                onChange={(e) =>
                  setNewItem({ ...newItem, featured: e.target.checked })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              ⭐ Featured Internship
            </label>

            <button
              onClick={handleAddInternship}
              disabled={
                loading ||
                !newItem.company ||
                !newItem.role ||
                !newItem.duration ||
                !newItem.description
              }
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : '✨ Add Internship'}
            </button>
          </div>
        </div>

        {/* Internships List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            📁 Your Internships ({localInternData.length})
          </h3>

          {localInternData.length === 0 && (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl">
              <p className="text-gray-400">
                No internships added yet. Add your first internship above!
              </p>
            </div>
          )}

          {localInternData.map((internship) => (
            <div
              key={internship._id}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500/50 transition-all duration-300"
            >
              {editingInternship === internship._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={internship.company || ''}
                    onChange={(e) => {
                      const updated = localInternData.map((i) =>
                        i._id === internship._id
                          ? { ...i, company: e.target.value }
                          : i,
                      );
                      setLocalInternData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Role"
                    value={internship.role || ''}
                    onChange={(e) => {
                      const updated = localInternData.map((i) =>
                        i._id === internship._id
                          ? { ...i, role: e.target.value }
                          : i,
                      );
                      setLocalInternData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={internship.duration || ''}
                    onChange={(e) => {
                      const updated = localInternData.map((i) =>
                        i._id === internship._id
                          ? { ...i, duration: e.target.value }
                          : i,
                      );
                      setLocalInternData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <textarea
                    placeholder="Description"
                    value={internship.description || ''}
                    onChange={(e) => {
                      const updated = localInternData.map((i) =>
                        i._id === internship._id
                          ? { ...i, description: e.target.value }
                          : i,
                      );
                      setLocalInternData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    rows="3"
                  />

                  {/* Edit Technologies Management */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Technologies
                    </label>

                    {internship.technologies &&
                      internship.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-800/30 rounded-lg">
                          {internship.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-600/40 text-teal-300 rounded-lg text-sm border border-teal-500/50"
                            >
                              <span>{tech}</span>
                              <button
                                onClick={() => {
                                  setEditInternTechInput(tech);
                                  setEditInternTechIndex(idx);
                                }}
                                className="hover:text-blue-400 transition-colors"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleRemoveEditTechnology(idx)}
                                className="hover:text-red-400 transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={
                          editInternTechIndex !== null
                            ? 'Edit technology...'
                            : 'Add new technology...'
                        }
                        value={editInternTechInput}
                        onChange={(e) => setEditInternTechInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (editInternTechIndex !== null) {
                              handleAddEditTechnology();
                            } else {
                              handleAddNewEditTechnology();
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      />
                      {editInternTechIndex !== null ? (
                        <>
                          <button
                            onClick={handleAddEditTechnology}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              setEditInternTechInput('');
                              setEditInternTechIndex(null);
                            }}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleAddNewEditTechnology}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Certificate Link"
                    value={internship.certificateLink || ''}
                    onChange={(e) => {
                      const updated = localInternData.map((i) =>
                        i._id === internship._id
                          ? { ...i, certificateLink: e.target.value }
                          : i,
                      );
                      setLocalInternData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Company Logo URL"
                    value={internship.companyLogoUrl || ''}
                    onChange={(e) => {
                      const updated = localInternData.map((i) =>
                        i._id === internship._id
                          ? { ...i, companyLogoUrl: e.target.value }
                          : i,
                      );
                      setLocalInternData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={internship.featured || false}
                      onChange={(e) => {
                        const updated = localInternData.map((i) =>
                          i._id === internship._id
                            ? { ...i, featured: e.target.checked }
                            : i,
                        );
                        setLocalInternData(updated);
                      }}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    ⭐ Featured Internship
                  </label>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdateInternship(internship._id, {
                          company: internship.company,
                          role: internship.role,
                          duration: internship.duration,
                          description: internship.description,
                          technologies: internship.technologies,
                          certificateLink: internship.certificateLink,
                          companyLogoUrl: internship.companyLogoUrl,
                          featured: internship.featured,
                        })
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingInternship(null);
                        setEditInternTechInput('');
                        setEditInternTechIndex(null);
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex gap-4">
                      {internship.companyLogoUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={internship.companyLogoUrl}
                            alt={internship.company}
                            className="w-16 h-16 object-contain rounded-lg bg-gray-800/50 p-2"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-1">
                          {internship.company}
                          {internship.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                              ⭐ Featured
                            </span>
                          )}
                        </h4>
                        <p className="text-teal-400 mb-1 font-medium">
                          {internship.role}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">
                          {internship.duration}
                        </p>
                        <p className="text-gray-300 mb-3">
                          {internship.description}
                        </p>

                        {internship.technologies &&
                          internship.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {internship.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-teal-600/30 text-teal-300 rounded-md text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                        {internship.certificateLink && (
                          <a
                            href={internship.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
                          >
                            🎓 View Certificate
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingInternship(internship._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInternship(internship._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertificatesEditor = () => {
    const handleAddCertificate = async () => {
      if (!newItem.title || !newItem.organization || !newItem.date) {
        alert('Please fill in title, organization, and date');
        return;
      }

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: newItem.title,
            organization: newItem.organization,
            date: newItem.date,
            certificateLink: newItem.certificateLink || '',
            logoUrl: newItem.logoUrl || '',
          }),
        });

        if (res.ok) {
          alert('✅ Certificate added successfully!');
          setNewItem({
            title: '',
            organization: '',
            date: '',
            certificateLink: '',
            logoUrl: '',
          });
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to add: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error adding certificate:', error);
        alert('Error adding certificate');
      } finally {
        setLoading(false);
      }
    };

    const handleUpdateCertificate = async (id, updatedCert) => {
      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/certificates', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, ...updatedCert }),
        });

        if (res.ok) {
          alert('💾 Certificate updated successfully!');
          setEditingCertificate(null);
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to update: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating certificate:', error);
        alert('Error updating certificate');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteCertificate = async (id) => {
      if (!confirm('Are you sure you want to delete this certificate?')) return;

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/certificates?id=${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert('🗑️ Certificate deleted successfully!');
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to delete: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Error deleting certificate');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Certificates
          </h2>
          <p className="text-gray-400 mt-2">
            Showcase your credentials and certifications
          </p>
        </div>

        {/* Add New Certificate Form */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-2xl p-6 border border-yellow-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">
            🎓 Add New Certificate
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Certificate Title *"
              value={newItem.title || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Organization / Issuer *"
              value={newItem.organization || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, organization: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Date (e.g., June 2023) *"
              value={newItem.date || ''}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Certificate Link (URL)"
              value={newItem.certificateLink || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, certificateLink: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Organization Logo URL"
              value={newItem.logoUrl || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, logoUrl: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            />

            {/* Logo Preview */}
            {newItem.logoUrl && (
              <div className="mt-2 p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Logo Preview:</p>
                <img
                  src={newItem.logoUrl}
                  alt="Organization Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}

            <button
              onClick={handleAddCertificate}
              disabled={
                loading ||
                !newItem.title ||
                !newItem.organization ||
                !newItem.date
              }
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : '🎓 Add Certificate'}
            </button>
          </div>
        </div>

        {/* Certificates List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            📜 Your Certificates ({localCertData.length})
          </h3>

          {localCertData.length === 0 && (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl">
              <p className="text-gray-400">
                No certificates added yet. Add your first certificate above!
              </p>
            </div>
          )}

          {localCertData.map((cert) => (
            <div
              key={cert._id}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
            >
              {editingCertificate === cert._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Certificate Title"
                    value={cert.title || ''}
                    onChange={(e) => {
                      const updated = localCertData.map((c) =>
                        c._id === cert._id
                          ? { ...c, title: e.target.value }
                          : c,
                      );
                      setLocalCertData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Organization"
                    value={cert.organization || ''}
                    onChange={(e) => {
                      const updated = localCertData.map((c) =>
                        c._id === cert._id
                          ? { ...c, organization: e.target.value }
                          : c,
                      );
                      setLocalCertData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Date (e.g., June 2023)"
                    value={cert.date || ''}
                    onChange={(e) => {
                      const updated = localCertData.map((c) =>
                        c._id === cert._id ? { ...c, date: e.target.value } : c,
                      );
                      setLocalCertData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Certificate Link"
                    value={cert.certificateLink || ''}
                    onChange={(e) => {
                      const updated = localCertData.map((c) =>
                        c._id === cert._id
                          ? { ...c, certificateLink: e.target.value }
                          : c,
                      );
                      setLocalCertData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  <input
                    type="text"
                    placeholder="Logo URL"
                    value={cert.logoUrl || ''}
                    onChange={(e) => {
                      const updated = localCertData.map((c) =>
                        c._id === cert._id
                          ? { ...c, logoUrl: e.target.value }
                          : c,
                      );
                      setLocalCertData(updated);
                    }}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />

                  {cert.logoUrl && (
                    <div className="p-3 bg-gray-800/30 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">
                        Logo Preview:
                      </p>
                      <img
                        src={cert.logoUrl}
                        alt="Organization Logo"
                        className="h-12 w-auto object-contain"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdateCertificate(cert._id, {
                          title: cert.title,
                          organization: cert.organization,
                          date: cert.date,
                          certificateLink: cert.certificateLink,
                          logoUrl: cert.logoUrl,
                        })
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => setEditingCertificate(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex gap-4">
                      {/* Logo */}
                      {cert.logoUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={cert.logoUrl}
                            alt={cert.organization}
                            className="w-16 h-16 object-contain rounded-lg bg-gray-800/50 p-2"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        </div>
                      )}

                      {/* Certificate Details */}
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-1">
                          {cert.title}
                        </h4>
                        <p className="text-yellow-400 mb-1">
                          {cert.organization}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">
                          {cert.date}
                        </p>

                        {cert.certificateLink && (
                          <a
                            href={cert.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
                          >
                            🔗 View Certificate
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingCertificate(cert._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(cert._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTestimonialsEditor = () => {
    const handleApproveTestimonial = async (id, isApproved) => {
      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, isApproved }),
        });

        if (res.ok) {
          alert(
            isApproved ? '✅ Testimonial approved!' : '❌ Testimonial rejected',
          );
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to update: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating testimonial:', error);
        alert('Error updating testimonial');
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteTestimonial = async (id) => {
      if (!confirm('Are you sure you want to delete this testimonial?')) return;

      const token =
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token');
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/testimonials?id=${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert('🗑️ Testimonial deleted successfully!');
          await fetchData();
        } else {
          const error = await res.json();
          alert(`Failed to delete: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Error deleting testimonial');
      } finally {
        setLoading(false);
      }
    };

    // Separate approved and pending testimonials
    const approvedTestimonials = localTestimonialData.filter(
      (t) => t.isApproved === true,
    );
    const pendingTestimonials = localTestimonialData.filter(
      (t) => t.isApproved === false,
    );

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Testimonials Management
          </h2>
          <p className="text-gray-400 mt-2">
            Manage testimonials submitted by visitors
          </p>
        </div>

        {/* Pending Testimonials Section */}
        {pendingTestimonials.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⏳</span> Pending Approval (
              {pendingTestimonials.length})
            </h3>
            <div className="space-y-4">
              {pendingTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-yellow-400 text-sm">
                            Submitted:{' '}
                            {new Date(
                              testimonial.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 italic">
                        "{testimonial.message}"
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() =>
                          handleApproveTestimonial(testimonial._id, true)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproveTestimonial(testimonial._id, false)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Testimonials Section */}
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 border border-indigo-500/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>⭐</span> Published Testimonials (
            {approvedTestimonials.length})
          </h3>

          {approvedTestimonials.length === 0 && (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl">
              <p className="text-gray-400">
                No published testimonials yet. Approve pending testimonials to
                display them.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {approvedTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">
                      "{testimonial.message}"
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        handleApproveTestimonial(testimonial._id, false)
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      📝 Move to Pending
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContactEditor = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
          Contact Information
        </h2>
        <p className="text-gray-400 mt-2">How people can reach you</p>
      </div>
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            📧 Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            📞 Phone
          </label>
          <input
            type="text"
            placeholder="+1 234 567 8900"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            📍 Address
          </label>
          <textarea
            placeholder="Your address"
            value={data.address || ''}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
            rows="3"
          />
        </div>
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            🌐 Social Links
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="GitHub URL"
              value={data.socialLinks?.github || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  socialLinks: { ...data.socialLinks, github: e.target.value },
                })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={data.socialLinks?.linkedin || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  socialLinks: {
                    ...data.socialLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
            />
            <input
              type="text"
              placeholder="Twitter URL"
              value={data.socialLinks?.twitter || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  socialLinks: { ...data.socialLinks, twitter: e.target.value },
                })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
            />
            <input
              type="text"
              placeholder="WhatsApp URL"
              value={data.socialLinks?.whatsapp || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  socialLinks: {
                    ...data.socialLinks,
                    whatsapp: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 text-white"
            />
          </div>
        </div>
      </div>
      <button
        onClick={() => saveData(data)}
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-pink-500/25"
      >
        {loading ? 'Saving...' : '💾 Save Contact Information'}
      </button>
    </div>
  );

  const renderMessagesEditor = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
          Contact Messages
        </h2>
        <p className="text-gray-400 mt-2">
          Messages sent from your portfolio contact form
        </p>
        <div className="flex gap-4 mt-4">
          <div className="px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <span className="text-blue-400 font-semibold">
              Total: {messagesStats.total}
            </span>
          </div>
          <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
            <span className="text-green-400 font-semibold">
              Unread: {messagesStats.unread}
            </span>
          </div>
        </div>
      </div>

      {messagesLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400 text-lg">No messages yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Messages from your contact form will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border transition-all duration-300 ${
                !message.read
                  ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() =>
                    setSelectedMessage(
                      selectedMessage?._id === message._id ? null : message,
                    )
                  }
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        !message.read
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        {message.name}
                        {!message.read && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 line-clamp-2">
                    {message.message}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm">
                    <span className="text-gray-500">📧 {message.email}</span>
                    {message.phone && (
                      <span className="text-gray-500">📞 {message.phone}</span>
                    )}
                    {message.location?.lat && (
                      <span className="text-gray-500">
                        📍 {message.location.lat.toFixed(4)},{' '}
                        {message.location.lng.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <a
                    href={`mailto:${message.email}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    title="Reply via email"
                  >
                    ✉️
                  </a>
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Expanded message details */}
              {selectedMessage?._id === message._id && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-2">
                      Full Message:
                    </h5>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                  {message.location?.lat && message.location?.lng && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">
                        📍 Location Details:
                      </h5>
                      <p className="text-gray-300">
                        Latitude: {message.location.lat}
                      </p>
                      <p className="text-gray-300">
                        Longitude: {message.location.lng}
                      </p>
                      {message.location.address && (
                        <p className="text-gray-300 mt-1">
                          Address: {message.location.address}
                        </p>
                      )}
                      <a
                        href={`https://www.google.com/maps?q=${message.location.lat},${message.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-400 hover:underline"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  )}
                  {message.ipAddress && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">
                        Technical Info:
                      </h5>
                      <p className="text-gray-300 text-sm">
                        IP Address: {message.ipAddress}
                      </p>
                      {message.userAgent && (
                        <p className="text-gray-300 text-sm mt-1 break-all">
                          User Agent: {message.userAgent}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-72' : 'w-20'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-white/10"></div>
        <div className="relative flex flex-col h-full justify-between">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            {sidebarOpen ? (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Yadam
                </h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            ) : (
              <></>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    sidebarOpen
                      ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
                      : 'M13 5l7 7-7 7M5 5l7 7-7 7'
                  }
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-2 space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative group flex items-center justify-center ${sidebarOpen ? 'justify-start px-4 gap-4' : ''} py-3 rounded-xl transition-all duration-300 ${isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg` : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full"></span>
                  )}
                  <span className="text-2xl group-hover:scale-110 transition">
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-20 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-lg">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                sessionStorage.removeItem('admin_token');
                router.push('/login');
              }}
              className={`group flex items-center justify-center ${sidebarOpen ? 'justify-start px-4 gap-4' : ''} w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300`}
            >
              {sidebarOpen ? <span>Logout</span> : <>⏻</>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}
      >
        <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {menuItems.find((item) => item.id === activeTab)?.label ||
                    'Dashboard'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Manage your portfolio content
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={refreshData}
                  className="px-3 py-2 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors"
                  title="Refresh data"
                >
                  <svg
                    className="w-5 h-5 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {loading && (
              <div className="flex items-center justify-center py-32">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            {!loading && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 lg:p-8 shadow-2xl">
                {activeTab === 'home' && renderHomeEditor()}
                {activeTab === 'about' && renderAboutEditor()}
                {activeTab === 'projects' && renderProjectsEditor()}
                {activeTab === 'certificates' && renderCertificatesEditor()}
                {activeTab === 'testimonials' && renderTestimonialsEditor()}
                {activeTab === 'contact' && renderContactEditor()}
                {activeTab === 'messages' && renderMessagesEditor()}
                {activeTab === 'internships' && renderInternshipsEditor()}
              </div>
            )}
          </div>
        </div>
      </main>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
