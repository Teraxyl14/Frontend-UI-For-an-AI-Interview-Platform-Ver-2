import React, { useState } from 'react';
import { Screen, ScreenProps, ScheduleEvent } from '../../types';
import { SCHEDULED_EVENTS } from '../../constants';

const IntegrationToggle: React.FC<{
    label: string;
    icon: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ label, icon, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-500/10 rounded-lg">
        <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-500/30 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
        </label>
    </div>
);

const ScheduleModal: React.FC<{ onSave: (event: ScheduleEvent) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [integrations, setIntegrations] = useState({ google: true, outlook: false, notion: false });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !company || !date || !time) return;

        onSave({
            id: Date.now(),
            title,
            company,
            date,
            time,
            integrations,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="glass-card shadow-glass-glow w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">Schedule New Interview</h2>
                <form onSubmit={handleSave}>
                    <div className="space-y-4">
                        <input type="text" placeholder="Role / Title" value={title} onChange={e => setTitle(e.target.value)} required className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition" />
                        <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} required className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition" />
                        <div className="flex gap-4">
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition" />
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition" />
                        </div>
                    </div>
                    <div className="my-6 space-y-3">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-300">Sync with</h3>
                        <IntegrationToggle label="Google Calendar" checked={integrations.google} onChange={c => setIntegrations(i => ({...i, google: c}))} icon={<img src="https://www.google.com/calendar/images/favicon_v2014_3.ico" alt="Google Calendar" className="w-5 h-5" />} />
                        <IntegrationToggle label="Microsoft Outlook" checked={integrations.outlook} onChange={c => setIntegrations(i => ({...i, outlook: c}))} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0072C6"><path d="M2.25 5.88v12.24a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V5.88l-9.63 7.4a2.25 2.25 0 01-2.74 0L2.25 5.88z" /><path d="M19.5 3.75h-15a2.25 2.25 0 00-2.25 2.25v.19l9.63 7.4a2.25 2.25 0 002.74 0l9.63-7.4v-.19A2.25 2.25 0 0019.5 3.75z" /></svg>} />
                        <IntegrationToggle label="Notion" checked={integrations.notion} onChange={c => setIntegrations(i => ({...i, notion: c}))} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-12.5l-.5 1h3v1h-3l.5 1h3v1h-3l-2.5 4h-1.5l3-5.5-3-5.5h1.5l2.5 4h3v-1h-3l-.5-1h3v-1h-3z" /></svg>} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-slate-500/20 hover:bg-slate-500/40 font-bold py-2 px-5 rounded-full">Cancel</button>
                        <button type="submit" className="btn-primary py-2 px-5">Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ScheduleScreen: React.FC<ScreenProps> = ({ navigate, setInterviewMode, setCompanyName }) => {
    const [events, setEvents] = useState<ScheduleEvent[]>(SCHEDULED_EVENTS);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
        setSelectedDate(null);
    };

    const handleSaveEvent = (newEvent: ScheduleEvent) => {
        setEvents(prev => [...prev, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setIsModalOpen(false);
    };
    
    const eventsByDate: { [key: string]: ScheduleEvent[] } = events.reduce((acc, event) => {
        (acc[event.date] = acc[event.date] || []).push(event);
        return acc;
    }, {} as { [key: string]: ScheduleEvent[] });

    const selectedDateString = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
    const eventsForSelectedDate = selectedDateString ? eventsByDate[selectedDateString] || [] : events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));

    const handleJoinInterview = (event: ScheduleEvent) => {
        setInterviewMode?.('official');
        setCompanyName?.(event.company);
        navigate(Screen.BriefingRoom);
    }

    return (
        <>
        {isModalOpen && <ScheduleModal onSave={handleSaveEvent} onClose={() => setIsModalOpen(false)} />}
        <div className="p-4 md:p-8 h-full flex flex-col lg:flex-row gap-8">
            <div className="lg:flex-1">
                <div className="glass-card shadow-glass-glow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                             <button onClick={() => setCurrentDate(new Date())} className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">Today</button>
                        </div>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="text-xs font-bold text-slate-700 dark:text-slate-400 p-2">{day}</div>)}
                        {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const dateString = date.toISOString().split('T')[0];
                            const hasEvent = !!eventsByDate[dateString];
                            const isToday = date.toDateString() === new Date().toDateString();
                            return (
                                <button key={day} onClick={() => setSelectedDate(date)} className={`p-2 rounded-lg cursor-pointer relative font-semibold transition-colors ${isToday ? 'text-purple-600 dark:text-purple-300' : ''} ${selectedDate?.toDateString() === date.toDateString() ? 'bg-purple-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>
                                    {day}
                                    {hasEvent && <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${selectedDate?.toDateString() === date.toDateString() ? 'bg-white' : 'bg-cyan-400'}`} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="lg:w-[28rem] flex flex-col">
                <div className="glass-card shadow-glass-glow p-6 h-full flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Upcoming</h2>
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-1.5 px-4 text-sm">Schedule Interview</button>
                    </div>
                    {eventsForSelectedDate.length > 0 ? (
                        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                            {eventsForSelectedDate.map(event => (
                                <div key={event.id} className="bg-slate-500/10 p-4 rounded-lg animate-fade-in">
                                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {event.time}</p>
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-400 mb-3">{event.company}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2" title="Synced integrations">
                                            <img src="https://www.google.com/calendar/images/favicon_v2014_3.ico" alt="Google Calendar" className={`w-5 h-5 transition-opacity ${event.integrations.google ? 'opacity-100' : 'opacity-30'}`} />
                                            <svg className={`w-5 h-5 transition-opacity ${event.integrations.outlook ? 'opacity-100' : 'opacity-30'}`} viewBox="0 0 24 24" fill="#0072C6"><path d="M2.25 5.88v12.24a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V5.88l-9.63 7.4a2.25 2.25 0 01-2.74 0L2.25 5.88z" /><path d="M19.5 3.75h-15a2.25 2.25 0 00-2.25 2.25v.19l9.63 7.4a2.25 2.25 0 002.74 0l9.63-7.4v-.19A2.25 2.25 0 0019.5 3.75z" /></svg>
                                            <svg className={`w-5 h-5 transition-opacity ${event.integrations.notion ? 'opacity-100' : 'opacity-30'}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-12.5l-.5 1h3v1h-3l.5 1h3v1h-3l-2.5 4h-1.5l3-5.5-3-5.5h1.5l2.5 4h3v-1h-3l-.5-1h3v-1h-3z" /></svg>
                                        </div>
                                        <button onClick={() => handleJoinInterview(event)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">Join Room</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-500 mb-4"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                             <p className="text-slate-800 dark:text-slate-400 font-semibold">{selectedDate ? "No interviews on this day." : "Select a date to see interviews."}</p>
                             <p className="text-sm text-slate-700 dark:text-slate-400">Or schedule a new one to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ScheduleScreen;