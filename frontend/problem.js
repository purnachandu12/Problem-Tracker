import { endpoints } from './config.js';

function getQueryParam(name) {
	const params = new URLSearchParams(window.location.search);
	return params.get(name);
}

async function fetchJson(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed');
	return res.json();
}

function difficultyClass(difficulty) {
	switch ((difficulty || '').toLowerCase()) {
		case 'easy': return 'easy';
		case 'medium': return 'medium';
		case 'hard': return 'hard';
		default: return '';
	}
}

function getField(o, names) {
	for (const n of names) {
		if (o && o[n]) return o[n];
	}
	return '';
}

function formatDate(iso) {
	try {
		const d = new Date(iso);
		if (isNaN(d)) return '';
		return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
	} catch { return ''; }
}

async function loadProblem() {
	const id = getQueryParam('id');
	if (!id) return;
	try {
		const p = await fetchJson(endpoints.problemById(id));
		document.getElementById('detail-title').textContent = p.title || 'Untitled';
		const diff = document.getElementById('detail-difficulty');
		diff.textContent = p.difficulty || '-';
		diff.classList.add(difficultyClass(p.difficulty));
		document.getElementById('detail-pattern').textContent = p.pattern || '-';
		const dateSolved = getField(p, ['date_solved', 'dateSolved']);
		document.getElementById('detail-date').textContent = formatDate(dateSolved) || '—';

		const problemLink = getField(p, ['problemLink', 'problemUrl', 'problem_url', 'link']);
		const videoLink = getField(p, ['videoLink', 'videoUrl', 'video_link']);
		const notes = getField(p, ['notes', 'description', 'text']);

		const problemLinkEl = document.getElementById('detail-problem-link');
		const videoLinkEl = document.getElementById('detail-video-link');
		if (problemLink) { problemLinkEl.href = problemLink; problemLinkEl.style.display = ''; } else { problemLinkEl.style.display = 'none'; }
		if (videoLink) { videoLinkEl.href = videoLink; videoLinkEl.style.display = ''; } else { videoLinkEl.style.display = 'none'; }

		const notesEl = document.getElementById('detail-notes');
		if (notes) { notesEl.innerHTML = notes; } else { notesEl.textContent = 'No notes available.'; }
	} catch (e) {
		document.getElementById('detail-title').textContent = 'Failed to load problem';
	}
}

document.addEventListener('DOMContentLoaded', loadProblem);
