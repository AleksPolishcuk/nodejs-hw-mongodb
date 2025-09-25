const parseContactType = (type) => {
  if (typeof type !== 'string') return undefined;

  const validTypes = ['work', 'home', 'personal'];
  const normalizedType = type.toLowerCase();

  return validTypes.includes(normalizedType) ? normalizedType : undefined;
};

const parseIsFavorite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;

  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;

  return;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  return {
    contactType: parseContactType(type),
    isFavorite: parseIsFavorite(isFavourite),
  };
};
