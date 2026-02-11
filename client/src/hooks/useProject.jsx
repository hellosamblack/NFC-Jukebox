/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react';

const ProjectContext = createContext(null);

const initialState = {
  stickers: [],
  spotifyToken: null,
  spotifyExpiry: null,
  ytAccessToken: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_STICKER':
      return { ...state, stickers: [...state.stickers, { ...action.payload, id: crypto.randomUUID() }] };
    case 'UPDATE_STICKER':
      return {
        ...state,
        stickers: state.stickers.map((s) => (s.id === action.id ? { ...s, ...action.updates } : s)),
      };
    case 'REMOVE_STICKER':
      return { ...state, stickers: state.stickers.filter((s) => s.id !== action.id) };
    case 'SET_SPOTIFY_AUTH':
      return { ...state, spotifyToken: action.token, spotifyExpiry: action.expiry };
    case 'SET_YT_AUTH':
      return { ...state, ytAccessToken: action.token };
    case 'LOAD_PROJECT': {
      const stickersWithIds = (action.stickers || []).map((sticker) =>
        sticker && sticker.id ? sticker : { ...sticker, id: crypto.randomUUID() },
      );
      return { ...state, stickers: stickersWithIds };
    }
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addSticker = useCallback((config) => {
    dispatch({ type: 'ADD_STICKER', payload: config });
  }, []);

  const updateSticker = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_STICKER', id, updates });
  }, []);

  const removeSticker = useCallback((id) => {
    dispatch({ type: 'REMOVE_STICKER', id });
  }, []);

  const setSpotifyAuth = useCallback((token, expiry) => {
    dispatch({ type: 'SET_SPOTIFY_AUTH', token, expiry });
  }, []);

  const setYtAuth = useCallback((token) => {
    dispatch({ type: 'SET_YT_AUTH', token });
  }, []);

  const saveProject = useCallback(() => {
    const data = JSON.stringify({ version: 1, stickers: state.stickers }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nfc-jukebox-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.stickers]);

  const loadProject = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          dispatch({ type: 'LOAD_PROJECT', stickers: data.stickers || [] });
          resolve(data.stickers?.length || 0);
        } catch {
          reject(new Error('Invalid project file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const clearProject = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const value = {
    ...state,
    addSticker,
    updateSticker,
    removeSticker,
    setSpotifyAuth,
    setYtAuth,
    saveProject,
    loadProject,
    clearProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
