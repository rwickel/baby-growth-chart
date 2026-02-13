import { Baby, Droplets, LineChart, Heart } from 'lucide-react';
import { EntryForm } from '@/components/EntryForm';
import { EntriesList } from '@/components/EntriesList';
import { GrowthChart } from '@/components/GrowthChart';
import { MilkEntryForm } from '@/components/MilkEntryForm';
import { MilkList } from '@/components/MilkList';
import { BabySelector } from '@/components/BabySelector';
import { AddBabyDialog } from '@/components/AddBabyDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { SettingsControls } from '@/components/SettingsControls';
import { useBabyData } from '@/hooks/useBabyData';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BabySummary } from '@/components/BabySummary';
import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';

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
    addMilkEntry,
    updateMilkEntry,
    deleteMilkEntry,
  } = useBabyData();

  const { t } = useTranslation(settings.language);

  const bgColor = activeBaby?.gender === 'male'
    ? 'bg-gradient-boy'
    : activeBaby?.gender === 'female'
      ? 'bg-gradient-girl'
      : 'bg-gradient-soft';

  return (
    <div className={`min-h-screen transition-all duration-700 ${bgColor} pb-[env(safe-area-inset-bottom)]`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b border-white/20 bg-white/40 pt-[env(safe-area-inset-top)]`}>
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Baby className="w-6 h-6 text-primary" />
            </div> */}
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-slate-800">{t('appTitle')}</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{t('appSubtitle')}</p>
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
      <div className="border-b border-white/10 bg-white/20 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <BabySelector
            babies={babies}
            activeBabyId={activeBaby?.id || null}
            onSelect={setActiveBaby}
            onDelete={deleteBaby}
            language={settings.language}
          />
          <div className="shrink-0">
            <AddBabyDialog onAdd={addBaby} language={settings.language} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {!activeBaby ? (
          <div className="glass-card rounded-[2.5rem] p-12 text-center flex flex-col items-center border-none shadow-xl">
            <div className="flex gap-4 mb-6 animate-float">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-inner">
                <img src={boyImg} alt="Boy" className="w-full h-full object-contain bg-white" />
              </div>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-inner">
                <img src={girlImg} alt="Girl" className="w-full h-full object-contain bg-white" />
              </div>
            </div>
            <h3 className="font-extrabold text-2xl mb-3 text-slate-800">{t('noBabies')}</h3>
            <p className="text-slate-500 mb-8 max-w-sm">{t('noBabiesDesc')}</p>
            <div className="mb-10">
              <AddBabyDialog onAdd={addBaby} language={settings.language} />
            </div>

            <div className="w-full max-w-xs border-t border-slate-100 pt-8">
              <h4 className="text-xs font-bold mb-6 text-slate-400 uppercase tracking-widest">{t('settings')}</h4>
              <SettingsControls
                settings={settings}
                onLanguageChange={setLanguage}
                onWeightUnitChange={setWeightUnit}
                onHeightUnitChange={setHeightUnit}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <BabySummary baby={activeBaby} settings={settings} />

            <Tabs defaultValue="growth" className="w-full space-y-10">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 gap-1 border border-white/40 shadow-sm">
                  <TabsTrigger value="growth" className="gap-2 text-base rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold transition-all">
                    <LineChart className="h-5 w-5" />
                    <span>{t('growth')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="milk" className="gap-2 text-base rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold transition-all">
                    <Droplets className="h-5 w-5" />
                    <span>{t('milk')}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="growth" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                {/* Growth Chart */}
                <div className="glass-card rounded-[2.5rem] p-2 border-none">
                  <GrowthChart
                    entries={activeBaby.entries}
                    gender={activeBaby.gender}
                    birthDate={activeBaby.birthDate}
                    settings={settings}
                    babyName={activeBaby.name}
                  />
                </div>

                {/* Entry Form */}
                <EntryForm onSubmit={addEntry} settings={settings} />

                {/* Entries List */}
                <EntriesList
                  entries={activeBaby.entries}
                  onUpdate={updateEntry}
                  onDelete={deleteEntry}
                  settings={settings}
                  gender={activeBaby.gender}
                />
              </TabsContent>

              <TabsContent value="milk" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                {/* Milk Entry Form */}
                <MilkEntryForm onSubmit={addMilkEntry} settings={settings} />

                {/* Milk Entries List */}
                <MilkList
                  entries={activeBaby.milkEntries}
                  onUpdate={updateMilkEntry}
                  onDelete={deleteMilkEntry}
                  settings={settings}
                  gender={activeBaby.gender}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 mt-12 bg-white/10">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            Made with <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> for parents everywhere
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
