import toast from 'react-hot-toast';

const notify = {
  // Common style configuration
  baseStyle: {
    borderRadius: '1.25rem',
    background: '#1e293b',
    color: '#fff',
    padding: '12px 16px',
    maxWidth: '350px',
  },

  // Standardized Content Wrapper
  Content: ({ title, detail }) => (
    <div className="flex flex-col gap-1">
      <span className="font-black text-[10px] uppercase tracking-widest text-white/90">
        {title}
      </span>
      {detail && (
        <span className="text-[9px] font-medium opacity-70 leading-tight">
          {detail}
        </span>
      )}
    </div>
  ),

  success: (title, detail = '') => {
    toast.success(
      <notify.Content title={title} detail={detail} />,
      {
        duration: 4000,
        style: { ...notify.baseStyle, border: '1px solid rgba(16, 185, 129, 0.2)' },
        iconTheme: { primary: '#10b981', secondary: '#fff' },
      }
    );
  },

  error: (title, detail = '') => {
    toast.error(
      <notify.Content title={title} detail={detail} />,
      {
        duration: 6000,
        style: { ...notify.baseStyle, border: '1px solid rgba(244, 63, 94, 0.2)' },
        iconTheme: { primary: '#f43f5e', secondary: '#fff' },
      }
    );
  }
};

export default notify;