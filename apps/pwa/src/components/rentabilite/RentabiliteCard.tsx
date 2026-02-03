import { Link } from 'react-router-dom';
import { Card, Badge, Spinner } from '@/components/ui';
import { useRentabilite } from '@/hooks/useRentabilite';
import type { RentabiliteStatus } from '@/services/rentabilite.service';

interface RentabiliteCardProps {
  chantierId: string;
  compact?: boolean;
}

const STATUS_CONFIG: Record<
  RentabiliteStatus,
  { label: string; variant: 'success' | 'warning' | 'danger'; bgClass: string }
> = {
  profitable: {
    label: 'Rentable',
    variant: 'success',
    bgClass: 'bg-green-50 border-green-200',
  },
  limite: {
    label: 'Limite',
    variant: 'warning',
    bgClass: 'bg-orange-50 border-orange-200',
  },
  perte: {
    label: 'Perte',
    variant: 'danger',
    bgClass: 'bg-red-50 border-red-200',
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function RentabiliteCard({ chantierId, compact = false }: RentabiliteCardProps) {
  const { rentabilite, isLoading, error } = useRentabilite(chantierId);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center py-4">
        <Spinner size="sm" />
        <span className="ml-2 text-sm text-gray-500">Calcul rentabilite...</span>
      </Card>
    );
  }

  if (error || !rentabilite) {
    return (
      <Card className="bg-gray-50">
        <div className="text-center text-sm text-gray-500 py-2">
          Rentabilite non disponible
        </div>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[rentabilite.status];
  const margePositive = rentabilite.marge.montant >= 0;

  if (compact) {
    return (
      <Link to={`/chantiers/${chantierId}/rentabilite`} className="block">
        <Card
          hoverable
          className={`${statusConfig.bgClass} border`}
          padding="sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {formatCurrency(rentabilite.marge.montant)}
              </span>
              <span
                className={`text-sm font-medium ${
                  margePositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ({formatPercentage(rentabilite.marge.pourcentage)})
              </span>
            </div>
            <Badge variant={statusConfig.variant} size="sm">
              {statusConfig.label}
            </Badge>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/chantiers/${chantierId}/rentabilite`} className="block">
      <Card hoverable className={`${statusConfig.bgClass} border`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Rentabilite</h3>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Marge</span>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(rentabilite.marge.montant)}
              </span>
              <span
                className={`ml-2 text-sm font-medium ${
                  margePositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatPercentage(rentabilite.marge.pourcentage)}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Prevu (devis HT)</span>
            <span className="font-medium">
              {formatCurrency(rentabilite.prevu.montantHT)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Cout reel</span>
            <span className="font-medium">
              {formatCurrency(rentabilite.reel.coutTotal)}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Cliquez pour voir le detail
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default RentabiliteCard;
