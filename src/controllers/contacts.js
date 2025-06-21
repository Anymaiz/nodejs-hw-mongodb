import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { envVal } from '../utils/getEnvVar.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (envVal('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact({
    _id: contactId,
    userId: req.user._id ,
    ...req.body, photo: photoUrl
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact({ _id: contactId, userId: req.user._id });

  if (!contact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }
  res.status(204).send();
};
