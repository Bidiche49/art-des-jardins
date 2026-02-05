import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { apiClient } from '@/api/client';

export interface OnboardingStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

// Étapes pour le patron
const patronSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '.dashboard-header',
    title: 'Bienvenue sur Art & Jardin !',
    content: 'Ce guide va vous présenter les fonctionnalités principales de l\'application.',
    placement: 'bottom',
  },
  {
    id: 'dashboard',
    target: '.dashboard-stats',
    title: 'Tableau de bord',
    content: 'Retrouvez ici vos indicateurs clés : chiffre d\'affaires, interventions à venir, factures en attente...',
    placement: 'bottom',
    highlight: true,
  },
  {
    id: 'clients',
    target: '[data-nav="clients"]',
    title: 'Gestion des clients',
    content: 'Gérez votre base clients : particuliers, professionnels, syndics. Créez des fiches détaillées avec historique.',
    placement: 'right',
    highlight: true,
  },
  {
    id: 'chantiers',
    target: '[data-nav="chantiers"]',
    title: 'Suivi des chantiers',
    content: 'Suivez vos chantiers de A à Z : de la visite au règlement, en passant par les interventions.',
    placement: 'right',
    highlight: true,
  },
  {
    id: 'devis',
    target: '[data-nav="devis"]',
    title: 'Devis et factures',
    content: 'Créez des devis professionnels, envoyez-les par email, faites-les signer électroniquement.',
    placement: 'right',
    highlight: true,
  },
  {
    id: 'calendar',
    target: '[data-nav="calendar"]',
    title: 'Planning',
    content: 'Visualisez et planifiez les interventions de votre équipe. Export iCal disponible.',
    placement: 'right',
    highlight: true,
  },
  {
    id: 'analytics',
    target: '[data-nav="analytics"]',
    title: 'Analyses',
    content: 'Suivez la rentabilité de vos chantiers, analysez vos performances et prenez les bonnes décisions.',
    placement: 'right',
    highlight: true,
  },
  {
    id: 'done',
    target: '.dashboard-header',
    title: 'C\'est parti !',
    content: 'Vous êtes prêt à utiliser Art & Jardin. Vous pouvez refaire ce tour à tout moment depuis les paramètres.',
    placement: 'bottom',
  },
];

// Étapes pour l'employé
const employeSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '.dashboard-header',
    title: 'Bienvenue !',
    content: 'Ce guide va vous présenter les fonctionnalités disponibles pour votre travail quotidien.',
    placement: 'bottom',
  },
  {
    id: 'calendar',
    target: '[data-nav="calendar"]',
    title: 'Votre planning',
    content: 'Consultez vos interventions planifiées. Vous recevrez des notifications pour les rappels.',
    placement: 'right',
    highlight: true,
  },
  {
    id: 'interventions',
    target: '.dashboard-interventions',
    title: 'Interventions du jour',
    content: 'Retrouvez ici vos interventions à venir avec les détails : adresse, client, travaux à effectuer.',
    placement: 'bottom',
    highlight: true,
  },
  {
    id: 'photos',
    target: '.quick-actions',
    title: 'Photos avant/après',
    content: 'Documentez votre travail en prenant des photos avant et après chaque intervention.',
    placement: 'bottom',
    highlight: true,
  },
  {
    id: 'done',
    target: '.dashboard-header',
    title: 'Bonne journée !',
    content: 'Vous êtes prêt. Refaites ce tour à tout moment depuis les paramètres.',
    placement: 'bottom',
  },
];

export function useOnboarding() {
  const { user, updateOnboarding } = useAuthStore();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Déterminer les étapes selon le rôle
  const steps = user?.role === 'patron' ? patronSteps : employeSteps;

  // Démarrer automatiquement si onboarding non complété
  useEffect(() => {
    if (user && !user.onboardingCompleted && !isActive) {
      // Petit délai pour laisser le DOM se charger
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStep(user.onboardingStep || 0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isActive]);

  const nextStep = useCallback(async () => {
    const nextIndex = currentStep + 1;

    if (nextIndex >= steps.length) {
      // Terminé
      await completeOnboarding();
    } else {
      setCurrentStep(nextIndex);
      // Sauvegarder la progression
      try {
        await apiClient.patch('/auth/onboarding/step', { step: nextIndex });
        updateOnboarding(false, nextIndex);
      } catch {
        // Ignorer les erreurs de sauvegarde
      }
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(async () => {
    await completeOnboarding();
  }, []);

  const completeOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.patch('/auth/onboarding/complete');
      updateOnboarding(true, steps.length);
      setIsActive(false);
    } catch {
      // Marquer comme terminé localement même si l'API échoue
      updateOnboarding(true, steps.length);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [steps.length, updateOnboarding]);

  const restartOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/onboarding/reset');
      updateOnboarding(false, 0);
      setCurrentStep(0);
      setIsActive(true);
    } catch {
      // Redémarrer localement même si l'API échoue
      updateOnboarding(false, 0);
      setCurrentStep(0);
      setIsActive(true);
    } finally {
      setIsLoading(false);
    }
  }, [updateOnboarding]);

  return {
    isActive,
    currentStep,
    totalSteps: steps.length,
    currentStepData: steps[currentStep] || null,
    isLastStep: currentStep === steps.length - 1,
    isFirstStep: currentStep === 0,
    isLoading,
    nextStep,
    prevStep,
    skipOnboarding,
    restartOnboarding,
    setIsActive,
  };
}
