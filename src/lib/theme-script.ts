// Inline script that runs before hydration to prevent flash of wrong theme.
// Reads localStorage('theme') and applies `dark` class to <html> if needed.
export const themeScript = `(function(){try{var r=document.documentElement;var t=localStorage.getItem('theme');var d=t!=='light';if(d)r.classList.add('dark');else r.classList.remove('dark');r.style.colorScheme=d?'dark':'light';var pl=localStorage.getItem('palette-light')||'b';var pd=localStorage.getItem('palette-dark')||'d3';r.setAttribute('data-light',pl);r.setAttribute('data-dark',pd);}catch(e){}})();`
