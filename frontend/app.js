import { config, endpoints } from './config.js';

const PATTERNS = [
	'All Problems',
	'Arrays & Hashing',
	'Two Pointers',
	'Sliding Window',
	'Stack',
	'Binary Search',
	'Linked List',
	'Trees',
	'Heap',
	'Backtracking',
	'Tries',
	'Graphs',
	'Dynamic Programming',
	'Greedy',
	'Intervals',
	'Maths',
	'Bit Manipulation'
];

const state = {
	activePattern: 'All Problems',
	problems: [],
	filteredProblems: [],
	editingProblemId: null,
	loading: false,
	error: null,
};

// DOM
const patternListEl = document.getElementById('pattern-list');
const currentPatternEl = document.getElementById('current-pattern');
const resultCountEl = document.getElementById('result-count');
const problemsContainerEl = document.getElementById('problems-container');
const addProblemBtn = document.getElementById('add-problem-btn');
const modalEl = document.getElementById('problem-modal');
const modalTitleEl = document.getElementById('modal-title');
const formEl = document.getElementById('problem-form');
const patternSelectEl = document.getElementById('pattern');
const searchInputEl = document.getElementById('search-input');
const difficultyFilterEl = document.getElementById('difficulty-filter');
const notesEditorEl = document.getElementById('notes-editor');
const notesHiddenEl = document.getElementById('notes');

// Details modal elements
const detailsModalEl = document.getElementById('details-modal');
const detailsTitleEl = document.getElementById('details-title');
const detailsProblemLinkEl = document.getElementById('details-problem-link');
const detailsVideoLinkEl = document.getElementById('details-video-link');
const detailsNotesEl = document.getElementById('details-notes');

function setLoading(loading) {
	state.loading = loading;
	if (loading) {
		problemsContainerEl.innerHTML = `<div class="loader">Loading...</div>`;
	}
}

function showError(message) {
	console.error(message);
	problemsContainerEl.innerHTML = `<div class="empty">${message}</div>`;
}

function buildSidebar() {
	patternListEl.innerHTML = '';
	PATTERNS.forEach((name) => {
		const item = document.createElement('div');
		item.className = 'pattern-item' + (state.activePattern === name ? ' active' : '');
		item.textContent = name;
		item.addEventListener('click', () => {
			setActivePattern(name);
		});
		patternListEl.appendChild(item);
	});
}

function populatePatternSelect() {
	patternSelectEl.innerHTML = '';
	PATTERNS.filter(p => p !== 'All Problems').forEach((p) => {
		const opt = document.createElement('option');
		opt.value = p;
		opt.textContent = p;
		patternSelectEl.appendChild(opt);
	});
}

function setActivePattern(pattern) {
	state.activePattern = pattern;
	currentPatternEl.textContent = pattern;
	Array.from(patternListEl.children).forEach((el) => {
		el.classList.toggle('active', el.textContent === pattern);
	});
	// If user returns to All Problems, reset filters so everything shows
	if (pattern === 'All Problems') {
		if (searchInputEl) searchInputEl.value = '';
		if (difficultyFilterEl) difficultyFilterEl.value = '';
	}
	loadProblems();
}

async function fetchJson(url, options = {}) {
	const res = await fetch(url, options);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `Request failed: ${res.status}`);
	}
	return res.json();
}

async function loadProblems() {
	try {
		setLoading(true);
		let data = [];
		const difficultyFilter = difficultyFilterEl.value.trim();
		const searchQuery = searchInputEl.value.trim().toLowerCase();

		if (state.activePattern === 'All Problems') {
			data = await fetchJson(endpoints.problems());
		} else {
			data = await fetchJson(endpoints.pattern(state.activePattern));
		}

		state.problems = Array.isArray(data) ? data : (data?.content || []);

		let filtered = state.problems;
		if (difficultyFilter) {
			filtered = filtered.filter(p => (p.difficulty || '').toLowerCase() === difficultyFilter.toLowerCase());
		}
		if (searchQuery) {
			filtered = filtered.filter(p => (p.title || '').toLowerCase().includes(searchQuery));
		}

		state.filteredProblems = filtered;
		renderProblems();
	} catch (err) {
		showError('Failed to load problems.');
	} finally {
		setLoading(false);
	}
}

function difficultyClass(difficulty) {
	switch ((difficulty || '').toLowerCase()) {
		case 'easy': return 'easy';
		case 'medium': return 'medium';
		case 'hard': return 'hard';
		default: return '';
	}
}

function getField(p, names) {
	for (const n of names) {
		if (p[n]) return p[n];
	}
	return '';
}

function stripHtml(html) {
	const div = document.createElement('div');
	div.innerHTML = html || '';
	return (div.textContent || div.innerText || '').trim();
}

function renderProblems() {
	if (!state.filteredProblems.length) {
		problemsContainerEl.innerHTML = `<div class="empty">No problems found.</div>`;
		resultCountEl.textContent = '0 results';
		return;
	}
	resultCountEl.textContent = `${state.filteredProblems.length} result${state.filteredProblems.length === 1 ? '' : 's'}`;

	const tpl = document.getElementById('problem-card-template');
	problemsContainerEl.innerHTML = '';
	state.filteredProblems.forEach((p) => {
		const node = tpl.content.cloneNode(true);
		const titleLink = node.querySelector('.problem-title');
		const badge = node.querySelector('.badge');
		const editBtn = node.querySelector('.edit-btn');
		const deleteBtn = node.querySelector('.delete-btn');

		titleLink.textContent = p.title || 'Untitled';
		titleLink.href = `problem.html?id=${encodeURIComponent(p.id)}`;
		badge.textContent = (p.difficulty || '-');
		badge.classList.add(difficultyClass(p.difficulty));

		editBtn.addEventListener('click', () => openModalForEdit(p));
		deleteBtn.addEventListener('click', () => confirmDelete(p));
		problemsContainerEl.appendChild(node);
	});
}

function showDetailsModal() {
	detailsModalEl.classList.remove('hidden');
	detailsModalEl.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
}
function hideDetailsModal() {
	detailsModalEl.classList.add('hidden');
	detailsModalEl.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	// clear
	detailsTitleEl.textContent = 'Problem';
	detailsNotesEl.textContent = 'No notes available.';
	detailsProblemLinkEl.style.display = 'none';
	detailsVideoLinkEl.style.display = 'none';
}

async function openDetailsById(id) {
	try {
		detailsTitleEl.textContent = 'Loading...';
		showDetailsModal();
		const p = await fetchJson(endpoints.problemById(id));
		detailsTitleEl.textContent = p.title || 'Untitled';
		const problemLink = getField(p, ['problemLink', 'problemUrl', 'problem_url', 'link']);
		const videoLink = getField(p, ['videoLink', 'videoUrl', 'video_link']);
		const notes = getField(p, ['notes', 'description', 'text']);
		if (problemLink) { detailsProblemLinkEl.href = problemLink; detailsProblemLinkEl.style.display = ''; } else { detailsProblemLinkEl.style.display = 'none'; }
		if (videoLink) { detailsVideoLinkEl.href = videoLink; detailsVideoLinkEl.style.display = ''; } else { detailsVideoLinkEl.style.display = 'none'; }
		if (notes) { detailsNotesEl.innerHTML = notes; } else { detailsNotesEl.textContent = 'No notes available.'; }
	} catch (e) {
		detailsTitleEl.textContent = 'Failed to load';
	}
}

function openModal() {
	modalEl.classList.remove('hidden');
	modalEl.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
}
function closeModal() {
	modalEl.classList.add('hidden');
	modalEl.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	formEl.reset();
	if (notesEditorEl) notesEditorEl.innerHTML = '';
	state.editingProblemId = null;
	modalTitleEl.textContent = 'Add Problem';
}

function openModalForAdd() {
	state.editingProblemId = null;
	modalTitleEl.textContent = 'Add Problem';
	openModal();
}

function openModalForEdit(problem) {
	state.editingProblemId = problem.id;
	modalTitleEl.textContent = 'Edit Problem';
	formEl.title.value = problem.title || '';
	formEl.difficulty.value = (problem.difficulty || '').toLowerCase();
	formEl.pattern.value = problem.pattern || '';
	formEl.problemLink.value = '';
	formEl.videoLink.value = '';
	if (notesEditorEl) notesEditorEl.innerHTML = '';
	if (notesHiddenEl) notesHiddenEl.value = '';
	openModal();
}

function capitalizeFirst(s) {
	if (!s) return s;
	const lower = String(s).toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function buildPayloadFromForm(form) {
	const fd = new FormData(form);
	const obj = Object.fromEntries(fd.entries());
	const htmlNotes = notesEditorEl ? notesEditorEl.innerHTML.trim() : (obj.notes || '').trim();
	return {
		title: obj.title || '',
		problem_url: obj.problemLink || '',
		video_link: obj.videoLink || '',
		text: htmlNotes || '',
		difficulty: capitalizeFirst(obj.difficulty || ''),
		pattern: obj.pattern || ''
	};
}

async function createProblem(payload) {
	return fetchJson(endpoints.problems(), {
		method: 'POST',
		headers: config.headers,
		body: JSON.stringify(payload)
	});
}

async function updateProblem(id, payload) {
	return fetchJson(endpoints.problemById(id), {
		method: 'POST',
		headers: config.headers,
		body: JSON.stringify(payload)
	});
}

async function deleteProblem(id) {
	const res = await fetch(endpoints.problemById(id), { method: 'DELETE' });
	if (!res.ok) throw new Error('Delete failed');
}

function confirmDelete(problem) {
	const yes = confirm(`Delete "${problem.title}"?`);
	if (!yes) return;
	deleteProblem(problem.id)
		.then(() => loadProblems())
		.catch(() => alert('Failed to delete.'));
}

function setupEvents() {
	// Modal open/close
	addProblemBtn.addEventListener('click', openModalForAdd);
	modalEl.addEventListener('click', (e) => {
		if (e.target.matches('[data-close]')) closeModal();
		if (e.target === modalEl.querySelector('.modal-backdrop')) closeModal();
	});
	if (detailsModalEl) {
		detailsModalEl.addEventListener('click', (e) => {
			if (e.target.matches('[data-close]')) hideDetailsModal();
			if (e.target === detailsModalEl.querySelector('.modal-backdrop')) hideDetailsModal();
		});
	}
		document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			if (!modalEl.classList.contains('hidden')) closeModal();
			if (!detailsModalEl.classList.contains('hidden')) hideDetailsModal();
		}
	});

	// Rich text toolbar
	const toolbar = document.querySelector('.rt-toolbar');
	if (toolbar) toolbar.addEventListener('click', (e) => {
		const btn = e.target.closest('.rt-btn');
		if (!btn) return;
		const cmd = btn.getAttribute('data-cmd');
		if (btn.hasAttribute('data-link')) {
			const url = prompt('Enter URL');
			if (url) document.execCommand('createLink', false, url);
			return;
		}
		if (cmd) {
			document.execCommand(cmd, false, null);
			notesEditorEl && notesEditorEl.focus();
		}
	});

	// Filters
	searchInputEl.addEventListener('input', debounce(() => loadProblems(), 300));
	difficultyFilterEl.addEventListener('change', () => loadProblems());

	// Form submit
	formEl.addEventListener('submit', async (e) => {
		e.preventDefault();
		const payload = buildPayloadFromForm(formEl);
		try {
			if (!payload.title || !payload.difficulty || !payload.pattern) {
				alert('Please fill Title, Difficulty and Pattern');
				return;
			}
			if (state.editingProblemId) {
				await updateProblem(state.editingProblemId, payload);
			} else {
				await createProblem(payload);
			}
			closeModal();
			await loadProblems();
		} catch (err) {
			alert('Save failed.');
		}
	});
}

function debounce(fn, wait) {
	let t;
	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn.apply(null, args), wait);
	};
}

function init() {
	buildSidebar();
	populatePatternSelect();
	setupEvents();
	loadProblems();
}

document.addEventListener('DOMContentLoaded', init);
