import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useLanguage } from '../../hooks/useLanguage';

interface ExpertiseMetric {
  id?: number;
  title: string;
  value: string;
  description: string;
  icon?: string;
}

interface Capability {
  id?: number;
  title: string;
  description: string;
  icon: string;
}

const MetricCard = ({ metric, index }: { metric: ExpertiseMetric; index: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);

  return (
    <div
      ref={ref}
      className={`flex flex-col bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-lg transition-all animate-on-scroll animate-fade-up ${
        isVisible ? 'visible' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">
        {metric.value}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {metric.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm">
        {metric.description}
      </p>
    </div>
  );
};

const CapabilityCard = ({ capability, index }: { capability: Capability; index: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);

  return (
    <div
      ref={ref}
      className={`flex items-start gap-6 p-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-lg transition-all animate-on-scroll animate-fade-up ${
        isVisible ? 'visible' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="text-5xl flex-shrink-0">{capability.icon}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {capability.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          {capability.description}
        </p>
      </div>
    </div>
  );
};

const Expertise = () => {
  const { theme } = useThemeColors();
  const { t } = useLanguage();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.3);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <section
      id="expertise"
      className="py-24 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
    >
      <div
        ref={contentRef}
        className="max-w-6xl mx-auto px-6"
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 animate-on-scroll animate-fade-down ${
            headerVisible ? 'visible' : ''
          }`}
        >
          <p
            className="font-semibold uppercase tracking-wider mb-3 text-sm"
            style={{ color: theme.accent_color }}
          >
            {t('expertise.label')}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t('expertise.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('expertise.subtitle')}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                value: t('expertise.metrics.ownership.value'),
                title: t('expertise.metrics.ownership.title'),
                description: t('expertise.metrics.ownership.description')
              },
              {
                value: t('expertise.metrics.performance.value'),
                title: t('expertise.metrics.performance.title'),
                description: t('expertise.metrics.performance.description')
              },
              {
                value: t('expertise.metrics.pricing.value'),
                title: t('expertise.metrics.pricing.title'),
                description: t('expertise.metrics.pricing.description')
              }
            ].map((metric, i) => (
              <MetricCard 
                key={i} 
                metric={metric as any}
                index={i} 
              />
            ))}
          </div>
        </div>

        {/* Capabilities Section */}
        <div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            {t('expertise.capabilities.title')}
          </h3>
          <div className="space-y-6">
            {[
              {
                icon: '🌐',
                title: t('expertise.capabilities.website.title'),
                description: t('expertise.capabilities.website.description')
              },
              {
                icon: '⚙️',
                title: t('expertise.capabilities.applications.title'),
                description: t('expertise.capabilities.applications.description')
              },
              {
                icon: '🔧',
                title: t('expertise.capabilities.systems.title'),
                description: t('expertise.capabilities.systems.description')
              }
            ].map((capability, i) => (
              <CapabilityCard
                key={i}
                capability={capability as any}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {t('expertise.cta_text')}
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/25"
          >
            {t('expertise.cta')}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Expertise;
