import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoGallery, type PhotoItem } from './PhotoGallery';

vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    format: vi.fn().mockReturnValue('01 Jan 2026 10:30'),
  };
});

describe('PhotoGallery', () => {
  const mockPhotos: PhotoItem[] = [
    {
      id: 'photo-1',
      url: 'https://example.com/before.jpg',
      type: 'BEFORE',
      latitude: 47.4739884,
      longitude: -0.5541875,
      createdAt: '2026-01-01T10:30:00Z',
    },
    {
      id: 'photo-2',
      url: 'https://example.com/during.jpg',
      type: 'DURING',
      createdAt: '2026-01-01T11:00:00Z',
    },
    {
      id: 'photo-3',
      url: 'https://example.com/after.jpg',
      type: 'AFTER',
      latitude: 47.4739884,
      longitude: -0.5541875,
      createdAt: '2026-01-01T14:00:00Z',
    },
  ];

  const mockOnDelete = vi.fn();
  const mockOnCompare = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when photos array is empty', () => {
    const { container } = render(
      <PhotoGallery photos={[]} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays photos in a grid', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('displays filter chips', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    expect(screen.getByText('Tous')).toBeInTheDocument();
    expect(screen.getAllByText(/Avant/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pendant/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Apres/).length).toBeGreaterThan(0);
  });

  it('shows photo counts in filter chips', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    expect(screen.getAllByText('(1)', { exact: false }).length).toBe(3);
  });

  it('filters photos by type when filter chip is clicked', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const filterButtons = screen.getAllByRole('button');
    const avantFilter = filterButtons.find((btn) => btn.textContent?.includes('Avant') && btn.textContent?.includes('('));
    fireEvent.click(avantFilter!);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
  });

  it('shows compare button when before and after photos exist', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    expect(screen.getByText('Comparer avant/apres')).toBeInTheDocument();
  });

  it('does not show compare button when no before photos exist', () => {
    const photosWithoutBefore = mockPhotos.filter((p) => p.type !== 'BEFORE');
    render(
      <PhotoGallery photos={photosWithoutBefore} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    expect(screen.queryByText('Comparer avant/apres')).not.toBeInTheDocument();
  });

  it('does not show compare button when no after photos exist', () => {
    const photosWithoutAfter = mockPhotos.filter((p) => p.type !== 'AFTER');
    render(
      <PhotoGallery photos={photosWithoutAfter} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    expect(screen.queryByText('Comparer avant/apres')).not.toBeInTheDocument();
  });

  it('calls onCompare when compare button is clicked', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const compareButton = screen.getByText('Comparer avant/apres');
    fireEvent.click(compareButton);

    expect(mockOnCompare).toHaveBeenCalledTimes(1);
  });

  it('opens lightbox when photo is clicked', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    expect(screen.getByRole('heading', { name: 'Photo' })).toBeInTheDocument();
  });

  it('shows photo metadata in lightbox', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Position GPS')).toBeInTheDocument();
  });

  it('shows delete button in lightbox when onDelete is provided', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    expect(screen.getByText('Supprimer')).toBeInTheDocument();
  });

  it('does not show delete button when onDelete is not provided', () => {
    render(
      <PhotoGallery photos={mockPhotos} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    expect(screen.queryByText('Supprimer')).not.toBeInTheDocument();
  });

  it('shows confirmation dialog when delete is clicked', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);

    expect(screen.getByText('Supprimer la photo')).toBeInTheDocument();
    expect(screen.getByText(/irreversible/)).toBeInTheDocument();
  });

  it('calls onDelete when deletion is confirmed', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);

    const confirmButtons = screen.getAllByText('Supprimer');
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledWith('photo-1');
  });

  it('closes confirmation dialog when cancel is clicked', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const firstPhoto = screen.getAllByRole('img')[0].closest('div');
    fireEvent.click(firstPhoto!);

    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/irreversible/)).not.toBeInTheDocument();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('shows empty message when filter returns no results', () => {
    const onlyDuringPhotos: PhotoItem[] = [
      {
        id: 'photo-1',
        url: 'https://example.com/during.jpg',
        type: 'DURING',
        createdAt: '2026-01-01T11:00:00Z',
      },
    ];

    render(
      <PhotoGallery photos={onlyDuringPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const filterButtons = screen.getAllByRole('button');
    const avantFilter = filterButtons.find((btn) => btn.textContent?.includes('Avant'));
    fireEvent.click(avantFilter!);

    expect(screen.getByText(/Aucune photo de type/)).toBeInTheDocument();
  });

  it('displays type badge on each photo', () => {
    render(
      <PhotoGallery photos={mockPhotos} onDelete={mockOnDelete} onCompare={mockOnCompare} />
    );

    const badges = screen.getAllByText(/Avant|Pendant|Apres/);
    expect(badges.length).toBeGreaterThan(0);
  });
});
