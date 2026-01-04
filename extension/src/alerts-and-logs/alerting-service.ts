
export function showSecurityWarning(reasons: string[]) {
    return new Promise<void>((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'prompt-security-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(4px); font-family: 'Google Sans', sans-serif;
        `;

        // Create Modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white; padding: 32px; border-radius: 16px;
            max-width: 450px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;

        modal.innerHTML = `
            <div style="font-size: 50px; margin-bottom: 16px;">⚠️</div>
            <h2 style="color: #d93025; margin-bottom: 8px;">Security Check Failed</h2>
            <p style="color: #3c4043; line-height: 1.5; margin-bottom: 24px;">
                The PDF content was flagged for the following reason:<br>
                <strong>${reasons}</strong>
            </p>
            <button id="confirm-security-btn" style="
                background: #1a73e8; color: white; border: none;
                padding: 10px 24px; border-radius: 8px; cursor: pointer;
                font-weight: 500; font-size: 14px;
            ">I Understand</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('confirm-security-btn')?.addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve(); // This "unblocks" the await in the other file
        });
    });
}