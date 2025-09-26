import { SORT_CONTACTS } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_CONTACTS.ASC,
  sortBy = '_id',
  filters = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const validSortOrders = [SORT_CONTACTS.ASC, SORT_CONTACTS.DESC];
  const validSortFields = [
    '_id',
    'name',
    'email',
    'phone',
    'contactType',
    'createdAt',
  ];

  const finalSortOrder = validSortOrders.includes(sortOrder)
    ? sortOrder
    : SORT_CONTACTS.ASC;
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : '_id';

  const queryFilter = {};

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
      .sort({ [finalSortBy]: finalSortOrder })
      .exec(),
    ContactsCollection.countDocuments(queryFilter),
  ]);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id) => {
  const contacts = await ContactsCollection.findById(id);
  return contacts;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
