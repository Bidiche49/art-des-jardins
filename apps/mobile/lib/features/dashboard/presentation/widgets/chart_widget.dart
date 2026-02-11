import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class RevenueBarChart extends StatelessWidget {
  const RevenueBarChart({
    super.key,
    required this.data,
    this.previousYearData,
    this.height = 200,
  });

  final List<double> data;
  final List<double>? previousYearData;
  final double height;

  static const _months = [
    'J', 'F', 'M', 'A', 'M', 'J',
    'J', 'A', 'S', 'O', 'N', 'D',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final maxValue = _computeMaxValue();

    return SizedBox(
      height: height,
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          maxY: maxValue,
          barTouchData: BarTouchData(
            enabled: true,
            touchTooltipData: BarTouchTooltipData(
              tooltipRoundedRadius: 8,
              getTooltipItem: (group, groupIndex, rod, rodIndex) {
                final value = rod.toY;
                return BarTooltipItem(
                  '${_months[group.x]}: ${_formatK(value)}',
                  TextStyle(
                    color: theme.colorScheme.onInverseSurface,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                );
              },
            ),
          ),
          titlesData: FlTitlesData(
            show: true,
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  if (value.toInt() >= 0 && value.toInt() < _months.length) {
                    return Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        _months[value.toInt()],
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontSize: 10,
                        ),
                      ),
                    );
                  }
                  return const SizedBox.shrink();
                },
                reservedSize: 20,
              ),
            ),
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 40,
                getTitlesWidget: (value, meta) {
                  return Text(
                    _formatK(value),
                    style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                  );
                },
              ),
            ),
            topTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            rightTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
          ),
          gridData: FlGridData(
            show: true,
            drawVerticalLine: false,
            horizontalInterval: maxValue > 0 ? maxValue / 4 : 1,
          ),
          borderData: FlBorderData(show: false),
          barGroups: _buildBarGroups(theme),
        ),
      ),
    );
  }

  List<BarChartGroupData> _buildBarGroups(ThemeData theme) {
    return List.generate(data.length, (i) {
      final rods = <BarChartRodData>[
        BarChartRodData(
          toY: data[i],
          color: theme.colorScheme.primary,
          width: previousYearData != null ? 8 : 14,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
        ),
      ];

      if (previousYearData != null && i < previousYearData!.length) {
        rods.insert(
          0,
          BarChartRodData(
            toY: previousYearData![i],
            color: theme.colorScheme.primary.withAlpha(80),
            width: 8,
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(4)),
          ),
        );
      }

      return BarChartGroupData(
        x: i,
        barRods: rods,
        barsSpace: 2,
      );
    });
  }

  double _computeMaxValue() {
    double max = 0;
    for (final v in data) {
      if (v > max) max = v;
    }
    if (previousYearData != null) {
      for (final v in previousYearData!) {
        if (v > max) max = v;
      }
    }
    return max > 0 ? max * 1.2 : 1000;
  }

  static String _formatK(double value) {
    if (value >= 1000) {
      return '${(value / 1000).toStringAsFixed(0)}k';
    }
    return value.toStringAsFixed(0);
  }
}
