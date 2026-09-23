import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = ({ size = 20, className = 'icon', ...rest }: P) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, ...rest,
})

// iconsax-style linear icons, hand-drawn to stay dependency-free
export const I = {
  // مصدَّرة من فيجما: Icon/Outline/Call Slash
  CallSlash: (p: P) => <svg {...base(p)} strokeWidth={1.5}><path d="M10.3198 18.97C10.4598 19.08 10.5998 19.18 10.7498 19.29C11.8898 20.12 13.0398 20.78 14.1898 21.27C15.3398 21.76 16.4298 22 17.4498 22C18.1498 22 18.7998 21.87 19.3998 21.62C20.0098 21.37 20.5498 20.98 21.0398 20.44C21.3298 20.12 21.5498 19.78 21.7198 19.42C21.8898 19.06 21.9698 18.69 21.9698 18.33C21.9698 18.05 21.9098 17.8 21.8098 17.55C21.6998 17.3 21.5198 17.09 21.2598 16.91L17.9498 14.56C17.6998 14.39 17.4698 14.26 17.2498 14.17C17.0298 14.08 16.8298 14.04 16.6398 14.04C16.3898 14.04 16.1598 14.11 15.9298 14.25C15.6998 14.37 15.4598 14.56 15.2098 14.81L14.4498 15.56C14.3398 15.67 14.2098 15.73 14.0398 15.73C13.9498 15.73 13.8698 15.72 13.7898 15.69C13.7198 15.66 13.6598 15.63 13.6098 15.61C13.4198 15.51 13.1998 15.37 12.9598 15.19" /><path d="M10.73 13.22C10.21 12.69 9.73 12.16 9.28 11.64C8.84 11.12 8.53 10.69 8.35 10.36C8.33 10.3 8.3 10.24 8.27 10.16C8.25 10.08 8.24 10.01 8.24 9.93C8.24 9.77 8.29 9.64 8.4 9.53L9.16 8.74C9.4 8.5 9.59 8.26 9.72 8.03C9.86 7.8 9.93 7.56 9.93 7.32C9.93 7.13 9.88 6.92 9.79 6.71C9.7 6.49 9.57 6.26 9.39 6.01L7.07 2.74C6.89 2.48 6.66 2.3 6.4 2.18C6.15 2.06 5.87 2 5.59 2C4.85 2 4.15 2.31 3.51 2.94C2.98 3.44 2.6 4 2.36 4.61C2.12 5.21 2 5.86 2 6.54C2 7.58 2.24 8.67 2.72 9.81C3.2 10.94 3.86 12.08 4.68 13.22C5.51 14.36 6.44 15.45 7.47 16.49" /><path d="M22 2L2 22" /></svg>,
  // مصدَّرة من فيجما: Icon/Outline/Share
  Share: (p: P) => <svg {...base(p)} strokeWidth={1.5}><path d="M16.96 6.16992C18.96 7.55992 20.34 9.76992 20.62 12.3199" /><path d="M3.49023 12.3702C3.75023 9.83021 5.11023 7.62021 7.09023 6.22021" /><path d="M8.18994 20.9399C9.34994 21.5299 10.6699 21.8599 12.0599 21.8599C13.3999 21.8599 14.6599 21.5599 15.7899 21.0099" /><path d="M12.0598 7.70014C13.5951 7.70014 14.8398 6.45549 14.8398 4.92014C14.8398 3.38479 13.5951 2.14014 12.0598 2.14014C10.5244 2.14014 9.27979 3.38479 9.27979 4.92014C9.27979 6.45549 10.5244 7.70014 12.0598 7.70014Z" /><path d="M4.8298 19.9199C6.36516 19.9199 7.60981 18.6752 7.60981 17.1399C7.60981 15.6045 6.36516 14.3599 4.8298 14.3599C3.29445 14.3599 2.0498 15.6045 2.0498 17.1399C2.0498 18.6752 3.29445 19.9199 4.8298 19.9199Z" /><path d="M19.1701 19.9199C20.7055 19.9199 21.9501 18.6752 21.9501 17.1399C21.9501 15.6045 20.7055 14.3599 19.1701 14.3599C17.6348 14.3599 16.3901 15.6045 16.3901 17.1399C16.3901 18.6752 17.6348 19.9199 19.1701 19.9199Z" /></svg>,
  Mic: (p: P) => <svg {...base(p)}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></svg>,
  // مصدَّرة من فيجما: Icon/Outline/Microphone Slash
  MicOff: (p: P) => <svg {...base(p)} strokeWidth={1.5}><path d="M17.82 6.53C17.16 3.93 14.81 2 12 2C8.69 2 6 4.69 6 8V13C6 14.46 6.52 15.8 7.39 16.84" /><path d="M17.9999 9.97998V13C17.9999 16.31 15.3099 19 11.9999 19C11.2699 19 10.5599 18.87 9.91992 18.63" /><path d="M5.85986 19.58C7.46986 21.08 9.62986 22 11.9999 22C16.9699 22 20.9999 17.97 20.9999 13V11" /><path d="M21.5 2.99023L2.5 21.9902" /><path d="M11.5498 5.49977V2.25977" /><path d="M8.5 3.5V7.5" /></svg>,
  Cam: (p: P) => <svg {...base(p)}><rect x="3" y="6" width="13" height="12" rx="3" /><path d="M16 10l5-3v10l-5-3" /></svg>,
  // مصدَّرة من فيجما: Icon/Outline/Video Slash
  CamOff: (p: P) => <svg {...base(p)} strokeWidth={1.5}><path d="M16.63 7.58008C16.63 7.58008 16.66 6.63008 16.63 6.32008C16.46 4.28008 15.13 3.58008 12.52 3.58008H6.21C3.05 3.58008 2 4.63008 2 7.79008V16.2101C2 17.4701 2.38 18.7401 3.37 19.5501L4 20.0001" /><path d="M16.7398 10.9502V16.2102C16.7398 19.3702 15.6898 20.4202 12.5298 20.4202H7.25977" /><path d="M22.0002 6.74023V15.8102C22.0002 17.4802 20.8802 18.0602 19.5202 17.1002L16.7402 15.1502" /><path d="M22.02 2.18994L2.02002 22.1899" /></svg>,
  // مصدَّرة من فيجما: Icon/Outline/Monitor
  Screen: (p: P) => <svg {...base(p)} strokeWidth={1.5}><path d="M6.44 2H17.55C21.11 2 22 2.89 22 6.44V12.77C22 16.33 21.11 17.21 17.56 17.21H6.44C2.89 17.22 2 16.33 2 12.78V6.44C2 2.89 2.89 2 6.44 2Z" /><path d="M12 17.2202V22.0002" /><path d="M2 13H22" /><path d="M7.5 22H16.5" /></svg>,
  Record: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" /></svg>,
  Status: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M8 12l2.5 2.5L16 9" /></svg>,
  People: (p: P) => <svg {...base(p)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 13.5a6 6 0 0 1 3 5.5" /></svg>,
  Rooms: (p: P) => <svg {...base(p)}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>,
  Popout: (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><rect x="12" y="11" width="7" height="6" rx="1.5" /></svg>,
  Leave: (p: P) => <svg {...base(p)}><path d="M9 12h12M17 8l4 4-4 4M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" /></svg>,
  Search: (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>,
  Chat: (p: P) => <svg {...base(p)}><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6z" /></svg>,
  Chats: (p: P) => <svg {...base(p)}><path d="M3 7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H8l-5 3V7z" /><path d="M17 8h1a3 3 0 0 1 3 3v9l-4-2h-6a3 3 0 0 1-3-3" /></svg>,
  Hash: (p: P) => <svg {...base(p)}><path d="M10 3L8 21M16 3l-2 18M4 8h17M3 15h17" /></svg>,
  Group: (p: P) => <svg {...base(p)}><circle cx="8" cy="8" r="3" /><circle cx="16" cy="9" r="2.5" /><path d="M3 19a5 5 0 0 1 10 0M13.5 18a4 4 0 0 1 7.5 0" /></svg>,
  Settings: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>,
  Layers: (p: P) => <svg {...base(p)}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></svg>,
  Expand: (p: P) => <svg {...base(p)}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>,
  Gps: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>,
  Magic: (p: P) => <svg {...base(p)}><path d="M4 20l10-10M14 4l.8 2.2L17 7l-2.2.8L14 10l-.8-2.2L11 7l2.2-.8L14 4zM19 12l.5 1.5L21 14l-1.5.5L19 16l-.5-1.5L17 14l1.5-.5L19 12z" /></svg>,
  Plus: (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>,
  Minus: (p: P) => <svg {...base(p)}><path d="M5 12h14" /></svg>,
  Clock: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  Close: (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  Chevron: (p: P) => <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>,
  ChevronL: (p: P) => <svg {...base(p)}><path d="M15 6l-6 6 6 6" /></svg>,
  ChevronR: (p: P) => <svg {...base(p)}><path d="M9 6l6 6-6 6" /></svg>,
  Send: (p: P) => <svg {...base(p)}><path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" /></svg>,
  Emoji: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M8.5 10h.01M15.5 10h.01M8 14.5a5 5 0 0 0 8 0" /></svg>,
  Bell: (p: P) => <svg {...base(p)}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zM10 21h4" /></svg>,
  Apps: (p: P) => <svg {...base(p)}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>,
  // مصدَّرة من فيجما: Icon/Outline/Grid Apps
  Grid: (p: P) => <svg {...base(p)} strokeWidth={1.5}><path d="M22 10.9V4.1C22 2.6 21.36 2 19.77 2H15.73C14.14 2 13.5 2.6 13.5 4.1V10.9C13.5 12.4 14.14 13 15.73 13H19.77C21.36 13 22 12.4 22 10.9Z" /><path d="M22 19.9V18.1C22 16.6 21.36 16 19.77 16H15.73C14.14 16 13.5 16.6 13.5 18.1V19.9C13.5 21.4 14.14 22 15.73 22H19.77C21.36 22 22 21.4 22 19.9Z" /><path d="M10.5 13.1V19.9C10.5 21.4 9.86 22 8.27 22H4.23C2.64 22 2 21.4 2 19.9V13.1C2 11.6 2.64 11 4.23 11H8.27C9.86 11 10.5 11.6 10.5 13.1Z" /><path d="M10.5 4.1V5.9C10.5 7.4 9.86 8 8.27 8H4.23C2.64 8 2 7.4 2 5.9V4.1C2 2.6 2.64 2 4.23 2H8.27C9.86 2 10.5 2.6 10.5 4.1Z" /></svg>,
  Door: (p: P) => <svg {...base(p)}><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18M14 12h1" /></svg>,
  Walk: (p: P) => <svg {...base(p)}><circle cx="13" cy="4" r="1.8" /><path d="M9 21l2-7-2-2M11 12l2 2 3 7M9 9l3-2 3 2 2 4" /></svg>,
  Flag: (p: P) => <svg {...base(p)}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>,
  Home: (p: P) => <svg {...base(p)}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" /></svg>,
  UserCircle: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.5a6 6 0 0 1 11 0" /></svg>,
  Crown: (p: P) => <svg {...base(p)}><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z" /></svg>,
  Mail: (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" /></svg>,
  Link: (p: P) => <svg {...base(p)}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1" /></svg>,
  Copy: (p: P) => <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>,
  Check: (p: P) => <svg {...base(p)}><path d="M5 12l5 5L20 7" /></svg>,
  Eye: (p: P) => <svg {...base(p)}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  Edit: (p: P) => <svg {...base(p)}><path d="M4 20h4l11-11a2 2 0 0 0-4-4L4 16v4z" /></svg>,
  Building: (p: P) => <svg {...base(p)}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></svg>,
  Info: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>,
  Play: (p: P) => <svg {...base(p)}><path d="M7 5v14l11-7-11-7z" /></svg>,
  More: (p: P) => <svg {...base(p)}><circle cx="6" cy="12" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /><circle cx="18" cy="12" r="1.2" fill="currentColor" /></svg>,
  Sparkle: (p: P) => <svg {...base(p)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM5 18l.6 1.4L7 20l-1.4.6L5 22l-.6-1.4L3 20l1.4-.6L5 18z" /></svg>,
  Logout: (p: P) => <svg {...base(p)}><path d="M15 12H3M7 8l-4 4 4 4M11 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" /></svg>,
  Calendar: (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  Card: (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></svg>,
}

export type IconName = keyof typeof I
