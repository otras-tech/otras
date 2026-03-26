export default function PageContainer({ children, collapsed, isAuthPage }) {
  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{ 
        background: isAuthPage ? 'transparent' : '#f1f5f9', 
        marginLeft: isAuthPage ? 0 : (collapsed ? 64 : 224), 
        marginTop: isAuthPage ? 0 : 56 
      }}
    >
      <div className={isAuthPage ? "" : "p-6 max-w-7xl"}>{children}</div>
    </div>
  );
}
