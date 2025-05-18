export interface Author {
  name: string;
  email: string;
}

export interface Note {
  id: string;
  _id?: string;
  title: string;
  author: Author;
  content: string;
}

export type NotesState = {
  notes: Note[];
  totalNotes: number;
  currentPage: number;
  loading: boolean;
  error: string;
  isAdding: boolean;
  newContent: string;
  notification: string;
};

export type NotesAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { notes: Note[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_TOTAL'; payload: number }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'TOGGLE_ADD'; payload: boolean }
  | { type: 'SET_NEW_CONTENT'; payload: string }
  | { type: 'ADD_NOTE_SUCCESS'; payload: Note }
  | { type: 'UPDATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'DELETE_NOTE_SUCCESS'; payload: string }
  | { type: 'SET_NOTIFICATION'; payload: string };

export const initialState: NotesState = {
  notes: [],
  totalNotes: 0,
  currentPage: 1,
  loading: false,
  error: '',
  isAdding: false,
  newContent: '',
  notification: 'Notification area',
};

export function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, notes: action.payload.notes };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_TOTAL':
      return { ...state, totalNotes: action.payload };

    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'TOGGLE_ADD':
      return { ...state, isAdding: action.payload };

    case 'SET_NEW_CONTENT':
      return { ...state, newContent: action.payload };

    case 'ADD_NOTE_SUCCESS':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        totalNotes: state.totalNotes + 1,
        isAdding: false,
        newContent: '',
        notification: 'Added a new note',
      };

    case 'UPDATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        notification: 'Note updated',
      };

    case 'DELETE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
        totalNotes: state.totalNotes - 1,
        notification: 'Note deleted',
      };

    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };

    default:
      return state;
  }
}