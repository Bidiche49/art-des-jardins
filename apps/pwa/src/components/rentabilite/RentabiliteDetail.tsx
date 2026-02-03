import { Card, CardTitle, Badge, Spinner } from '@/components/ui';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import type { RentabiliteDto, RentabiliteStatus } from '@/services/rentabilite.service';

interface RentabiliteDetailProps {
  rentabilite: RentabiliteDto | null;
  isLoading: boolean;
  error: Error | null;
}

const STATUS_CONFIG: Record<
  RentabiliteStatus,
  { label: string; variant: 'success' | 'warning' | 'danger'; color: string }
> = {
  profitable: {
    label: 'Rentable',
    variant: 'success',
    color: 'text-green-600',
  },
  limite: {
    label: 'Limite',
    variant: 'warning',
    color: 'text-orange-600',
  },
  perte: {
    label: 'Perte',
    variant: 'danger',
    color: 'text-red-600',
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

interface ProgressBarProps {
  prevu: number;
  reel: number;
}

function ProgressBar({ prevu, reel }: ProgressBarProps) {
  const percentage = prevu > 0 ? Math.min((reel / prevu) * 100, 150) : 0;
  const isOverBudget = reel > prevu;
  const barColor = isOverBudget ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Cout reel vs Prevu</span>
        <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 text-gray-500">
        <span>0</span>
        <span>{formatCurrency(prevu)}</span>
      </div>
    </div>
  );
}

export function RentabiliteDetail({
  rentabilite,
  isLoading,
  error,
}: RentabiliteDetailProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Calcul de la rentabilite...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <div className="text-center py-6">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-800 font-medium">Erreur lors du chargement</p>
          <p className="text-sm text-red-600 mt-1">{error.message}</p>
        </div>
      </Card>
    );
  }

  if (!rentabilite) {
    return (
      <Card className="bg-gray-50">
        <div className="text-center py-6">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600">Aucune donnee de rentabilite disponible</p>
          <p className="text-sm text-gray-500 mt-1">
            Les donnees apparaitront une fois que des heures ou materiaux auront ete enregistres.
          </p>
        </div>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[rentabilite.status];
  const margePositive = rentabilite.marge.montant >= 0;

  return (
    <div className="space-y-6">
      {/* Resume principal */}
      <Card className={`border-2 ${
        rentabilite.status === 'profitable' ? 'border-green-300 bg-green-50' :
        rentabilite.status === 'limite' ? 'border-orange-300 bg-orange-50' :
        'border-red-300 bg-red-50'
      }`}>
        <div className="text-center">
          <Badge variant={statusConfig.variant} size="md" className="mb-3">
            {statusConfig.label}
          </Badge>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(rentabilite.marge.montant)}
          </div>
          <div className={`text-lg font-medium ${statusConfig.color}`}>
            {formatPercentage(rentabilite.marge.pourcentage)} de marge
          </div>
        </div>
      </Card>

      {/* Prevu vs Reel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardTitle className="text-sm text-gray-500 uppercase tracking-wide">
            Prevu (Devis HT)
          </CardTitle>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(rentabilite.prevu.montantHT)}
            </div>
            {rentabilite.prevu.heuresEstimees && (
              <div className="text-sm text-gray-500 mt-1">
                {formatHours(rentabilite.prevu.heuresEstimees)} estimees
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle className="text-sm text-gray-500 uppercase tracking-wide">
            Cout Reel
          </CardTitle>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(rentabilite.reel.coutTotal)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {formatHours(rentabilite.reel.heures)} travaillees
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de progression */}
      <Card>
        <ProgressBar prevu={rentabilite.prevu.montantHT} reel={rentabilite.reel.coutTotal} />
      </Card>

      {/* Detail des couts */}
      <Card>
        <CardTitle>Decomposition des couts</CardTitle>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">Cout main d'oeuvre</div>
              <div className="text-sm text-gray-500">
                {formatHours(rentabilite.reel.heures)} travaillees
              </div>
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(rentabilite.reel.coutHeures)}
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">Cout materiaux</div>
              <div className="text-sm text-gray-500">
                Fournitures et consommables
              </div>
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(rentabilite.reel.coutMateriaux)}
            </div>
          </div>
          <div className="flex justify-between items-center py-2 font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(rentabilite.reel.coutTotal)}</span>
          </div>
        </div>
      </Card>

      {/* Detail heures par employe */}
      {rentabilite.reel.heuresDetail && rentabilite.reel.heuresDetail.length > 0 && (
        <Card>
          <CardTitle>Heures par employe</CardTitle>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employe</TableHead>
                  <TableHead className="text-right">Heures</TableHead>
                  <TableHead className="text-right">Taux</TableHead>
                  <TableHead className="text-right">Cout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentabilite.reel.heuresDetail.map((detail) => (
                  <TableRow key={detail.employeId}>
                    <TableCell>{detail.employeNom}</TableCell>
                    <TableCell className="text-right">
                      {formatHours(detail.heures)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(detail.tauxHoraire)}/h
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(detail.cout)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Detail materiaux */}
      {rentabilite.reel.materiauxDetail && rentabilite.reel.materiauxDetail.length > 0 && (
        <Card>
          <CardTitle>Materiaux utilises</CardTitle>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Materiau</TableHead>
                  <TableHead className="text-right">Qte</TableHead>
                  <TableHead className="text-right">Prix unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentabilite.reel.materiauxDetail.map((materiau, index) => (
                  <TableRow key={index}>
                    <TableCell>{materiau.nom}</TableCell>
                    <TableCell className="text-right">{materiau.quantite}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(materiau.prixUnitaire)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(materiau.totalCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Alerte si en perte */}
      {rentabilite.status === 'perte' && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-800">Attention : Chantier en perte</h4>
              <p className="text-sm text-red-700 mt-1">
                Les couts reels depassent significativement le montant du devis.
                Verifiez les heures enregistrees et les materiaux utilises.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default RentabiliteDetail;
