import { SORT_CONTACTS } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_CONTACTS.ASC, SORT_CONTACTS.DESC].includes(
    sortOrder,
  );
  if (isKnownOrder) return sortOrder;
  return SORT_CONTACTS.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfContact = [
    '_id',
    'name',
    'email',
    'phone',
    'isFavorite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];
  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }
  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
