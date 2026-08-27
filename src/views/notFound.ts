import { layout } from './layout.js';
import { footer } from './footer.js';

export const notFoundView = (): string => layout({
  title: '404 Not Found · Skiddle Toolbox',
  description: 'The page you are looking for does not exist.',
  centered: true,
  body: `
    <div class="not-found-container">
      <div class="not-found-code" aria-hidden="true">404</div>
      <h1 class="not-found-heading">Page not found</h1>
      <p class="not-found-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="not-found-actions">
        <a href="/" class="tb-btn tb-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Back to Home
        </a>
      </div>
    </div>

    ${footer()}

    <style>
      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 50vh;
        padding: 2rem 1rem;
      }
      .not-found-code {
        font-size: clamp(5rem, 15vw, 10rem);
        font-weight: 800;
        line-height: 1;
        background: linear-gradient(
          135deg,
          hsl(var(--accent-hue, 250) 85% 72%),
          hsl(var(--accent-hue, 250) 60% 55%)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 0.85;
        margin-bottom: 0.25rem;
        user-select: none;
      }
      .not-found-heading {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 0.5rem;
      }
      .not-found-message {
        color: var(--text-secondary);
        font-size: 1rem;
        line-height: 1.6;
        max-width: 380px;
        margin: 0 0 1.5rem;
      }
      .not-found-actions {
        display: flex;
        gap: 0.75rem;
      }
      .not-found-actions .tb-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
    </style>
  `,
});
