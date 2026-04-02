import { useTranslation } from "../i18n/index";
import heroImg from "../assets/hero.png";

export function HeroBanner() {
  const { t } = useTranslation();
  return (
    <div className="relative mt-[57px] w-full overflow-hidden pt-12 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="flex items-center justify-center">
        <img src={heroImg} alt="Air Max Pulse" className="" />
      </div>

      <div className="inset-0 flex flex-col items-center justify-end px-4 pb-16 text-center pt-26">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-2 animate-fade-up-1">
          {t.hero.eyebrow}
        </p>
        <h1 className="mb-4 text-5xl font-black tracking-tight text-black dark:text-white font-display md:text-7xl animate-fade-up-2">
          {t.hero.title}
        </h1>
        <p className="max-w-md mb-8 font-sans text-sm text-gray-600 dark:text-gray-400 animate-fade-up-3">
          {t.hero.description}
        </p>
        <div className="flex gap-4 animate-fade-up-4">
          <button className="px-8 py-3 font-sans text-sm font-medium text-white transition-colors bg-black rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            {t.hero.notifyMe}
          </button>
          <button className="px-8 py-3 font-sans text-sm font-medium text-black transition-colors bg-white border border-black rounded-full hover:bg-gray-50 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-gray-800">
            {t.hero.shopAirMax}
          </button>
        </div>
      </div>
    </div>
  );
}
