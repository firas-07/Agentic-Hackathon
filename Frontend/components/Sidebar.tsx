import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { MessageSquare, Trash2, Edit2, Plus, Check, X, LogOut, Sun, Moon } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { Sidebar as UISidebar, SidebarBody, useSidebar } from './ui/sidebar';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeThreadId: string | null;
  onSelectThread: (id: string | null) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Custom component to handle the specific needs of a conversation item (rename/delete)
// inside the framer-motion sidebar context
const ConversationItem = ({
  conv,
  isActive,
  onSelect,
  onRename,
  onDelete
}: {
  conv: any;
  isActive: boolean;
  onSelect: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { open, animate } = useSidebar();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conv.title);

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRename(conv.thread_id, editTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2 px-1">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-xs p-1 rounded w-full outline-none min-w-0"
          autoFocus
        />
        <button onClick={handleRename} className="p-1 text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-gray-300 shrink-0"><Check size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="p-1 text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-gray-300 shrink-0"><X size={14} /></button>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group/item flex items-center gap-2 py-2 px-2 cursor-pointer transition-colors rounded-md",
        open ? "justify-start" : "justify-center",
        isActive
          ? "bg-neutral-200 dark:bg-white text-neutral-900 dark:text-black font-medium"
          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
      )}
      title={!open ? conv.title : undefined}
    >
      <MessageSquare className={cn("h-4 w-4 flex-shrink-0 transition-colors", isActive ? "text-neutral-900 dark:text-black" : "text-neutral-500 group-hover/item:text-neutral-900 dark:group-hover/item:text-white")} />

      <motion.div
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="flex-1 overflow-hidden items-center justify-between gap-2"
      >
        <span className="text-sm truncate block flex-1">{conv.title || 'New Chat'}</span>

        {/* Actions only show on hover and if open */}
        {open && (
          <div className={cn(
            "flex items-center gap-1 transition-opacity",
            isActive ? "opacity-100" : "opacity-0 md:group-hover/item:opacity-100"
          )}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className={cn("p-1", isActive ? "text-neutral-600 dark:text-black/70 hover:text-black" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white")}
              title="Rename"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(conv.thread_id); }}
              className={cn("p-1", isActive ? "text-neutral-600 dark:text-black/70 hover:text-black" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white")}
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const SidebarContent: React.FC<SidebarProps & { setOpen: (o: boolean) => void }> = ({ activeThreadId, onSelectThread, setOpen }) => {
  const queryClient = useQueryClient();
  const { open } = useSidebar();

  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: api.getConversations,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteConversation,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (activeThreadId === deletedId) {
        onSelectThread(null);
      }
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => api.renameConversation(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const sortedConversations = data?.conversations.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <>
      <SidebarBody className="justify-between gap-10 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-900">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

          {/* Logo / Brand */}
          <div className={cn(
            "flex items-center gap-2 mb-8 mt-2 px-1",
            open ? "justify-start" : "justify-center"
          )}>
            <div className="h-6 w-6 rounded-md shrink-0 flex items-center justify-center overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <img src="https://github.com/shadcn.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="font-bold text-neutral-900 dark:text-white text-lg tracking-tight whitespace-pre"
            >
              Agentic AI Assistant
            </motion.span>
          </div>

          {/* New Chat Button */}
          <div onClick={() => {
            onSelectThread(null);
            if (window.innerWidth < 768) setOpen(false);
          }} className={cn(
            "flex items-center gap-2 py-2 mb-4 cursor-pointer transition-all border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-white rounded-md",
            open ? "px-3 justify-start bg-neutral-100 dark:bg-neutral-950 hover:bg-neutral-200 dark:hover:bg-neutral-900" : "justify-center bg-transparent border-none px-0"
          )}>
            <Plus className="text-neutral-600 dark:text-white h-4 w-4 flex-shrink-0" />
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-neutral-600 dark:text-white text-sm font-medium"
            >
              New Chat
            </motion.span>
          </div>

          {/* Conversation List */}
          <div className="flex flex-col gap-1">
            <div className={cn(
              "text-[10px] font-bold text-neutral-500 dark:text-neutral-600 mb-2 px-2 uppercase tracking-widest",
              open ? "text-left" : "text-center"
            )}>
              {open ? 'History' : '•••'}
            </div>
            {isLoading ? (
              <div className="flex justify-center p-2"><LoadingSpinner size={16} /></div>
            ) : (
              sortedConversations?.map((conv) => (
                <ConversationItem
                  key={conv.thread_id}
                  conv={conv}
                  isActive={activeThreadId === conv.thread_id}
                  onSelect={() => {
                    onSelectThread(conv.thread_id);
                    if (window.innerWidth < 768) setOpen(false);
                  }}
                  onRename={(id, title) => renameMutation.mutate({ id, title })}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer / Status */}
        <div className="mt-auto flex flex-col gap-2">
          {/* User Profile */}
          <div className={cn(
            "flex items-center gap-3 py-3 px-2 rounded-xl transition-all",
            open
              ? "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 justify-start"
              : "justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900"
          )}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {open && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {localStorage.getItem('username') || 'User'}
                </span>
                <span className="text-xs text-neutral-500 truncate">
                  {localStorage.getItem('role') || 'End User'}
                </span>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-2 py-2 px-2 cursor-pointer transition-colors rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900",
              open ? "justify-start" : "justify-center"
            )}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-sm font-medium"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          </div>

          {/* Logout */}
          <div
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('username');
              window.location.href = '/login';
            }}
            className={cn(
              "flex items-center gap-2 py-2 px-2 cursor-pointer transition-colors rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900",
              open ? "justify-start" : "justify-center"
            )}
            title="Log out"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-sm font-medium"
            >
              Log out
            </motion.span>
          </div>
        </div>
      </SidebarBody>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full transform scale-100 transition-all">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Delete Chat?</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
              This action cannot be undone. This conversation will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <UISidebar open={open} setOpen={setOpen}>
      <SidebarContent {...props} setOpen={setOpen} />
    </UISidebar>
  );
};