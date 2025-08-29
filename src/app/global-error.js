// app/global-error.js
'use client';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }) {
  Sentry.captureException(error);
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <pre>{error.message}</pre>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
