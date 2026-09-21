// Geometry exported from the Figma floor plan (plan is 1064×833 at 1x)
export const PLAN = { w: 1064, h: 833 }

export type Desk = { id: string; x: number; y: number; w: number; h: number; dir: 'East' | 'West' | 'South' | 'North'; room?: string; clock?: 'running' | 'unassigned' | 'paused' }

export const DESKS: Desk[] = [
  { id: 'd1', x: 56, y: 69, w: 75, h: 96, dir: 'East', clock: 'running' },
  { id: 'd2', x: 56, y: 168, w: 75, h: 96, dir: 'East', clock: 'unassigned' },
  { id: 'd3', x: 169, y: 69, w: 75, h: 96, dir: 'West', clock: 'running' },
  { id: 'd4', x: 169, y: 168, w: 75, h: 96, dir: 'West', clock: 'unassigned' },
  { id: 'd5', x: 56, y: 282, w: 75, h: 96, dir: 'East', clock: 'running' },
  { id: 'd6', x: 169, y: 282, w: 75, h: 96, dir: 'West', clock: 'unassigned' },
  { id: 'd7', x: 287, y: 282, w: 75, h: 96, dir: 'East', clock: 'running' },
  { id: 'd8', x: 401, y: 282, w: 75, h: 96, dir: 'West', clock: 'unassigned' },
  { id: 'dalia', x: 626, y: 309, w: 75, h: 96, dir: 'West', room: 'مكتب داليا' },
  { id: 'hossam', x: 777, y: 337, w: 96, h: 75, dir: 'South', room: 'مكتب حسام' },
  { id: 'nour', x: 956, y: 322, w: 96, h: 75, dir: 'South', room: 'مكتب نور' },
  { id: 'mohamed', x: 939, y: 449, w: 75, h: 96, dir: 'South', room: 'مكتب محمد' },
]

export type Room = { name: string; x: number; y: number; w: number; h: number }
export const ROOMS: Room[] = [
  { name: 'قاعة الاجتماعات', x: 615, y: 37, w: 414, h: 197 },
  { name: 'مكتب داليا', x: 613, y: 301, w: 133, h: 121 },
  { name: 'مكتب حسام', x: 758, y: 301, w: 139, h: 130 },
  { name: 'مكتب نور', x: 930, y: 294, w: 130, h: 139 },
  { name: 'المطبخ', x: 309, y: 480, w: 127, h: 121 },
  { name: 'مكتب محمد', x: 930, y: 441, w: 121, h: 133 },
]

export type Presence = 'available' | 'focus' | 'away' | 'offline'
export type Person = { id: string; name: string; initial: string; role: string; email: string; presence: Presence; where: string; x?: number; y?: number; me?: boolean; color?: 'dark' | 'purple' | 'teal' }

export const PEOPLE: Person[] = [
  { id: 'ahmed', name: 'أحمد هشيمة', initial: 'أ', role: 'مالك مساحة العمل', email: 'ahmed@company.com', presence: 'available', where: 'الممر', x: 796, y: 157, me: true, color: 'teal' },
  { id: 'mostafa', name: 'مصطفى عبدالمجيد', initial: 'م', role: 'مدير مساحة العمل', email: 'mostafa@company.com', presence: 'available', where: 'مساحة العمل المفتوحة', x: 161, y: 304, color: 'dark' },
  { id: 'mohamed', name: 'محمد أمين السبعي', initial: 'م', role: 'قيادة المنتج', email: 'mohamed@company.com', presence: 'focus', where: 'قاعة الاجتماعات', x: 736, y: 157, color: 'purple' },
  { id: 'lubna', name: 'لبنى الحربي', initial: 'ل', role: 'تصميم المنتج', email: 'lubna@company.com', presence: 'focus', where: 'قاعة الاجتماعات', x: 731, y: 52, color: 'dark' },
  { id: 'hossam', name: 'حسام مراد', initial: 'ح', role: 'مكتب خاص', email: 'hossam@company.com', presence: 'available', where: 'قاعة الاجتماعات', x: 690, y: 101, color: 'dark' },
  { id: 'fatima', name: 'فاطمة الجابري', initial: 'ف', role: 'غرفة تركيز', email: 'fatima@company.com', presence: 'focus', where: 'قاعة الاجتماعات', x: 796, y: 54, color: 'purple' },
  { id: 'yassin', name: 'ياسين البقلوطي', initial: 'ي', role: 'هندسة البرمجيات', email: 'yassin@company.com', presence: 'away', where: 'خارج نطاق السماع' },
  { id: 'omar', name: 'عمر خليل', initial: 'ع', role: 'الدعم', email: 'omar@company.com', presence: 'offline', where: 'غير متصل' },
]

export const CHANNELS = ['عام', 'الإعلانات', 'فريق التصميم', 'الدعم']
export const GROUPS = [{ name: 'فريق التصميم', n: 4 }, { name: 'الإدارة', n: 3 }]

export const FLOORS = [
  { id: 'f1', name: 'الطابق الأول', desc: '٨ متصلون الآن · ١٢ مكتب · ٤ غرف', active: true },
  { id: 'f2', name: 'الطابق الثاني', desc: '٣ متصلون · ٦ مكاتب · غرفتان', active: false },
]

export const ROLES = ['عضو فريق', 'مسؤول', 'ضيف']
export const ROOM_NAMES = ['قاعة الاجتماعات', 'مساحة العمل المفتوحة', 'غرفة التركيز', 'مكتب حسام', 'المطبخ']
export const EXPIRY = ['٢٤ ساعة', '٧ أيام', '٣٠ يومًا', 'بدون انتهاء']

export const EMOJIS = ['🎉', '👍', '❤️', '✅', '💡', '🚀', '🎁', '🔥', '📱', '☕', '🙏', '👀']

export const WORKSPACES = [
  { id: 'qomra', name: 'شركة قمرة السعادة', domain: 'qomra.app', role: 'مشرف', kind: 'شركة', status: 'active' as const, initial: 'ق' },
  { id: 'nahj', name: 'فريق المنتج — نُهج', domain: 'nahj.sa', role: 'عضو فريق', kind: 'فريق صغير', status: 'pending' as const, initial: 'ف' },
  { id: 'diaa', name: 'استوديو ضياء', domain: 'diaa.studio', role: 'عضو فريق', kind: 'فريق مستقل', status: 'expired' as const, initial: 'ا' },
]
