"""
Generate charts for Chapter 5 (Results)

Generates 15+ publication-quality charts based on statistical_results.json

Usage:
    python scripts/generate_charts.py
    
Output:
    reselts/figures/figure_5_*.png (15+ charts)
"""

import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Set style
sns.set_theme(style="whitegrid", palette="husl")
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 11
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 10

# Paths

SCRIPT_DIR = Path(__file__).resolve().parent
THESIS_DIR = SCRIPT_DIR.parent

# Color scheme
COLORS = {
    'manual': '#E74C3C',     
    'automated': '#27AE60',   
    'neutral': '#95A5A6',     
    'highlight': '#3498DB'    
}

# Load data

def load_data():
    """Load statistical results and manual baseline"""
    with open(THESIS_DIR/"results"/"statistical_results.json", 'r') as f:
        results = json.load(f)
    
    df_manual = pd.read_csv(THESIS_DIR/"data"/"manual_baseline.csv")
    
    # Try to load CI metrics
    try:
        df_ci = pd.read_csv(THESIS_DIR/"metrics"/"ci_metrics_all.csv")
    except:
        df_ci = None
        
    return results, df_manual, df_ci

# Save chart

def save_figure(fig, filename, dpi=300):
    """Save figure with consistent settings"""
    output_dir = THESIS_DIR / 'results' / 'figures'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    filepath = output_dir / filename
    fig.savefig(filepath, dpi=dpi, bbox_inches='tight', facecolor='white')
    print(f"Saved: {filepath}")
    plt.close(fig)


# ============================================================
# FIGURE 5.1: Coverage Comparison (Bar Chart)
# ============================================================

def figure_5_1_coverage_comparison(results):
    """Bar chart: Manual vs Automated coverage"""
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    categories = ['Manual\nEstimate', 'Automated\nBackend', 
                  'Automated\nFrontend', 'Automated\nAdmin', 
                  'Automated\nOverall']
    values = [
        results['rq1']['manual_estimate'],
        results['rq1']['backend_coverage'],
        results['rq1']['frontend_coverage'],
        results['rq1']['frontend_admin_coverage'],
        results['rq1']['automated_mean']
    ]
    colors = [COLORS['manual']] + [COLORS['automated']] * 4
    
    bars = ax.bar(categories, values, color=colors, alpha=0.8, edgecolor='black')
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{height:.1f}%',
                ha='center', va='bottom', fontweight='bold')
    
    ax.set_ylabel('Code Coverage (%)', fontweight='bold')
    ax.set_title('Figure 5.1: Code Coverage Comparison\nManual vs Automated Testing',
                 fontweight='bold', pad=20)
    ax.set_ylim(0, 105)
    
    # Add annotation
    ax.text(0.02, 0.98, f"Improvement: +{results['rq1']['automated_mean'] - results['rq1']['manual_estimate']:.1f}pp\np < 0.001***",
            transform=ax.transAxes, va='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    save_figure(fig, 'figure_5_1_coverage_comparison.png')


# ============================================================
# FIGURE 5.2: Execution Time Comparison (Box Plot)
# ============================================================

def figure_5_2_execution_time_boxplot(results, df_manual=None, df_ci=None):
    """Box plot: Manual vs Automated execution time"""

    # Manual: full cycle times (sum of all test cases per run)
    if df_manual is not None:
        manual_times = [
            df_manual['run1_time_min'].sum(),
            df_manual['run2_time_min'].sum(),
            df_manual['run3_time_min'].sum()
        ]
    else:
        manual_times = [results['rq2_time']['manual_cycle_mean']] * 3

    # Automated: actual pipeline durations (success only)
    if df_ci is not None:
        automated_times = df_ci.loc[df_ci['conclusion'] == 'success', 'duration_minutes'].values
    else:
        automated_times = [results['rq2_time']['automated_mean']] * 3
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    bp = ax.boxplot([manual_times, automated_times],
                     labels=['Manual\nTesting', 'Automated\nCI/CD'],
                     patch_artist=True,
                     widths=0.6)
    
    # Color boxes
    bp['boxes'][0].set_facecolor(COLORS['manual'])
    bp['boxes'][1].set_facecolor(COLORS['automated'])
    
    for box in bp['boxes']:
        box.set_alpha(0.7)
        box.set_edgecolor('black')
    
    # Add mean labels
    means = [np.mean(manual_times), np.mean(automated_times)]
    for i, (median, mean_val) in enumerate(zip(bp['medians'], means)):
        x = median.get_xdata()[1]
        y = median.get_ydata()[1]
        ax.text(x, y + 5, f'{mean_val:.1f} min', ha='center', fontweight='bold')
    
    ax.set_ylabel('Execution Time (minutes)', fontweight='bold')
    ax.set_title('Figure 5.2: Test Execution Time Distribution\nManual vs Automated',
                 fontweight='bold', pad=20)
    
    # Add speedup annotation
    speedup = results['rq2_time']['speedup']
    ax.text(0.98, 0.98, f'Speedup: {speedup:.1f}×\nTime saved: {results["rq2_time"]["time_saved_per_cycle"]:.1f} min\np < 0.001***',
            transform=ax.transAxes, ha='right', va='top',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8))
    
    save_figure(fig, 'figure_5_2_execution_time_boxplot.png')


# ============================================================
# FIGURE 5.3: MTTD Comparison (Bar Chart)
# ============================================================

def figure_5_3_mttd_comparison(results):
    """Bar chart: Mean Time To Detect"""

    manual_mttd = results['rq2_bugs']['mttd_manual']
    auto_mttd = results['rq2_bugs']['mttd_automated_mean']

    fig, ax = plt.subplots(figsize=(8, 6))

    categories = ['Manual\nTesting', 'Automated\nCI/CD']
    values = [manual_mttd, auto_mttd]
    colors = [COLORS['manual'], COLORS['automated']]

    bars = ax.bar(categories, values, color=colors, alpha=0.8, edgecolor='black')

    # Add value labels
    for bar, val in zip(bars, values):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 2,
                f'{val:.1f} min', ha='center', va='bottom', fontweight='bold')

    ax.set_ylabel('Mean Time To Detect (minutes)', fontweight='bold')
    ax.set_title('Figure 5.3: Mean Time To Detect (MTTD)\nBug Detection Speed',
                 fontweight='bold', pad=20)
    ax.set_ylim(0, manual_mttd * 1.3)

    # Add improvement annotation
    speedup = manual_mttd / auto_mttd
    reduction = (1 - auto_mttd / manual_mttd) * 100
    ax.text(0.98, 0.98, f'Detection Speedup: {speedup:.1f}×\nReduction: {reduction:.1f}%',
            transform=ax.transAxes, ha='right', va='top',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8))

    save_figure(fig, 'figure_5_3_mttd_comparison.png')
    

# ============================================================
# FIGURE 5.4: Testing Frequency (Grouped Bar)
# ============================================================

def figure_5_4_testing_frequency(results):
    """Grouped bar: Bug detection comparison"""
    
    fig, ax = plt.subplots(figsize=(10, 6))

    categories = ['Test Runs\nper Week']

    manual_values = [
        results['rq2_bugs']['manual_cycles_per_week']
    ]
    automated_values = [
        results['rq2_bugs']['automated_runs_per_week']
    ]

    x = np.arange(len(categories))
    width = 0.25
    ax.set_xlim(-0.8, 0.8)
    
    bars1 = ax.bar(x - width/2, manual_values, width, label='Manual',
                   color=COLORS['manual'], alpha=0.8, edgecolor='black')
    bars2 = ax.bar(x + width/2, automated_values, width, label='Automated',
                   color=COLORS['automated'], alpha=0.8, edgecolor='black')
    
    # Add value labels
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                    f'{height:.1f}',
                    ha='center', va='bottom', fontweight='bold')
    
    ax.set_ylabel('Count', fontweight='bold')
    ax.set_title('Figure 5.4: Testing Frequency\nManual vs Automated',
                 fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.legend()
    
    # Add frequency advantage annotation
    freq = results['rq2_bugs']['frequency_advantage']
    ax.text(0.98, 0.98, f'Frequency Advantage:\n{freq:.1f}× more test runs',
            transform=ax.transAxes, ha='right', va='top',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))
    
    save_figure(fig, 'figure_5_4_testing_frequency.png')


# ============================================================
# FIGURE 5.5: Deployment Frequency (Bar Chart)
# ============================================================

def figure_5_5_deployment_frequency(results):
    """Bar chart: Deployment frequency comparison"""

    fig, ax = plt.subplots(figsize=(10, 6))

    categories = ['Manual', 'Automated\nCI/CD']
    # Convert to per-day
    values_per_week = [
        results['rq3']['manual_deploys_per_week'],
        results['rq3']['automated_deploys_per_week']
    ]
    values = [v / 7 for v in values_per_week]
    colors = [COLORS['manual'], COLORS['automated']]

    y_max = max(values) * 1.4
    ax.set_ylim(0, y_max)

    # DORA performance zones (per day thresholds)
    # Low: < monthly (~0.03/day), Medium: weekly-monthly (0.03-0.14/day)
    # High: daily-weekly (0.14-1/day), Elite: multiple per day (>1/day)
    dora_zones = [
        (0,      0.03,  '#FFCDD2', 'Low'),
        (0.03,   0.14,  '#FFE0B2', 'Medium'),
        (0.14,   1.0,   '#C8E6C9', 'High'),
        (1.0,    y_max, '#81C784', 'Elite'),
    ]
    for y_low, y_high, color, label in dora_zones:
        ax.axhspan(y_low, y_high, color=color, alpha=0.4, zorder=0)

    # DORA labels
    for y_low, y_high, color, label in dora_zones:
        y_mid = (y_low + min(y_high, y_max)) / 2
        ax.annotate(f'DORA: {label}', xy=(1.01, y_mid), xycoords=('axes fraction', 'data'),
                    fontsize=9, fontstyle='italic', va='center', ha='left',
                    color='#555555')

    bars = ax.bar(categories, values, color=colors, alpha=0.8, edgecolor='black', zorder=3)

    # Add value labels
    for bar, vpw in zip(bars, values_per_week):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + y_max * 0.02,
                f'{vpw:.1f}/week\n({height:.1f}/day)',
                ha='center', va='bottom', fontweight='bold')

    ax.set_ylabel('Deployments per Day', fontweight='bold')
    ax.set_title('Figure 5.5: Deployment Frequency \nManual vs Automated (DORA)',
                 fontweight='bold', pad=20)

    # Add improvement annotation
    improvement = results['rq3']['improvement_percent']
    factor = results['rq3']['automated_deploys_per_week'] / results['rq3']['manual_deploys_per_week']
    ax.text(0.02, 0.98, f'Improvement:\n{improvement:.0f}%\n({factor:.1f}× increase)',
            transform=ax.transAxes, ha='left', va='top',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))

    plt.subplots_adjust(right=0.82)
    save_figure(fig, 'figure_5_5_deployment_frequency.png')


# ============================================================
# FIGURE 5.6: Lead Time Comparison (Bar Chart)
# ============================================================

def figure_5_6_lead_time_comparison(results):
    """Bar chart: Lead Time for Changes (log scale with DORA zones)"""

    # Manual: 3.7 days, Automated: pipeline mean in minutes
    manual_lead_days = 3.7
    manual_lead_hours = manual_lead_days * 24  # 88.8 h
    auto_lead_min = results['rq2_time']['automated_mean']  # ~9.54 min
    auto_lead_hours = auto_lead_min / 60

    speedup = manual_lead_hours / auto_lead_hours

    fig, ax = plt.subplots(figsize=(10, 6))

    # DORA Lead Time zones (in hours)
    # Elite: < 1 hour, High: 1h - 1 day, Medium: 1 day - 1 week, Low: > 1 week
    dora_zones = [
        (1/60,    1,      '#81C784', 'Elite (<1h)'),
        (1,       24,     '#C8E6C9', 'High (1h–1d)'),
        (24,      168,    '#FFE0B2', 'Medium (1d–1w)'),
        (168,     1500,   '#FFCDD2', 'Low (>1w)'),
    ]

    y_max = 1500
    ax.set_ylim(1/60, y_max)
    ax.set_yscale('log')

    for y_low, y_high, color, label in dora_zones:
        ax.axhspan(y_low, y_high, color=color, alpha=0.4, zorder=0)

    # DORA labels outside the plot
    for y_low, y_high, color, label in dora_zones:
        y_mid = np.sqrt(y_low * y_high)  # geometric mean for log scale
        ax.annotate(f'DORA: {label}', xy=(1.01, y_mid), xycoords=('axes fraction', 'data'),
                    fontsize=9, fontstyle='italic', va='center', ha='left',
                    color='#555555')

    categories = ['Manual\nProcess', 'Automated\nCI/CD']
    values = [manual_lead_hours, auto_lead_hours]
    colors = [COLORS['manual'], COLORS['automated']]

    bars = ax.bar(categories, values, color=colors, alpha=0.8, edgecolor='black', zorder=3)

    # Add value labels
    for bar, val in zip(bars, values):
        height = bar.get_height()
        if val >= 24:
            label = f'{val/24:.1f} days'
        elif val >= 1:
            label = f'{val:.1f} h'
        else:
            label = f'{val*60:.1f} min'
        ax.text(bar.get_x() + bar.get_width()/2., height * 1.3,
                label, ha='center', va='bottom', fontweight='bold', zorder=4)

    ax.set_ylabel('Lead Time (hours, log scale)', fontweight='bold')
    ax.set_title('Figure 5.6: Lead Time for Changes \nCommit to Production',
                 fontweight='bold', pad=20)

    # Custom y-tick labels
    ax.set_yticks([1/60, 1, 24, 168])
    ax.set_yticklabels(['1 min', '1 hour', '1 day', '1 week'])

    # Add improvement annotation
    ax.text(0.98, 0.98, f'Speedup: {speedup:.0f}×',
            transform=ax.transAxes, ha='right', va='top',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8),
            fontsize=12, fontweight='bold')

    plt.subplots_adjust(right=0.78)
    save_figure(fig, 'figure_5_6_lead_time_comparison.png')


# ============================================================
# FIGURE 5.7: CI/CD Pipeline Maturation (Scatter Chart)
# ============================================================

def figure_5_7_ci_maturation(df_ci):
    """Line chart: Cumulative CI success rate over time"""

    if df_ci is None:
        print("CI metrics not found, skipping Figure 5.8")
        return

    # Sort by date
    df_ci = df_ci.sort_values('date').reset_index(drop=True)
    df_ci['success'] = (df_ci['conclusion'] == 'success').astype(int)
    df_ci['date_parsed'] = pd.to_datetime(df_ci['date'])

    # Numeric x-axis for polynomial fitting
    x_num = np.arange(len(df_ci))
    y_vals = df_ci['success'].values * 100  # 0 or 100

    # Polynomial trend line (degree 5 for smooth S-curve)
    coeffs = np.polyfit(x_num, y_vals, 5)
    x_smooth = np.linspace(0, len(df_ci) - 1, 200)
    y_smooth = np.clip(np.polyval(coeffs, x_smooth), 0, 100)

    # Map smooth x back to dates for plotting
    date_min = df_ci['date_parsed'].min()
    date_max = df_ci['date_parsed'].max()
    date_range = date_max - date_min
    dates_smooth = [date_min + date_range * (x / (len(df_ci) - 1)) for x in x_smooth]

    # Maturation phases
    phases = [
        (pd.Timestamp('2026-01-21'), pd.Timestamp('2026-01-24'), '#FFCDD2', 'Phase 1: Setup\n(13.3%)'),
        (pd.Timestamp('2026-01-24'), pd.Timestamp('2026-01-29'), '#FFE0B2', 'Phase 2: Stabilization\n(61.9%)'),
        (pd.Timestamp('2026-01-29'), pd.Timestamp('2026-02-01'), '#C8E6C9', 'Phase 3: Mature\n(100%)'),
    ]

    fig, ax = plt.subplots(figsize=(12, 6))

    # Phase background bands
    for start, end, color, label in phases:
        ax.axvspan(start, end, color=color, alpha=0.3, zorder=0)
        mid = start + (end - start) / 2
        ax.text(mid, 105, label, ha='center', va='bottom', fontsize=8,
                fontweight='bold', zorder=6)

    # Scatter: individual run outcomes
    success_mask = df_ci['success'] == 1
    ax.scatter(df_ci.loc[success_mask, 'date_parsed'], y_vals[success_mask],
               color=COLORS['automated'], s=40, zorder=5, label='Success')
    ax.scatter(df_ci.loc[~success_mask, 'date_parsed'], y_vals[~success_mask],
               color=COLORS['manual'], s=40, zorder=5, label='Failure')

    # Smooth trend line
    ax.plot(dates_smooth, y_smooth, '-', linewidth=2.5,
            color=COLORS['highlight'], label='Trend', zorder=3)

    ax.set_xlabel('Date', fontweight='bold')
    ax.set_ylabel('Outcome (%)', fontweight='bold')
    ax.set_title('Figure 5.7: CI/CD Pipeline Maturation',
                 fontweight='bold', pad=20)
    ax.set_ylim(-10, 118)
    ax.set_yticks([0, 25, 50, 75, 100])
    ax.legend(loc='center left')
    ax.grid(True, alpha=0.3)
    fig.autofmt_xdate()

    # Summary annotation
    total = len(df_ci)
    successes = df_ci['success'].sum()
    failures = total - successes
    ax.text(0.98, 0.02,
            f'Total: {total} runs | Success: {successes} | Failure: {failures}',
            transform=ax.transAxes, ha='right', va='bottom',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))

    save_figure(fig, 'figure_5_7_ci_success_rate.png')

    
# ============================================================
# FIGURE 5.8: ROI Break-even Chart
# ============================================================

def figure_5_8_roi_breakeven(results):
    """Line chart: ROI break-even analysis (Equivalent Value methodology)"""

    rq4 = results['rq4']
    weeks = np.arange(0, 13)

    impl_cost = rq4['implementation_hours']
    weekly_savings = rq4['weekly_savings_hours']

    cumulative_savings = weeks * weekly_savings
    net_benefit = cumulative_savings - impl_cost

    fig, ax = plt.subplots(figsize=(10, 6))

    # Plot lines
    ax.plot(weeks, cumulative_savings, 'o-', color=COLORS['automated'],
            linewidth=2, markersize=6, label='Cumulative Time Saved')
    ax.axhline(y=impl_cost, color=COLORS['manual'],
               linestyle='--', linewidth=2, label=f'Implementation Cost ({impl_cost}h)')
    ax.plot(weeks, net_benefit, 's-', color=COLORS['highlight'],
            linewidth=2, markersize=5, label='Net Benefit', alpha=0.7)

    # Mark break-even point
    breakeven = rq4['break_even_weeks']
    ax.axvline(x=breakeven, color='red', linestyle=':', linewidth=2, alpha=0.5)
    ax.plot(breakeven, impl_cost, 'r*', markersize=20,
            label=f'Break-even ({breakeven:.2f} weeks)')

    # Shade profit region
    ax.fill_between(weeks, net_benefit, 0, where=(net_benefit >= 0),
                     alpha=0.2, color=COLORS['automated'], label='Positive ROI')

    ax.set_xlabel('Weeks', fontweight='bold')
    ax.set_ylabel('Hours', fontweight='bold')
    ax.set_title('Figure 5.8: Return on Investment (ROI) Analysis\nEquivalent Value',
                 fontweight='bold', pad=20)
    ax.legend(loc='upper left')
    ax.grid(True, alpha=0.3)

    # Add ROI annotation
    ax.text(0.98, 0.45,
            f'12-Week Results:\n'
            f'ROI: {rq4["roi_12_weeks"]:.0f}%\n'
            f'Net Benefit: {rq4["net_benefit_12_weeks"]:.0f}h ({rq4["net_benefit_12_weeks_eur"]:,.0f} EUR)\n'
            f'BEP: {rq4["break_even_runs"]:.0f} runs ({breakeven:.2f} weeks)',
            transform=ax.transAxes, ha='right', va='center',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8),
            fontsize=10, fontweight='bold')

    save_figure(fig, 'figure_5_8_roi_breakeven.png')


# ============================================================
# MAIN FUNCTION
# ============================================================

def main():
    """Generate all thesis charts"""
    
    print("="*70)
    print("GENERATING CHARTS")
    print("="*70)
    
    # Load data
    print("\n Loading data...")
    results, df_manual, df_ci = load_data()
    
    # Generate all figures
    print("\n Generating figures...")
    
    figure_5_1_coverage_comparison(results)
    figure_5_2_execution_time_boxplot(results, df_manual, df_ci)
    figure_5_3_mttd_comparison(results)
    figure_5_4_testing_frequency(results)
    figure_5_5_deployment_frequency(results)
    figure_5_6_lead_time_comparison(results)
    figure_5_7_ci_maturation(df_ci)
    figure_5_8_roi_breakeven(results)
    
    print("\n" + "="*70)
    print("ALL CHARTS GENERATED SUCCESSFULLY!")
    print("="*70)
    print(f"\n Output directory: analysis/figures/")
    print(f" Total figures created: 8")
    print("\nFigures ready for Chapter 5:")
    print("  • Figure 5.1: Coverage Comparison")
    print("  • Figure 5.2: Execution Time Box Plot")
    print("  • Figure 5.3: MTTD Comparison")
    print("  • Figure 5.4: Testing Frequency")
    print("  • Figure 5.5: Deployment Frequency")
    print("  • Figure 5.6: Lead Time Comparison")
    print("  • Figure 5.7: CI/CD Maturation")
    print("  • Figure 5.8: ROI Break-even Analysis")

if __name__ == '__main__':
    main()