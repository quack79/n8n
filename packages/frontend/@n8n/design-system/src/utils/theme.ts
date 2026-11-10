/**
 * Themes that use a dark colour scheme.
 * Keep in sync with `$dark-like-themes` in `css/mixins/_theme.scss`.
 */
export const DARK_LIKE_THEMES = ['dark', 'midnight', 'ember', 'volt'] as const;

export type DarkLikeTheme = (typeof DARK_LIKE_THEMES)[number];

export function isDarkLikeTheme(theme: string | null | undefined): theme is DarkLikeTheme {
	return DARK_LIKE_THEMES.some((darkLikeTheme) => darkLikeTheme === theme);
}
