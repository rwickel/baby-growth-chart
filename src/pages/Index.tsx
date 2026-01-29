import { GenderToggle } from '@/components/GenderToggle';
import { EntryForm } from '@/components/EntryForm';
import { EntriesList } from '@/components/EntriesList';
import { GrowthChart } from '@/components/GrowthChart';
import { ExportButtons } from '@/components/ExportButtons';
import { useBabyData } from '@/hooks/useBabyData';
import { Baby } from 'lucide-react';

const Index = () => {
  const { gender, entries, setGender, addEntry, updateEntry, deleteEntry } = useBabyData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Baby className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Baby Growth Tracker</h1>
              <p className="text-xs text-muted-foreground">Track height & weight</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ExportButtons entries={entries} gender={gender} />
            <GenderToggle value={gender} onChange={setGender} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Entry Form */}
        <EntryForm onSubmit={addEntry} />

        {/* Growth Chart */}
        <GrowthChart entries={entries} gender={gender} />

        {/* Entries List */}
        <EntriesList entries={entries} onUpdate={updateEntry} onDelete={deleteEntry} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Made with ❤️ for parents everywhere</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
