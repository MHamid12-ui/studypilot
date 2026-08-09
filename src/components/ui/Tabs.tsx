interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-border gap-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer border-b-2 -mb-px
            ${activeTab === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}