import { Component, createSignal, onMount } from 'solid-js';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

/**
 * Simple cookie‑consent modal.
 * Shows a ConfirmModal when the cookie `cookie_consent` is not present.
 * On user choice we store the decision in a cookie that lives for 1 year.
 */
const CookieConsent: Component = () => {
    const [open, setOpen] = createSignal(false);

    const COOKIE_NAME = 'cookie_consent';
    const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

    const getCookie = (name: string): string | null => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    };

    const setCookie = (name: string, value: string) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    };

    onMount(() => {
        const existing = getCookie(COOKIE_NAME);
        if (!existing) {
            setOpen(true);
        }
    });

    const accept = () => {
        setCookie(COOKIE_NAME, 'accepted');
        setOpen(false);
    };

    const decline = () => {
        setCookie(COOKIE_NAME, 'declined');
        setOpen(false);
    };

    return (
        <ConfirmModal
            id="cookie-consent"
            open={open()}
            setOpen={setOpen}
            title="Cookie Consent"
            description="We use cookies to improve your experience. Do you accept?"
            confirmLabel="Yes"
            abortLabel="No"
            onConfirm={accept}
            onAbort={decline}
        />
    );
};

export default CookieConsent;
