// tests/notes.test.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/notes';

test.describe('Notes Application', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('should display notes with correct attributes', async ({ page }) => {
        // Get all note elements
        const notes = await page.locator('.note').all();

        // Debug: Print each note's HTML and ID
        for (let i = 0; i < notes.length; i++) {
            const id = await notes[i].getAttribute('id');
            console.log(`Note ${i} ID:`, id);
            console.log(await notes[i].innerHTML());
        }

        // Verify all notes have IDs
        for (const note of notes) {
            const id = await note.getAttribute('id');
            expect(id).toBeTruthy(); // Fails if ID is null/empty
        }
    });

    test.describe('Pagination', () => {
        test('should have correct navigation buttons', async ({ page }) => {
            // Check main navigation buttons exist with correct names
            await expect(page.getByRole('button', { name: 'First' })).toHaveAttribute('name', 'first');
            await expect(page.getByRole('button', { name: 'Previous' })).toHaveAttribute('name', 'previous');
            await expect(page.getByRole('button', { name: 'Next' })).toHaveAttribute('name', 'next');
            await expect(page.getByRole('button', { name: 'Last' })).toHaveAttribute('name', 'last');
        });

        test('should display correct page buttons based on current page', async ({ page }) => {
            // Get total notes count from API to calculate total pages
            const response = await page.request.get(API_URL);
            const notes = await response.json();

            // Check page buttons count (max 5)
            const pageButtons = await page.locator('[name^="page-"]').all();
            expect(pageButtons.length).toBeLessThanOrEqual(5);
            expect(pageButtons.length).toBeGreaterThanOrEqual(1);

            // Check first page is active initially
            const firstPageButton = page.getByRole('button', { name: '1' });
            await expect(firstPageButton).toHaveAttribute('name', 'page-1');
            await expect(firstPageButton).toHaveCSS('font-weight', '700'); // bold for active page
        });

        test('should disable navigation buttons when appropriate', async ({ page }) => {
            // On first page, previous and first should be disabled
            await expect(page.getByRole('button', { name: 'First' })).toBeDisabled();
            await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();

            // Go to last page (you might need to implement this navigation in your UI)
            await page.getByRole('button', { name: 'Last' }).click();

            // On last page, next and last should be disabled
            await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
            await expect(page.getByRole('button', { name: 'Last' })).toBeDisabled();
        });

        test('should update displayed notes when changing pages', async ({ page }) => {
            // Get initial notes
            const initialNotes = await page.locator('.note').all();
            const initialNoteIds = await Promise.all(initialNotes.map(note => note.getAttribute('id')));

            // Go to next page
            await page.getByRole('button', { name: 'Next' }).click();

            // Get new notes
            const newNotes = await page.locator('.note').all();
            const newNoteIds = await Promise.all(newNotes.map(note => note.getAttribute('id')));

            // Verify notes changed
            expect(newNoteIds).not.toEqual(initialNoteIds);
        });
    });
});