import create from 'zustand'
import shallow from 'zustand/shallow'

const useSiteStore = create(set => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({menuOpen}),
  activePage: null,
  setActivePage: (activePage) => set({activePage})
}))

export const useSiteValues = (keys) => {
  return useSiteStore(state => keys.map(k => state[k]), shallow)
}

export default useSiteStore;