// src/lib/utils/formatters.ts

/**
 * Fortolker en dato-streng som UTC.
 * API'et returnerer datetime-strenge uden timezone-suffix (fx "2026-05-03T13:06:58"),
 * men værdierne er UTC. Uden 'Z' vil JavaScript fortolke dem som lokal tid,
 * hvilket giver 2 timers forskydning for brugere i CEST (UTC+2).
 */
function parseUtcDate(dateString: string): Date {
    if (/Z$|[+-]\d{2}:\d{2}$/.test(dateString)) {
        return new Date(dateString);
    }
    return new Date(dateString + 'Z');
}

export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Ikke angivet';
    
    return new Intl.DateTimeFormat('da-DK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(parseUtcDate(dateString));
}

export function formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) return 'Pris ikke angivet';
    
    return new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'DKK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export function formatBlogDate(dateStr?: string | null): string {
    if (!dateStr) return '';
    const d = parseUtcDate(dateStr);
    const currentYear = new Date().getFullYear();
    const dateYear = d.getFullYear();
    
    if (dateYear === currentYear) {
        // Samme år: "Jan 5"
        return d.toLocaleDateString('da-DK', { month: 'short', day: 'numeric' });
    } else {
        // Andet år: "Jan 5, 2025"
        return d.toLocaleDateString('da-DK', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return 'Ikke angivet';
    const date = parseUtcDate(dateString);
    return new Intl.DateTimeFormat('da-DK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

export function formatRelativeDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Ikke angivet';
    const date = parseUtcDate(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMs / 1000);

    const rtf = new Intl.RelativeTimeFormat('da-DK', { numeric: 'auto' });
    const absSeconds = Math.abs(diffSeconds);

    const fmt = (value: number, unit: Intl.RelativeTimeFormatUnit) => {
        const s = rtf.format(value, unit);
        return s
            .replace(/^for\s/, '')          // "for X siden" → "X siden"
            .replace(/\bminutter?\b/, 'min'); // "minutter" / "minut" → "min"
    };

    if (absSeconds < 60) {
        return fmt(Math.round(diffSeconds), 'second');
    }

    const diffMinutes = Math.round(diffSeconds / 60);
    if (Math.abs(diffMinutes) < 60) {
        return fmt(diffMinutes, 'minute');
    }

    const diffHours = Math.round(diffSeconds / 3600);
    if (Math.abs(diffHours) < 24) {
        return fmt(diffHours, 'hour');
    }

    const diffDays = Math.round(diffSeconds / (3600 * 24));
    if (Math.abs(diffDays) < 7) {
        return fmt(diffDays, 'day');
    }

    const diffWeeks = Math.round(diffSeconds / (3600 * 24 * 7));
    if (Math.abs(diffWeeks) < 4) {
        return fmt(diffWeeks, 'week');
    }

    return formatDate(dateString);
}
