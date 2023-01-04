import sender from '@apis/sender';
import { notesEndpoint } from '@apis/endpoints/notes';

import { TApiResponse } from '@appTypes/common/response';
import { INote } from '@appTypes/note';

export const listAllNotes = async (input: any): TApiResponse<INote[]> => sender()
  .get(notesEndpoint.listNotes, { ...input });

export const t = (): void => { console.log(1); };
