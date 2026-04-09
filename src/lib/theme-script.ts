// Inline script that runs before hydration to prevent flash of wrong theme.
// Reads localStorage('theme') and applies `dark` class to <html> if needed.
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t==='dark'||(!t&&m===true)||(t==null&&m);if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`
