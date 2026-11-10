import { resolve } from 'node:path';
import { compileString } from 'sass';

import { DARK_LIKE_THEMES, isDarkLikeTheme } from './theme';

const mixinsDir = resolve(process.cwd(), 'src', 'css', 'mixins');

function compileWithThemeMixin(source: string): string {
	return compileString(`@use 'theme';\n${source}`, { loadPaths: [mixinsDir] }).css;
}

describe('isDarkLikeTheme', () => {
	it.each(['dark', 'midnight', 'ember', 'volt'])('should return true for %s', (theme) => {
		expect(isDarkLikeTheme(theme)).toBe(true);
	});

	it.each(['light', 'system', '', 'Dark', null, undefined])(
		'should return false for %s',
		(theme) => {
			expect(isDarkLikeTheme(theme)).toBe(false);
		},
	);
});

describe('dark-like-theme() Sass function', () => {
	it('should list the same themes as DARK_LIKE_THEMES', () => {
		const css = compileWithThemeMixin('a { --themes: #{theme.$dark-like-themes}; }');
		const themes = /--themes:\s*([^;]+);/.exec(css)?.[1].split(/,\s*/);

		expect(themes).toEqual([...DARK_LIKE_THEMES]);
	});

	it('should match every dark-like theme with a single :is() selector', () => {
		const css = compileWithThemeMixin('#{theme.dark-like-theme(body)} .a { color: red; }');

		// Sass drops the quotes around attribute values; the selector matches the same elements.
		expect(css).toContain(
			'body:is([data-theme=dark], [data-theme=midnight], [data-theme=ember], [data-theme=volt]) .a {',
		);
	});

	it('should omit the element when none is given', () => {
		const css = compileWithThemeMixin('#{theme.dark-like-theme()} .a { color: red; }');

		expect(css.trimStart()).toMatch(/^:is\(\[data-theme=dark\],/);
	});
});
