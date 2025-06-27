import { IconHome, IconCalendar, IconTeach, IconRecords, IconEvent, IconLeave, IconAI, IconUser } from './icons/1';

export function getNavItems(activePage) {
  return [
    { name: 'Home', icon: <IconHome />, path: '/dashboard/dashboard', active: activePage === 'dashboard' },
    { name: 'Timetable', icon: <IconCalendar />, path: '/dashboard/time-table', active: activePage === 'time-table' },
    { name: 'Take Class', icon: <IconTeach />, path: '/lesson-log/1', active: activePage === 'take-class' },
    { name: 'Class Records', icon: <IconRecords />, path: '/class-response/class-completed', active: activePage === 'class-records' },
    { name: 'Event Planner', icon: <IconEvent />, path: '/event-leave/event-dashboard', active: activePage === 'event-dashboard' },
    { name: 'Leave Records', icon: <IconLeave />, path: '/event-leave/leave-dashboard', active: activePage === 'leave-dashboard' },
    { name: 'Ekagrata AI', icon: <IconAI />, path: '/dashboard/chatbot/chatbot', active: activePage === 'chatbot' },
  ];
} 