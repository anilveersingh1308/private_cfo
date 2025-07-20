'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  Table 
} from '@/components/admin/AdminComponents';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'consultant' | 'moderator';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  consultations_count?: number;
  total_spent?: number;
}

interface NewsletterSubscriber {
  id: number;
  email: string;
  categories: string[];
  subscribed_at: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  engagement_score?: number;
  last_email_opened?: string;
  total_emails_sent?: number;
  source?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'subscribers'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Subscriber modal states
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [showViewSubscriberModal, setShowViewSubscriberModal] = useState(false);
  const [showEmailSubscriberModal, setShowEmailSubscriberModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showBlockSubscriberModal, setShowBlockSubscriberModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: 'user' as User['role'],
    status: 'active' as User['status'],
    password: ''
  });

  const [subscriberFormData, setSubscriberFormData] = useState({
    email: '',
    categories: [] as string[],
    source: 'Website' as string,
    status: 'active' as NewsletterSubscriber['status']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Enhanced mock data with more realistic information
      setUsers([
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@privatecfo.com',
          role: 'admin',
          status: 'active',
          phone: '+91 98765 43210',
          location: 'Mumbai, Maharashtra',
          created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          consultations_count: 0,
          total_spent: 0
        },
        {
          id: 2,
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          role: 'user',
          status: 'active',
          phone: '+91 98765 43211',
          location: 'Delhi, Delhi',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          consultations_count: 3,
          total_spent: 15000
        },
        {
          id: 3,
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          role: 'user',
          status: 'active',
          phone: '+91 98765 43212',
          location: 'Bangalore, Karnataka',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          consultations_count: 5,
          total_spent: 25000
        },
        {
          id: 4,
          name: 'Dr. Amit Verma',
          email: 'amit.verma@privatecfo.com',
          role: 'consultant',
          status: 'active',
          phone: '+91 98765 43213',
          location: 'Chennai, Tamil Nadu',
          created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          consultations_count: 127,
          total_spent: 0
        },
        {
          id: 5,
          name: 'Sneha Patel',
          email: 'sneha.patel@email.com',
          role: 'user',
          status: 'pending',
          phone: '+91 98765 43214',
          location: 'Pune, Maharashtra',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          consultations_count: 0,
          total_spent: 0
        },
        {
          id: 6,
          name: 'Vikram Singh',
          email: 'vikram.singh@email.com',
          role: 'user',
          status: 'inactive',
          phone: '+91 98765 43215',
          location: 'Kolkata, West Bengal',
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          consultations_count: 2,
          total_spent: 8000
        }
      ]);

      setSubscribers([
        {
          id: 1,
          email: 'subscriber1@example.com',
          categories: ['Financial Planning', 'Tax Consulting'],
          subscribed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          engagement_score: 85,
          last_email_opened: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          total_emails_sent: 24,
          source: 'Website'
        },
        {
          id: 2,
          email: 'subscriber2@example.com',
          categories: ['Investment Advice'],
          subscribed_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          engagement_score: 92,
          last_email_opened: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          total_emails_sent: 18,
          source: 'Social Media'
        },
        {
          id: 3,
          email: 'subscriber3@example.com',
          categories: ['Retirement Planning', 'Financial Planning'],
          subscribed_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'unsubscribed',
          engagement_score: 45,
          last_email_opened: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          total_emails_sent: 32,
          source: 'Referral'
        },
        {
          id: 4,
          email: 'subscriber4@example.com',
          categories: ['Tax Consulting', 'Investment Advice'],
          subscribed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'bounced',
          engagement_score: 12,
          last_email_opened: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          total_emails_sent: 15,
          source: 'Newsletter'
        },
        {
          id: 5,
          email: 'subscriber5@example.com',
          categories: ['Business Consulting'],
          subscribed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          engagement_score: 0,
          total_emails_sent: 1,
          source: 'Website'
        }
      ]);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportData = (type: 'users' | 'subscribers', format: 'json' | 'csv') => {
    const data = type === 'users' ? filteredUsers : filteredSubscribers;
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const csvContent = convertToCSV(data, type);
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${timestamp}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const convertToCSV = (data: any[], type: string) => {
    if (type === 'users') {
      const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Phone', 'Location', 'Consultations', 'Total Spent', 'Created At', 'Last Login'];
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.id,
          `"${item.name}"`,
          `"${item.email}"`,
          `"${item.role}"`,
          `"${item.status}"`,
          `"${item.phone || ''}"`,
          `"${item.location || ''}"`,
          item.consultations_count || 0,
          item.total_spent || 0,
          `"${new Date(item.created_at).toISOString()}"`,
          `"${item.last_login ? new Date(item.last_login).toISOString() : 'Never'}"`
        ].join(','))
      ].join('\n');
      return csvContent;
    } else {
      const headers = ['ID', 'Email', 'Categories', 'Status', 'Engagement Score', 'Source', 'Subscribed At', 'Last Email Opened'];
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.id,
          `"${item.email}"`,
          `"${item.categories.join('; ')}"`,
          `"${item.status}"`,
          item.engagement_score || 0,
          `"${item.source || ''}"`,
          `"${new Date(item.subscribed_at).toISOString()}"`,
          `"${item.last_email_opened ? new Date(item.last_email_opened).toISOString() : 'Never'}"`
        ].join(','))
      ].join('\n');
      return csvContent;
    }
  };

  // Action handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      role: user.role,
      status: user.status,
      password: ''
    });
    setShowEditUserModal(true);
  };

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleAddUser = () => {
    if (activeTab === 'users') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        role: 'user',
        status: 'active',
        password: ''
      });
      setShowAddUserModal(true);
    } else {
      setSubscriberFormData({
        email: '',
        categories: [],
        source: 'Website',
        status: 'active'
      });
      setShowAddSubscriberModal(true);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        role: formData.role,
        status: formData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        consultations_count: 0,
        total_spent: 0
      };

      setUsers(prev => [newUser, ...prev]);
      setShowAddUserModal(false);
      console.log('User created:', newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              location: formData.location,
              role: formData.role,
              status: formData.status,
              updated_at: new Date().toISOString()
            }
          : user
      ));
      
      setShowEditUserModal(false);
      console.log('User updated:', selectedUser.id);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              status: newStatus,
              updated_at: new Date().toISOString()
            }
          : user
      ));
      
      setShowSuspendModal(false);
      console.log(`User ${newStatus}:`, selectedUser.id);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubscriberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubscriberFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setSubscriberFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleCreateSubscriber = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSubscriber: NewsletterSubscriber = {
        id: Math.max(...subscribers.map(s => s.id)) + 1,
        email: subscriberFormData.email,
        categories: subscriberFormData.categories,
        subscribed_at: new Date().toISOString(),
        status: subscriberFormData.status,
        engagement_score: 0,
        total_emails_sent: 0,
        source: subscriberFormData.source
      };

      setSubscribers(prev => [newSubscriber, ...prev]);
      setShowAddSubscriberModal(false);
      console.log('Subscriber created:', newSubscriber);
    } catch (error) {
      console.error('Failed to create subscriber:', error);
    }
  };

  // Subscriber action handlers
  const handleViewSubscriber = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setShowViewSubscriberModal(true);
  };

  const handleEmailSubscriber = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setShowEmailSubscriberModal(true);
  };

  const handleViewAnalytics = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setShowAnalyticsModal(true);
  };

  const handleBlockSubscriber = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setShowBlockSubscriberModal(true);
  };

  const handleSendEmail = async () => {
    if (!selectedSubscriber) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email sent to:', selectedSubscriber.email);
      setShowEmailSubscriberModal(false);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleConfirmBlock = async () => {
    if (!selectedSubscriber) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = selectedSubscriber.status === 'active' ? 'unsubscribed' : 'active';
      
      setSubscribers(prev => prev.map(subscriber => 
        subscriber.id === selectedSubscriber.id 
          ? {
              ...subscriber,
              status: newStatus
            }
          : subscriber
      ));
      
      setShowBlockSubscriberModal(false);
      console.log(`Subscriber ${newStatus}:`, selectedSubscriber.id);
    } catch (error) {
      console.error('Failed to update subscriber status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" size="sm">Active</Badge>;
      case 'inactive': return <Badge variant="danger" size="sm">Inactive</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'suspended': return <Badge variant="danger" size="sm">Suspended</Badge>;
      case 'unsubscribed': return <Badge variant="neutral" size="sm">Unsubscribed</Badge>;
      case 'bounced': return <Badge variant="danger" size="sm">Bounced</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge variant="danger" size="sm">Admin</Badge>;
      case 'consultant': return <Badge variant="info" size="sm">Consultant</Badge>;
      case 'moderator': return <Badge variant="warning" size="sm">Moderator</Badge>;
      case 'user': return <Badge variant="neutral" size="sm">User</Badge>;
      default: return <Badge variant="neutral" size="sm">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  // Enhanced filtering and sorting logic
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'last_login':
          aValue = a.last_login ? new Date(a.last_login).getTime() : 0;
          bValue = b.last_login ? new Date(b.last_login).getTime() : 0;
          break;
        case 'consultations_count':
          aValue = a.consultations_count || 0;
          bValue = b.consultations_count || 0;
          break;
        case 'total_spent':
          aValue = a.total_spent || 0;
          bValue = b.total_spent || 0;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const filteredSubscribers = subscribers
    .filter(subscriber => {
      const matchesSearch = subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           subscriber.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (subscriber.source && subscriber.source.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'subscribed_at':
          aValue = new Date(a.subscribed_at).getTime();
          bValue = new Date(b.subscribed_at).getTime();
          break;
        case 'engagement_score':
          aValue = a.engagement_score || 0;
          bValue = b.engagement_score || 0;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const userColumns = [
    {
      key: 'name',
      title: 'User',
      render: (value: string, row: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${
              row.role === 'admin' ? '#ef4444, #dc2626' :
              row.role === 'consultant' ? '#0ea5e9, #3b82f6' :
              row.role === 'moderator' ? '#f59e0b, #d97706' :
              '#22c55e, #16a34a'
            })`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.875rem' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.email}</div>
            {row.location && (
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '0.25rem' }}></i>
                {row.location}
              </div>
            )}
          </div>
        </div>
      ),
      width: '280px'
    },
    {
      key: 'role',
      title: 'Role',
      render: (value: string) => getRoleBadge(value),
      width: '100px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '100px'
    },
    {
      key: 'consultations_count',
      title: 'Sessions',
      render: (value: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.875rem' }}>
            {value || 0}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>consultations</div>
        </div>
      ),
      width: '100px'
    },
    {
      key: 'total_spent',
      title: 'Spent',
      render: (value: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: value > 0 ? '#22c55e' : '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>
            {value > 0 ? formatCurrency(value) : '—'}
          </div>
        </div>
      ),
      width: '120px'
    },
    {
      key: 'last_login',
      title: 'Last Active',
      render: (value: string) => value ? (
        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{getTimeAgo(value)}</span>
      ) : (
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Never</span>
      ),
      width: '120px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: User) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-eye"
            onClick={() => handleViewUser(row)}
          >
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-edit"
            onClick={() => handleEditUser(row)}
          >
            Edit
          </Button>
          {row.role !== 'admin' && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon={row.status === 'suspended' ? "fas fa-check" : "fas fa-ban"}
              onClick={() => handleSuspendUser(row)}
            >
              {row.status === 'suspended' ? 'Activate' : 'Suspend'}
            </Button>
          )}
        </div>
      ),
      width: '180px'
    }
  ];

  const subscriberColumns = [
    {
      key: 'email',
      title: 'Subscriber',
      render: (value: string, row: NewsletterSubscriber) => (
        <div>
          <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.875rem' }}>{value}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Score: {row.engagement_score || 0}% • {row.source}
          </div>
        </div>
      ),
      width: '280px'
    },
    {
      key: 'categories',
      title: 'Interests',
      render: (value: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {value.slice(0, 2).map((category, index) => (
            <Badge key={index} variant="info" size="sm">{category}</Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="neutral" size="sm">+{value.length - 2}</Badge>
          )}
        </div>
      ),
      width: '200px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '120px'
    },
    {
      key: 'engagement_score',
      title: 'Engagement',
      render: (value: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            color: value >= 70 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444', 
            fontWeight: '600', 
            fontSize: '0.875rem' 
          }}>
            {value || 0}%
          </div>
        </div>
      ),
      width: '100px'
    },
    {
      key: 'subscribed_at',
      title: 'Subscribed',
      render: (value: string) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{formatDate(value)}</span>
      ),
      width: '140px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: NewsletterSubscriber) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-eye"
            onClick={() => handleViewSubscriber(row)}
          >
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-envelope"
            onClick={() => handleEmailSubscriber(row)}
          >
            Email
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-chart-line"
            onClick={() => handleViewAnalytics(row)}
          >
            Analytics
          </Button>
          {row.status === 'active' && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon="fas fa-ban"
              onClick={() => handleBlockSubscriber(row)}
            >
              Block
            </Button>
          )}
        </div>
      ),
      width: '220px'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading users...</span>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
          }
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            color: #94a3b8;
            font-size: 1rem;
          }
          .loading-spinner i {
            font-size: 2rem;
            color: #0ea5e9;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Unable to Load Users</h3>
          <p>{error}</p>
          <Button variant="primary" size="sm" onClick={fetchData}>
            <i className="fas fa-refresh"></i>
            Try Again
          </Button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 3rem;
            text-align: center;
          }
          .error-container i {
            font-size: 3rem;
            color: #ef4444;
          }
          .error-container h3 {
            margin: 0;
            color: #f8fafc;
            font-size: 1.5rem;
          }
          .error-container p {
            margin: 0;
            color: #94a3b8;
          }
        `}</style>
      </Card>
    );
  }

  const roleOptions = ['admin', 'consultant', 'moderator', 'user'];

  return (
    <div className="admin-users">
      <PageHeader
        title="User Management"
        subtitle={`Manage ${activeTab === 'users' ? 'platform users' : 'newsletter subscribers'} and their permissions`}
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-download"
              onClick={() => exportData(activeTab, 'csv')}
            >
              Export CSV
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-file-code"
              onClick={() => exportData(activeTab, 'json')}
            >
              Export JSON
            </Button>
            <Button variant="primary" size="sm" icon="fas fa-plus" onClick={handleAddUser}>
              Add {activeTab === 'users' ? 'User' : 'Subscriber'}
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i>
          Users ({filteredUsers.length})
        </button>
        <button 
          className={`tab ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          <i className="fas fa-envelope"></i>
          Subscribers ({filteredSubscribers.length})
        </button>
      </div>

      {/* Enhanced Filters */}
      <Card className="filters-card">
        <div className="filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            {activeTab === 'users' && <option value="suspended">Suspended</option>}
            {activeTab === 'subscribers' && (
              <>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </>
            )}
          </select>

          {activeTab === 'users' && (
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              {roleOptions.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          )}

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value={activeTab === 'users' ? 'created_at' : 'subscribed_at'}>
              Sort by {activeTab === 'users' ? 'Join Date' : 'Subscribe Date'}
            </option>
            <option value={activeTab === 'users' ? 'name' : 'email'}>
              {activeTab === 'users' ? 'Name' : 'Email'}
            </option>
            <option value={activeTab === 'users' ? 'last_login' : 'engagement_score'}>
              {activeTab === 'users' ? 'Last Login' : 'Engagement'}
            </option>
            {activeTab === 'users' && (
              <>
                <option value="consultations_count">Consultations</option>
                <option value="total_spent">Total Spent</option>
              </>
            )}
          </select>

          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <i className={`fas fa-sort-amount-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </Card>

      {/* Data Table */}
      {activeTab === 'users' ? (
        <Table
          columns={userColumns}
          data={filteredUsers}
          loading={loading}
          onRowClick={(user) => console.log('View user details:', user)}
        />
      ) : (
        <Table
          columns={subscriberColumns}
          data={filteredSubscribers}
          loading={loading}
          onRowClick={(subscriber) => console.log('View subscriber details:', subscriber)}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="consultant">Consultant</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Temporary Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter temporary password"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowAddUserModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateUser}>
                Create User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddSubscriberModal && (
        <div className="modal-overlay" onClick={() => setShowAddSubscriberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Subscriber</h3>
              <button className="modal-close" onClick={() => setShowAddSubscriberModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={subscriberFormData.email}
                    onChange={handleSubscriberInputChange}
                    placeholder="subscriber@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select
                    name="source"
                    value={subscriberFormData.source}
                    onChange={handleSubscriberInputChange}
                  >
                    <option value="Website">Website</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Referral">Referral</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={subscriberFormData.status}
                    onChange={handleSubscriberInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Categories of Interest</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '0.75rem', 
                    marginTop: '0.5rem' 
                  }}>
                    {[
                      'Financial Planning',
                      'Tax Consulting',
                      'Investment Advice',
                      'Retirement Planning',
                      'Business Consulting',
                      'Risk Management',
                      'Estate Planning',
                      'Insurance Planning'
                    ].map(category => (
                      <label key={category} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: subscriberFormData.categories.includes(category) 
                          ? '1px solid #0ea5e9' 
                          : '1px solid rgba(75, 85, 99, 0.3)',
                        background: subscriberFormData.categories.includes(category) 
                          ? 'rgba(14, 165, 233, 0.1)' 
                          : 'rgba(15, 23, 42, 0.5)',
                        transition: 'all 0.2s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={subscriberFormData.categories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          style={{ margin: 0 }}
                        />
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: subscriberFormData.categories.includes(category) ? '#0ea5e9' : '#cbd5e1' 
                        }}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                  <small style={{ color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>
                    Select the categories this subscriber is interested in
                  </small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowAddSubscriberModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateSubscriber}>
                Add Subscriber
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewUserModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="modal-close" onClick={() => setShowViewUserModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-profile">
                <div className="user-avatar-large">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details-section">
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                  <div className="user-badges">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label>User ID</label>
                  <span>#{selectedUser.id}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Location</label>
                  <span>{selectedUser.location || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Consultations</label>
                  <span>{selectedUser.consultations_count || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Total Spent</label>
                  <span>{selectedUser.total_spent ? formatCurrency(selectedUser.total_spent) : '₹0'}</span>
                </div>
                <div className="detail-item">
                  <label>Member Since</label>
                  <span>{formatDate(selectedUser.created_at)}</span>
                </div>
                <div className="detail-item">
                  <label>Last Login</label>
                  <span>{selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Never'}</span>
                </div>
                <div className="detail-item">
                  <label>Last Updated</label>
                  <span>{formatDate(selectedUser.updated_at)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowViewUserModal(false)}>
                Close
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowViewUserModal(false);
                handleEditUser(selectedUser);
              }}>
                Edit User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="modal-close" onClick={() => setShowEditUserModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={selectedUser.role === 'admin'}
                  >
                    <option value="user">User</option>
                    <option value="consultant">Consultant</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                  {selectedUser.role === 'admin' && (
                    <small>Admin role cannot be changed</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowEditUserModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdateUser}>
                Update User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend/Activate User Modal */}
      {showSuspendModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowSuspendModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUser.status === 'suspended' ? 'Activate User' : 'Suspend User'}</h3>
              <button className="modal-close" onClick={() => setShowSuspendModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmation-content">
                <div className="warning-icon">
                  <i className={`fas ${selectedUser.status === 'suspended' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                </div>
                <div className="confirmation-text">
                  <p>
                    Are you sure you want to {selectedUser.status === 'suspended' ? 'activate' : 'suspend'} <strong>{selectedUser.name}</strong>?
                  </p>
                  {selectedUser.status !== 'suspended' && (
                    <p className="warning-note">
                      This will prevent the user from accessing their account and all associated services.
                    </p>
                  )}
                  {selectedUser.status === 'suspended' && (
                    <p className="success-note">
                      This will restore the user's access to their account and all services.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowSuspendModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={selectedUser.status === 'suspended' ? 'primary' : 'danger'} 
                size="sm" 
                onClick={handleConfirmSuspend}
              >
                {selectedUser.status === 'suspended' ? 'Activate User' : 'Suspend User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Subscriber Modal */}
      {showViewSubscriberModal && selectedSubscriber && (
        <div className="modal-overlay" onClick={() => setShowViewSubscriberModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subscriber Details</h3>
              <button className="modal-close" onClick={() => setShowViewSubscriberModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-profile">
                <div className="user-avatar-large" style={{
                  background: selectedSubscriber.status === 'active' ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
                             selectedSubscriber.status === 'unsubscribed' ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                             selectedSubscriber.status === 'bounced' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                             'linear-gradient(135deg, #f59e0b, #d97706)'
                }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="user-details-section">
                  <h4>{selectedSubscriber.email}</h4>
                  <p>Newsletter Subscriber</p>
                  <div className="user-badges">
                    {getStatusBadge(selectedSubscriber.status)}
                    <Badge variant="info" size="sm">
                      Score: {selectedSubscriber.engagement_score || 0}%
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label>Subscriber ID</label>
                  <span>#{selectedSubscriber.id}</span>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <span>{selectedSubscriber.email}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span>{selectedSubscriber.status}</span>
                </div>
                <div className="detail-item">
                  <label>Source</label>
                  <span>{selectedSubscriber.source || 'Unknown'}</span>
                </div>
                <div className="detail-item">
                  <label>Engagement Score</label>
                  <span>{selectedSubscriber.engagement_score || 0}%</span>
                </div>
                <div className="detail-item">
                  <label>Total Emails Sent</label>
                  <span>{selectedSubscriber.total_emails_sent || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Subscribed Date</label>
                  <span>{formatDate(selectedSubscriber.subscribed_at)}</span>
                </div>
                <div className="detail-item">
                  <label>Last Email Opened</label>
                  <span>{selectedSubscriber.last_email_opened ? formatDate(selectedSubscriber.last_email_opened) : 'Never'}</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-tags" style={{ marginRight: '0.5rem', color: '#0ea5e9' }}></i>
                  Subscription Categories
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedSubscriber.categories.map((category, index) => (
                    <Badge key={index} variant="info" size="sm">{category}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowViewSubscriberModal(false)}>
                Close
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowViewSubscriberModal(false);
                handleEmailSubscriber(selectedSubscriber);
              }}>
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email Subscriber Modal */}
      {showEmailSubscriberModal && selectedSubscriber && (
        <div className="modal-overlay" onClick={() => setShowEmailSubscriberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Email</h3>
              <button className="modal-close" onClick={() => setShowEmailSubscriberModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="fas fa-envelope" style={{ color: '#0ea5e9' }}></i>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>To: {selectedSubscriber.email}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      Engagement Score: {selectedSubscriber.engagement_score || 0}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Email Template</label>
                  <select style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: '#f8fafc' }}>
                    <option value="newsletter">Weekly Newsletter</option>
                    <option value="promotion">Special Promotion</option>
                    <option value="welcome">Welcome Email</option>
                    <option value="reminder">Consultation Reminder</option>
                    <option value="custom">Custom Email</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Subject Line</label>
                  <input
                    type="text"
                    placeholder="Enter email subject"
                    defaultValue="Weekly CFO Insights - Financial Planning Tips"
                    style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: '#f8fafc' }}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Message Preview</label>
                  <textarea
                    rows={4}
                    placeholder="Email content preview..."
                    defaultValue="Get personalized financial insights and expert advice from our certified CFOs. This week's highlights include tax planning strategies and investment opportunities."
                    style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: '#f8fafc', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowEmailSubscriberModal(false)}>
                Cancel
              </Button>
              <Button variant="ghost" size="sm" icon="fas fa-paper-plane">
                Schedule Send
              </Button>
              <Button variant="primary" size="sm" icon="fas fa-envelope" onClick={handleSendEmail}>
                Send Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedSubscriber && (
        <div className="modal-overlay" onClick={() => setShowAnalyticsModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subscriber Analytics</h3>
              <button className="modal-close" onClick={() => setShowAnalyticsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#0ea5e9' }}></i>
                  {selectedSubscriber.email}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="analytics-card">
                    <div className="analytics-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="analytics-content">
                      <div className="analytics-value">{selectedSubscriber.engagement_score || 0}%</div>
                      <div className="analytics-label">Engagement Score</div>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-icon">
                      <i className="fas fa-envelope-open"></i>
                    </div>
                    <div className="analytics-content">
                      <div className="analytics-value">{Math.floor((selectedSubscriber.engagement_score || 0) * 0.8)}%</div>
                      <div className="analytics-label">Open Rate</div>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-icon">
                      <i className="fas fa-mouse-pointer"></i>
                    </div>
                    <div className="analytics-content">
                      <div className="analytics-value">{Math.floor((selectedSubscriber.engagement_score || 0) * 0.3)}%</div>
                      <div className="analytics-label">Click Rate</div>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-icon">
                      <i className="fas fa-paper-plane"></i>
                    </div>
                    <div className="analytics-content">
                      <div className="analytics-value">{selectedSubscriber.total_emails_sent || 0}</div>
                      <div className="analytics-label">Emails Sent</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: '#0ea5e9' }}></i>
                  Activity Timeline
                </h4>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker success"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Subscribed to Newsletter</div>
                      <div className="timeline-date">{formatDate(selectedSubscriber.subscribed_at)}</div>
                      <div className="timeline-desc">Joined via {selectedSubscriber.source}</div>
                    </div>
                  </div>
                  {selectedSubscriber.last_email_opened && (
                    <div className="timeline-item">
                      <div className="timeline-marker info"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">Last Email Opened</div>
                        <div className="timeline-date">{formatDate(selectedSubscriber.last_email_opened)}</div>
                        <div className="timeline-desc">Opened "Weekly CFO Insights"</div>
                      </div>
                    </div>
                  )}
                  <div className="timeline-item">
                    <div className="timeline-marker warning"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Engagement Analysis</div>
                      <div className="timeline-date">Current Status</div>
                      <div className="timeline-desc">
                        {(selectedSubscriber.engagement_score || 0) >= 70 ? 'Highly engaged subscriber' :
                         (selectedSubscriber.engagement_score || 0) >= 40 ? 'Moderately engaged subscriber' :
                         'Low engagement - consider re-engagement campaign'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowAnalyticsModal(false)}>
                Close
              </Button>
              <Button variant="ghost" size="sm" icon="fas fa-download">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Block Subscriber Modal */}
      {showBlockSubscriberModal && selectedSubscriber && (
        <div className="modal-overlay" onClick={() => setShowBlockSubscriberModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedSubscriber.status === 'active' ? 'Block Subscriber' : 'Unblock Subscriber'}</h3>
              <button className="modal-close" onClick={() => setShowBlockSubscriberModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmation-content">
                <div className="warning-icon">
                  <i className={`fas ${selectedSubscriber.status === 'active' ? 'fa-ban' : 'fa-check-circle'}`}></i>
                </div>
                <div className="confirmation-text">
                  <p>
                    Are you sure you want to {selectedSubscriber.status === 'active' ? 'block' : 'unblock'} <strong>{selectedSubscriber.email}</strong>?
                  </p>
                  {selectedSubscriber.status === 'active' && (
                    <p className="warning-note">
                      This will unsubscribe them from all newsletters and prevent future emails.
                    </p>
                  )}
                  {selectedSubscriber.status !== 'active' && (
                    <p className="success-note">
                      This will reactivate their subscription and allow them to receive newsletters again.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowBlockSubscriberModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={selectedSubscriber.status === 'active' ? 'danger' : 'primary'} 
                size="sm" 
                onClick={handleConfirmBlock}
              >
                {selectedSubscriber.status === 'active' ? 'Block Subscriber' : 'Unblock Subscriber'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-users {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #f8fafc;
          background: rgba(59, 130, 246, 0.1);
        }

        .tab.active {
          color: #0ea5e9;
          background: rgba(14, 165, 233, 0.1);
          border-bottom: 2px solid #0ea5e9;
        }

        .filters {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .search-box input::placeholder {
          color: #64748b;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          min-width: 140px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .sort-order-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sort-order-btn:hover {
          color: #f8fafc;
          border-color: #0ea5e9;
        }

        @media (max-width: 768px) {
          .admin-users {
            padding: 1rem;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.large {
          max-width: 800px;
        }

        .modal-content.small {
          max-width: 500px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .modal-header h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          color: #e2e8f0;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .form-group input::placeholder {
          color: #64748b;
        }

        .form-group input:disabled,
        .form-group select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-group small {
          color: #94a3b8;
          font-size: 0.75rem;
          font-style: italic;
        }

        .form-group select option {
          background: #1e293b;
          color: #f8fafc;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        /* User Profile Styles */
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .user-avatar-large {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: 600;
          border: 3px solid rgba(14, 165, 233, 0.3);
        }

        .user-details-section h4 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .user-details-section p {
          margin: 0 0 1rem 0;
          color: #94a3b8;
          font-size: 1rem;
        }

        .user-badges {
          display: flex;
          gap: 0.5rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .detail-item label {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-item span {
          color: #f8fafc;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Confirmation Modal Styles */
        .confirmation-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          text-align: left;
        }

        .warning-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 1.5rem;
        }

        .warning-icon .fa-check-circle {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .confirmation-text p {
          margin: 0 0 0.75rem 0;
          color: #e2e8f0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .confirmation-text p:last-child {
          margin-bottom: 0;
        }

        .warning-note {
          color: #fbbf24 !important;
          font-size: 0.8rem !important;
        }

        .success-note {
          color: #22c55e !important;
          font-size: 0.8rem !important;
        }

        /* Analytics Styles */
        .analytics-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.2s ease;
        }

        .analytics-card:hover {
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateY(-2px);
        }

        .analytics-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }

        .analytics-content {
          flex: 1;
        }

        .analytics-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 0.25rem;
        }

        .analytics-label {
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Timeline Styles */
        .timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #0ea5e9, rgba(14, 165, 233, 0.3));
        }

        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -2rem;
          top: 0.25rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #1e293b;
        }

        .timeline-marker.success {
          background: #22c55e;
        }

        .timeline-marker.info {
          background: #0ea5e9;
        }

        .timeline-marker.warning {
          background: #f59e0b;
        }

        .timeline-marker.danger {
          background: #ef4444;
        }

        .timeline-content {
          padding-left: 1rem;
        }

        .timeline-title {
          color: #f8fafc;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .timeline-date {
          color: #0ea5e9;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .timeline-desc {
          color: #94a3b8;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .user-profile {
            flex-direction: column;
            text-align: center;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .confirmation-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
