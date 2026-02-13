import { Droplets, LineChart, Heart, Menu, Bell, Plus, Trophy } from 'lucide-react';
import { EntryForm } from '@/components/EntryForm';
import { EntriesList } from '@/components/EntriesList';
import { GrowthChart } from '@/components/GrowthChart';
import { MilkEntryForm } from '@/components/MilkEntryForm';
import { MilkList } from '@/components/MilkList';
import { BabySelector } from '@/components/BabySelector';
import { SettingsDialog } from '@/components/SettingsDialog';
import { SettingsControls } from '@/components/SettingsControls';
import { useBabyData } from '@/hooks/useBabyData';
import { useTranslation } from '@/hooks/useTranslation';
import { BottomNav, TabType } from '@/components/BottomNav';
import { FeedingChart } from '@/components/FeedingChart';
import { MilestoneList } from '@/components/MilestoneList';
import { cn } from '@/lib/utils';
import boyImg from '../img/boy.png';
import girlImg from '../img/girl.png';
import { useState } from 'react';

const Index = () => {
  const {
    babies,
    activeBaby,
    settings,
    setLanguage,
    setWeightUnit,
    setHeightUnit,
    addBaby,
    updateBaby,
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

  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('growth');

  const isBoy = activeBaby?.gender === 'male';

  return (
    <main className="min-h-screen bg-gradient-soft pb-40 relative">
      <div className="max-w-2xl mx-auto px-6 pt-10 space-y-10">
        {/* Header Section */}
        <header className="flex items-center justify-between gap-4 py-2">
          {/* <button className="p-3 bg-white/60 backdrop-blur-md rounded-[1.5rem] shadow-sm hover:bg-white/80 transition-all active:scale-95 group">
            <Menu className="h-6 w-6 text-slate-500 group-hover:text-slate-800 transition-colors" />
          </button> */}

          <div className="flex-1 text-center">
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <Heart className={cn("h-4 w-4 fill-current", isBoy ? "text-baby-boy" : "text-baby-girl")} />
              {t('appTitle')}
            </h1>
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
        </header>

        {/* Baby Selector */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
          <BabySelector
            babies={babies}
            activeBabyId={activeBaby?.id || null}
            onSelect={setActiveBaby}
            onDelete={deleteBaby}
            onAdd={addBaby}
            onUpdate={updateBaby}
            weightUnit={settings.weightUnit}
            heightUnit={settings.heightUnit}
            language={settings.language}
          />
        </section>

        {activeBaby ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            {activeTab === 'growth' && (
              <div className="space-y-12">

                {/* Growth Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1.5 h-6 rounded-full", isBoy ? "bg-baby-boy shadow-[0_0_10px_rgba(var(--baby-boy)/0.3)]" : "bg-baby-girl shadow-[0_0_10px_rgba(var(--baby-girl)/0.3)]")} />
                      <h3 className="font-black text-xl text-slate-800 tracking-tight">
                        {activeBaby.name}'s {t('growth')}
                      </h3>
                    </div>
                  </div>

                  <div className="kawaii-card p-2 md:p-6 overflow-hidden">
                    <GrowthChart
                      entries={activeBaby.entries}
                      gender={activeBaby.gender}
                      birthDate={activeBaby.birthDate}
                      settings={settings}
                      babyName={activeBaby.name}
                    />
                  </div>
                </section>

                {/* History Section */}
                <section className="space-y-6 pt-4 border-t border-slate-100/50">
                  {/* <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-slate-800">
                      {t('history')}
                    </h2>
                  </div> */}
                  <div className="space-y-8">
                    <EntryForm onSubmit={addEntry} settings={settings} />
                    <EntriesList
                      entries={activeBaby.entries}
                      onUpdate={updateEntry}
                      onDelete={deleteEntry}
                      settings={settings}
                      gender={activeBaby.gender}
                    />
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'feeding' && (
              <div className="space-y-12">
                <div className="relative group">
                  <div className={cn(
                    "absolute -inset-0.5 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000",
                    isBoy ? "bg-baby-boy" : "bg-baby-girl"
                  )} />
                  <div className="relative flex flex-col items-center gap-6 p-10 kawaii-card text-center bg-white/90 backdrop-blur-sm">
                    <div className={cn(
                      "w-24 h-24 rounded-[2rem] flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6",
                      isBoy ? "bg-blue-50" : "bg-pink-50"
                    )}>
                      <Droplets className={cn("w-12 h-12", isBoy ? "text-baby-boy" : "text-baby-girl")} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('feeding')}</h2>
                      <p className="text-slate-500 font-medium">Capture your baby's nutrition journey</p>
                    </div>
                    <button
                      onClick={() => setFeedingDialogOpen(true)}
                      className={cn(
                        "w-full h-16 text-white font-black text-lg rounded-[1.5rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                        isBoy ? "bg-baby-boy/90 hover:bg-baby-boy shadow-baby-boy/20" : "bg-baby-girl/90 hover:bg-baby-girl shadow-baby-girl/20"
                      )}
                    >
                      <Plus className="w-6 h-6 stroke-[3px]" />
                      {t('addMilk')}
                    </button>
                  </div>
                </div>

                <section className="space-y-8">
                  <FeedingChart
                    entries={activeBaby.milkEntries}
                    settings={settings}
                    gender={activeBaby.gender}
                  />

                  <div className="flex items-center justify-between px-2 pt-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1.5 h-6 rounded-full", isBoy ? "bg-baby-boy" : "bg-baby-girl")} />
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        Recent Feedings
                      </h2>
                    </div>
                  </div>
                  <MilkList
                    entries={activeBaby.milkEntries}
                    onUpdate={updateMilkEntry}
                    onDelete={deleteMilkEntry}
                    settings={settings}
                  />
                </section>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-12">
                <MilestoneList
                  baby={activeBaby}
                  settings={settings}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="kawaii-card p-12 text-center space-y-10 flex flex-col items-center bg-white/60 backdrop-blur-md border border-white/40">
            <div className="relative w-32 h-32 animate-float">
              <div className="absolute top-0 left-0 w-24 h-24 bg-baby-boy/10 rounded-3xl rotate-[-10deg] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                <img src={boyImg} alt="" className="w-20 h-20 object-contain" />
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-baby-girl/10 rounded-3xl rotate-[10deg] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                <img src={girlImg} alt="" className="w-20 h-20 object-contain" />
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('getStarted')}</h2>
              <p className="text-slate-500 font-bold text-lg max-w-xs mx-auto leading-relaxed">{t('addBabyFirst')}</p>
            </div>
          </div>
        )}

        <footer className="pt-20 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              Made with <Heart className="h-2.5 w-2.5 text-rose-300 fill-rose-300 animate-pulse" /> for parents
            </p>
          </div>
        </footer>
      </div>

      {activeBaby && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={settings.language}
        />
      )}

      <MilkEntryForm
        isOpen={feedingDialogOpen}
        onOpenChange={setFeedingDialogOpen}
        onSubmit={addMilkEntry}
        settings={settings}
      />
    </main>
  );
};

export default Index;
