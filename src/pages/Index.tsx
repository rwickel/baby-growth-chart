import { Baby } from 'lucide-react';
import { EntryForm } from '@/components/EntryForm';
import { EntriesList } from '@/components/EntriesList';
import { GrowthChart } from '@/components/GrowthChart';
import { BabySelector } from '@/components/BabySelector';
import { AddBabyDialog } from '@/components/AddBabyDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useBabyData } from '@/hooks/useBabyData';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const {
    babies,
    activeBaby,
    settings,
    setLanguage,
    setWeightUnit,
    setHeightUnit,
    addBaby,
    deleteBaby,
    setActiveBaby,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useBabyData();

  const { t } = useTranslation(settings.language);

  const bgColor = activeBaby?.gender === 'male' 
    ? 'bg-[hsl(var(--baby-boy-light))]' 
    : activeBaby?.gender === 'female' 
      ? 'bg-[hsl(var(--baby-girl-light))]' 
      : 'bg-background';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} pb-[env(safe-area-inset-bottom)]`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-md border-b border-border ${bgColor}/80 pt-[env(safe-area-inset-top)]`}>
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Baby className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl">{t('appTitle')}</h1>
              <p className="text-xs text-muted-foreground">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SettingsDialog
              settings={settings}
              activeBaby={activeBaby}
              onLanguageChange={setLanguage}
              onWeightUnitChange={setWeightUnit}
              onHeightUnitChange={setHeightUnit}
            />
          </div>
        </div>
      </header>

      {/* Baby Selection Bar */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <BabySelector
            babies={babies}
            activeBabyId={activeBaby?.id || null}
            onSelect={setActiveBaby}
            onDelete={deleteBaby}
            language={settings.language}
          />
          <AddBabyDialog onAdd={addBaby} language={settings.language} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {!activeBaby ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4 animate-float">👶</div>
            <h3 className="font-bold text-lg mb-2">{t('noBabies')}</h3>
            <p className="text-muted-foreground mb-4">{t('noBabiesDesc')}</p>
            <AddBabyDialog onAdd={addBaby} language={settings.language} />
          </div>
        ) : (
          <>
            {/* Entry Form */}
            <EntryForm onSubmit={addEntry} settings={settings} />

            {/* Growth Chart */}
            <GrowthChart
              entries={activeBaby.entries}
              gender={activeBaby.gender}
              birthDate={activeBaby.birthDate}
              settings={settings}
            />

            {/* Entries List */}
            <EntriesList
              entries={activeBaby.entries}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
              settings={settings}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('madeWithLove')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
