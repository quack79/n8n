import { isDarkLikeTheme } from '@n8n/design-system';

import { LOCAL_STORAGE_THEME } from '@/app/constants';
import type { AppliedThemeOption, NamedThemeOption, ThemeOption } from '@/Interface';

const NAMED_THEMES: readonly NamedThemeOption[] = ['light', 'dark', 'midnight', 'ember', 'volt'];

export function applyThemeToBody(theme: ThemeOption, window_?: Window) {
	if (theme === 'system') {
		(window_ ?? window).document.body.removeAttribute('data-theme');
	} else {
		(window_ ?? window).document.body.setAttribute?.('data-theme', theme); // setAttribute can be missing in jsdom environment
	}
}

export function isValidTheme(theme: string | null): theme is NamedThemeOption {
	return NAMED_THEMES.some((namedTheme) => namedTheme === theme);
}

/** The colour scheme of a named theme: every dark-like theme resolves to `dark`. */
export function getThemeColorScheme(theme: NamedThemeOption): AppliedThemeOption {
	return isDarkLikeTheme(theme) ? 'dark' : 'light';
}

// query param allows overriding theme for demo view in preview iframe without flickering
export function getThemeOverride(): NamedThemeOption | null {
	const override = getQueryParam('theme') ?? localStorage.getItem(LOCAL_STORAGE_THEME);

	return isValidTheme(override) ? override : null;
}

function getQueryParam(paramName: string): string | null {
	return new URLSearchParams(window.location.search).get(paramName);
}
