import { SORT_CONTACTS } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_CONTACTS.ASC,
  sortBy = '_id',
  filters = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const queryFilter = { userId }; // ✅ Фільтрація по userId

  if (filters.contactType) {
    queryFilter.contactType = filters.contactType;
  }
  if (filters.isFavorite !== undefined) {
    queryFilter.isFavorite = filters.isFavorite;
  }

  const [contacts, contactsCount] = await Promise.all([
    ContactsCollection.find(queryFilter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
    ContactsCollection.countDocuments(queryFilter),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  const contact = await ContactsCollection.findOne({ _id: id, userId }); // ✅ Фільтрація по userId
  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await ContactsCollection.create({
    ...payload, // ✅ Розпиляємо payload
    userId,
  });
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId, // ✅ Фільтрація по userId
  });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const { userId, upsert = false } = options;

  // Для upsert гарантуємо, що userId буде в новому документі
  const updateData = upsert ? { ...payload, userId } : payload;

  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    {
      new: true,
      upsert,
      runValidators: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
