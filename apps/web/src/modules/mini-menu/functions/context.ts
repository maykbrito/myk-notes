export interface PluginCtx {
	persist: (key: string, value: string) => void;
	read: (key: string) => string | null;
	setCssVar: (name: string, value: string) => void;
	getCssVar: (name: string) => string;
	query: (sel: string) => Element | null;
}

export const ctx: PluginCtx = {
	persist(key: string, value: string) {
		localStorage.setItem(key, value);
	},
	read(key: string) {
		return localStorage.getItem(key);
	},
	setCssVar(name: string, value: string) {
		document.documentElement.style.setProperty(name, value);
	},
	getCssVar(name: string) {
		return getComputedStyle(document.documentElement).getPropertyValue(name);
	},
	query(sel: string) {
		return document.querySelector(sel);
	},
};
