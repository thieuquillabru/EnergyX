'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Book, BookStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function LibraryPage() {
  const { currentTheme, books, addBook, updateBook, deleteBook } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    status: 'want_to_read' as BookStatus,
    totalPages: 0,
    currentPage: 0,
    rating: 0,
  });

  const statuses = [
    { value: 'all', label: 'Tous' },
    { value: 'want_to_read', label: 'À lire' },
    { value: 'reading', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'paused', label: 'En pause' },
  ];

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !b.author.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [books, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = books.length;
    const read = books.filter(b => b.status === 'completed').length;
    const currentlyReading = books.filter(b => b.status === 'reading').length;
    const totalPages = books.reduce((acc, b) => acc + (b.totalPages || 0), 0);
    return { total, read, currentlyReading, totalPages };
  }, [books]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      const newBook: Book = {
        id: Date.now().toString(),
        ...formData,
        isFavorite: false,
        notes: [],
        startDate: formData.status === 'reading' ? new Date().toISOString() : undefined,
      };
      addBook(newBook);
    }

    setIsModalOpen(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      category: '',
      status: 'want_to_read',
      totalPages: 0,
      currentPage: 0,
      rating: 0,
    });
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
      totalPages: book.totalPages || 0,
      currentPage: book.currentPage || 0,
      rating: book.rating || 0,
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: BookStatus) => {
    const badges: Record<BookStatus, { label: string; variant: any }> = {
      want_to_read: { label: 'À lire', variant: 'default' },
      reading: { label: 'En cours', variant: 'primary' },
      completed: { label: 'Terminé', variant: 'success' },
      paused: { label: 'En pause', variant: 'warning' },
    };
    return badges[status];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>📚 Bibliothèque</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            Gérez votre collection de livres et votre lecture
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>
          Ajouter un livre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Total livres</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.text }}>{stats.total}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Terminés</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{stats.read}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>En cours</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{stats.currentlyReading}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Pages totales</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{stats.totalPages}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Rechercher un livre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: filterStatus === s.value ? currentTheme.primary : currentTheme.background,
                color: filterStatus === s.value ? 'white' : currentTheme.text,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>
            {books.length === 0 ? 'Votre bibliothèque est vide' : 'Aucun livre trouvé'}
          </h3>
          <p style={{ color: currentTheme.textSecondary }}>
            {books.length === 0 ? 'Ajoutez vos premiers livres pour commencer!' : 'Essayez une autre recherche.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book) => {
            const badge = getStatusBadge(book.status);
            const progress = book.totalPages ? Math.round(((book.currentPage ?? 0) / book.totalPages) * 100) : 0;
            
            return (
              <Card key={book.id} className="relative overflow-hidden">
                {/* Cover placeholder */}
                <div
                  className="h-32 rounded-xl mb-3 flex items-center justify-center text-4xl"
                  style={{ backgroundColor: currentTheme.primary + '20' }}
                >
                  📖
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold line-clamp-1" style={{ color: currentTheme.text }}>{book.title}</h3>
                    <p className="text-sm" style={{ color: currentTheme.textSecondary }}>{book.author}</p>
                  </div>
                  {book.isFavorite && <span>⭐</span>}
                </div>

                <Badge variant={badge.variant} size="sm" className="mb-3">{badge.label}</Badge>

                {book.status === 'reading' && book.totalPages && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: currentTheme.textSecondary }}>Progression</span>
                      <span style={{ color: currentTheme.text }}>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} size="sm" />
                    <div className="flex justify-between mt-1 text-xs" style={{ color: currentTheme.textSecondary }}>
                      <span>{book.currentPage} pages</span>
                      <span>{book.totalPages} pages</span>
                    </div>
                  </div>
                )}

                {(book.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < (book.rating ?? 0) ? currentTheme.warning : currentTheme.border }}>
                        ★
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleEdit(book)}>
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteBook(book.id)}>
                    🗑️
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingBook(null); }}
        title={editingBook ? 'Modifier le livre' : 'Ajouter un livre'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre du livre"
          />
          <Input
            label="Auteur"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Nom de l'auteur"
          />
          <Input
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ex: Science-fiction, Développement personnel..."
          />
          <Select
            label="Statut"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
            options={statuses.slice(1)}
          />
          {formData.status === 'reading' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Pages lues"
                type="number"
                value={formData.currentPage}
                onChange={(e) => setFormData({ ...formData, currentPage: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Total pages"
                type="number"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: parseInt(e.target.value) || 0 })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Note</label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  className="text-3xl transition-transform hover:scale-110"
                  style={{ color: i < formData.rating ? currentTheme.warning : currentTheme.border }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingBook(null); }} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingBook ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
