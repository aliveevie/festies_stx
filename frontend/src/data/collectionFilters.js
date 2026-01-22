export const collectionFilters = [
  {
    value: 'all',
    label: 'All Cards',
    sortBy: 'newest',
    sortOrder: 'desc',
  },
  {
    value: 'recent',
    label: 'Recently Added',
    sortBy: 'newest',
    sortOrder: 'desc',
  },
  {
    value: 'favorites',
    label: 'Most Popular',
    sortBy: 'popular',
    sortOrder: 'desc',
  },
  {
    value: 'by-festival',
    label: 'By Festival',
    sortBy: 'festival',
    sortOrder: 'asc',
  },
];

export const collectionSortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name' },
  { value: 'festival', label: 'Festival' },
  { value: 'messageLength', label: 'Message Length' },
  { value: 'popular', label: 'Most Popular' },
];
