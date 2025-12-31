import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			bg: 'var(--bg)',
  			surface: 'var(--surface)',
  			'surface-2': 'var(--surface-2)',
  			'surface-3': 'var(--surface-3)',
  			border: 'var(--border)',
  			'border-strong': 'var(--border-strong)',
  			text: 'var(--text)',
  			'text-2': 'var(--text-2)',
  			'text-3': 'var(--text-3)',
  			placeholder: 'var(--placeholder)',
  			accent: 'var(--accent)',
  			'accent-hover': 'var(--accent-hover)',
  			'accent-soft': 'var(--accent-soft)',
  			'accent-border': 'var(--accent-border)',
  			success: 'var(--success)',
  			warning: 'var(--warning)',
  			danger: 'var(--danger)',
  			info: 'var(--info)',
  			// Shadcn/ui semantic colors mapped to design tokens
  			background: 'var(--bg)',
  			foreground: 'var(--text)',
  			muted: 'var(--surface-2)',
  			'muted-foreground': 'var(--text-3)',
  			primary: 'var(--accent)',
  			'primary-foreground': '#FFFFFF',
  			secondary: 'var(--surface-2)',
  			'secondary-foreground': 'var(--text)',
  			destructive: 'var(--danger)',
  			'destructive-foreground': '#FFFFFF',
  			ring: 'var(--accent)',
  			input: 'var(--border)',
  			popover: 'var(--bg)',
  			'popover-foreground': 'var(--text)',
  			card: 'var(--bg)',
  			'card-foreground': 'var(--text)',
  			'accent-foreground': '#FFFFFF'
  		},
  		borderRadius: {
  			xs: 'var(--radius-xs)',
  			sm: 'var(--radius-sm)',
  			md: 'var(--radius-md)',
  			lg: 'var(--radius-lg)',
  			pill: 'var(--radius-pill)'
  		},
  		boxShadow: {
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)'
  		},
  		fontFamily: {
  			inter: [
  				'var(--font-inter)',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			'fade-in': {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			'fade-out': {
  				from: {
  					opacity: '1'
  				},
  				to: {
  					opacity: '0'
  				}
  			},
  			'slide-in-from-left': {
  				from: {
  					transform: 'translateX(-100%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-out-to-left': {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(-100%)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'fade-in': 'fade-in 200ms ease-out',
  			'fade-out': 'fade-out 200ms ease-out',
  			'slide-in-from-left': 'slide-in-from-left 200ms ease-out',
  			'slide-out-to-left': 'slide-out-to-left 200ms ease-out',
  			in: 'fade-in 200ms ease-out',
  			out: 'fade-out 200ms ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};
export default config;
