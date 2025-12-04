export function confirmEmailTemplate(userName, subject, code) {
  return `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h2>مرحبًا ${userName} 👋</h2>
    <p>${subject}</p>
    <div style="font-size: 22px; font-weight: bold; letter-spacing: 3px; margin: 15px 0; color: #333;">
      ${code}
    </div>
  </div>
  `;
}
