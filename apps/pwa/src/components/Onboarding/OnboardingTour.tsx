import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/Button';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
}

export function OnboardingTour() {
  const {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    isLastStep,
    isFirstStep,
    isLoading,
    nextStep,
    prevStep,
    skipOnboarding,
  } = useOnboarding();

  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculer la position du spotlight et du tooltip
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const updatePositions = () => {
      const target = document.querySelector(currentStepData.target);

      if (target) {
        const rect = target.getBoundingClientRect();
        const padding = 8;

        setSpotlightRect({
          top: rect.top - padding + window.scrollY,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });

        // Calculer la position du tooltip
        const tooltipWidth = 320;
        const tooltipHeight = 200; // Approximatif
        let tooltipTop = 0;
        let tooltipLeft = 0;

        switch (currentStepData.placement) {
          case 'bottom':
            tooltipTop = rect.bottom + window.scrollY + 16;
            tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'top':
            tooltipTop = rect.top + window.scrollY - tooltipHeight - 16;
            tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'left':
            tooltipTop = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
            tooltipLeft = rect.left - tooltipWidth - 16;
            break;
          case 'right':
            tooltipTop = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
            tooltipLeft = rect.right + 16;
            break;
        }

        // S'assurer que le tooltip reste dans la viewport
        tooltipLeft = Math.max(16, Math.min(tooltipLeft, window.innerWidth - tooltipWidth - 16));
        tooltipTop = Math.max(16, tooltipTop);

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

        // Scroller vers l'élément si nécessaire
        if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Élément non trouvé, centrer le tooltip
        setSpotlightRect(null);
        setTooltipPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 160,
        });
      }
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [isActive, currentStepData]);

  if (!isActive || !currentStepData) return null;

  const overlay = (
    <div className="fixed inset-0 z-[9998]">
      {/* Overlay avec trou pour le spotlight */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left}
                y={spotlightRect.top}
                width={spotlightRect.width}
                height={spotlightRect.height}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Bordure autour du spotlight */}
      {spotlightRect && currentStepData.highlight && (
        <div
          className="absolute border-2 border-green-500 rounded-lg pointer-events-none animate-pulse"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-white rounded-xl shadow-2xl p-6 w-80 z-[9999] animate-fade-in"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Indicateur de progression */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Contenu */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          {currentStepData.content}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={skipOnboarding}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            Passer
          </button>

          <div className="flex gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={isLoading}
              >
                Précédent
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={nextStep}
              isLoading={isLoading}
            >
              {isLastStep ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </div>

        {/* Indicateur d'étape */}
        <div className="text-center text-xs text-gray-400 mt-4">
          {currentStep + 1} / {totalSteps}
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
