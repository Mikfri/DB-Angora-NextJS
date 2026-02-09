// src/lib/utils/formatters.ts
export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Ikke angivet';
    
    return new Intl.DateTimeFormat('da-DK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
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
    const d = new Date(dateStr);
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