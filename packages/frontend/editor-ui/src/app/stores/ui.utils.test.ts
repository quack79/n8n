import { LOCAL_STORAGE_THEME } from '@/app/constants';

import { applyThemeToBody, getThemeColorScheme, getThemeOverride, isValidTheme } from './ui.utils';

describe('ui.utils', () => {
	afterEach(() => {
		document.body.removeAttribute('data-theme');
		localStorage.clear();
		window.history.replaceState({}, '', '/');
	});

	describe('isValidTheme', () => {
		it.each(['light', 'dark', 'midnight', 'ember', 'volt'])('should accept %s', (theme) => {
			expect(isValidTheme(theme)).toBe(true);
		});

		it.each(['system', 'sepia', '', 'Midnight', null])('should reject %s', (theme) => {
			expect(isValidTheme(theme)).toBe(false);
		});
	});

	describe('applyThemeToBody', () => {
		it.each(['light', 'dark', 'midnight', 'ember', 'volt'] as const)(
			'should set data-theme to %s',
			(theme) => {
				applyThemeToBody(theme);

				expect(document.body.getAttribute('data-theme')).toBe(theme);
			},
		);

		it('should remove data-theme for the system theme', () => {
			applyThemeToBody('ember');
			applyThemeToBody('system');

			expect(document.body.hasAttribute('data-theme')).toBe(false);
		});
	});

	describe('getThemeColorScheme', () => {
		it.each(['dark', 'midnight', 'ember', 'volt'] as const)(
			'should resolve %s to dark',
			(theme) => {
				expect(getThemeColorScheme(theme)).toBe('dark');
			},
		);

		it('should resolve light to light', () => {
			expect(getThemeColorScheme('light')).toBe('light');
		});
	});

	describe('getThemeOverride', () => {
		it('should read a new theme from the theme query parameter', () => {
			window.history.replaceState({}, '', '/?theme=volt');

			expect(getThemeOverride()).toBe('volt');
		});

		it('should prefer the query parameter over the stored theme', () => {
			localStorage.setItem(LOCAL_STORAGE_THEME, 'ember');
			window.history.replaceState({}, '', '/?theme=midnight');

			expect(getThemeOverride()).toBe('midnight');
		});

		it('should fall back to the stored theme', () => {
			localStorage.setItem(LOCAL_STORAGE_THEME, 'ember');

			expect(getThemeOverride()).toBe('ember');
		});

		it('should ignore an unknown theme', () => {
			window.history.replaceState({}, '', '/?theme=sepia');

			expect(getThemeOverride()).toBeNull();
		});
	});
});
